import yargs from "yargs";
import * as dotenv from "dotenv";
import LabeledProcessRunner from "./runner.js";
import * as fs from "fs";
import { ServerlessStageDestroyer } from "@stratiformdigital/serverless-stage-destroyer";
import { SechubGithubSync } from "@stratiformdigital/security-hub-sync";
import {
  CloudFormationClient,
  paginateDescribeStacks,
  Tag,
} from "@aws-sdk/client-cloudformation";

// load .env
dotenv.config();

const runner = new LabeledProcessRunner();

function touch(file: string) {
  try {
    const time = new Date();
    fs.utimesSync(file, time, time);
  } catch (err) {
    fs.closeSync(fs.openSync(file, "w"));
  }
}

async function frozenInstall(runner: LabeledProcessRunner, dir: string) {
  await runner.run_command_and_output(
    `${dir.split("/").slice(-1)} deps`,
    ["yarn", "install", "--frozen-lockfile"],
    dir
  );
}

async function install_deps(runner: LabeledProcessRunner, dir: string) {
  if (process.env.CI == "true") {
    if (!fs.existsSync(`${dir}/node_modules`)) {
      await frozenInstall(runner, dir);
    }
  } else {
    if (
      !fs.existsSync(`${dir}/.yarn_install`) ||
      fs.statSync(`${dir}/.yarn_install`).ctimeMs <
        fs.statSync(`${dir}/yarn.lock`).ctimeMs
    ) {
      await frozenInstall(runner, dir);
      touch(`${dir}/.yarn_install`);
    }
  }
}

async function install_deps_for_services() {
  var services = getDirectories("src/services");
  for (let service of services) {
    await install_deps(runner, `src/services/${service}`);
  }
  await install_deps(runner, `src/libs`);
}

function getDirectories(path: string) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + "/" + file).isDirectory();
  });
}

async function refreshOutputs(stage: string) {
  await runner.run_command_and_output(
    `SLS Refresh Outputs`,
    ["sls", "refresh-outputs", "--stage", stage],
    ".",
    true
  );
}

function tagsListToTagDict(tagList: Tag[]) {
  const retVal = {};
  for (const keyValPair of tagList) {
    if (keyValPair.Key) {
      retVal[keyValPair.Key] = keyValPair.Value;
    }
  }
  return retVal;
}

async function getAllStagesForRegion(region: string) {
  const client = new CloudFormationClient({ region: region });
  const stages: string[] = [];

  for await (const page of paginateDescribeStacks({ client }, {})) {
    if (page.Stacks) {
      stages.push(
        ...new Set(
          page.Stacks.reduce((acc: string[], stack) => {
            const tags = tagsListToTagDict(stack.Tags || []);
            if (
              tags["STAGE"] &&
              tags["STAGE"] !== "master" &&
              tags["PROJECT"] === process.env.PROJECT
            ) {
              acc.push(tags["STAGE"]);
            }
            return acc;
          }, [])
        )
      );
    }
  }
  return stages;
}

yargs(process.argv.slice(2))
  .command("install", "install all service dependencies", {}, async () => {
    await install_deps_for_services();
  })
  .command(
    "deploy",
    "deploy the project",
    {
      stage: { type: "string", demandOption: true },
    },
    async (options) => {
      await install_deps_for_services();
      await refreshOutputs(options.stage);
      await runner.run_command_and_output(
        `SLS Compose Deploy`,
        ["sls", "deploy", "--stage", options.stage],
        "."
      );
    }
  )
  .command(
    "deployInfra",
    "deploy the infra/dot services",
    {
      stage: { type: "string", demandOption: true },
    },
    async (options) => {
      await install_deps_for_services();
      await refreshOutputs(options.stage);
      await runner.run_command_and_output(
        `SLS Deploy delete-topics`,
        ["sls", "deploy", "--stage", options.stage],
        "src/services/.delete-topics"
      );
    }
  )
  .command(
    "test",
    "run any available tests for a bigmac stage.",
    {
      stage: { type: "string", demandOption: true },
    },
    async (options) => {
      await install_deps_for_services();
      await refreshOutputs(options.stage);
      await runner.run_command_and_output(
        `Test bigmac-mgmt`,
        ["sls", "bigmac-mgmt", "testFunction", "--stage", options.stage],
        "."
      );
      await runner.run_command_and_output(
        `Test lmdc`,
        ["sls", "lmdc", "testFunction", "--stage", options.stage],
        "."
      );
    }
  )
  .command(
    "destroy",
    "destroy a stage in AWS",
    {
      stage: { type: "string", demandOption: true },
      service: { type: "string", demandOption: false },
      wait: { type: "boolean", demandOption: false, default: true },
      verify: { type: "boolean", demandOption: false, default: true },
    },
    async (options) => {
      let destroyer = new ServerlessStageDestroyer();
      let filters = [
        {
          Key: "PROJECT",
          Value: `${process.env.PROJECT}`,
        },
      ];
      if (options.service) {
        filters.push({
          Key: "SERVICE",
          Value: `${options.service}`,
        });
      }
      await destroyer.destroy(`${process.env.REGION_A}`, options.stage, {
        wait: options.wait,
        filters: filters,
        verify: options.verify,
      });
    }
  )
  .command(
    "syncSecurityHubFindings",
    "Syncs Sec Hub findings to GitHub Issues... usually only run by the CI system.",
    {
      auth: { type: "string", demandOption: true },
      repository: { type: "string", demandOption: true },
      accountNickname: { type: "string", demandOption: true },
    },
    async (options) => {
      for (let region of [process.env.REGION_A, process.env.REGION_B]) {
        var sync = new SechubGithubSync({
          repository: options.repository,
          auth: options.auth,
          region: region,
          accountNickname: options.accountNickname,
          severity: ["CRITICAL", "HIGH", "MEDIUM"],
        });
        await sync.sync();
      }
    }
  )
  .command(
    "connect",
    "Prints a connection string that can be run to 'ssh' directly onto the ECS Fargate task",
    {
      stage: { type: "string", demandOption: true },
      service: { type: "string", demandOption: true },
    },
    async (options) => {
      await install_deps_for_services();
      await refreshOutputs(options.stage);
      await runner.run_command_and_output(
        `connect`,
        ["sls", options.service, "connect", "--stage", options.stage],
        "."
      );
    }
  )
  .command(
    "docs",
    "Starts the Jekyll documentation site in a docker container, available on http://localhost:4000.",
    {},
    async () => {
      await runner.run_command_and_output(
        `Install Bundler for user`,
        ["gem", "install", "bundler", "--user-install"],
        "docs"
      );
      await runner.run_command_and_output(
        `Configure Bundler to install locally`,
        ["bundle", "config", "set", "--local", "path", ".bundle"],
        "docs"
      );
      await runner.run_command_and_output(
        `Bundle Install`,
        ["bundle", "install"],
        "docs"
      );
      await runner.run_command_and_output(
        `Serve docs on http://localhost:4000`,
        ["bundle", "exec", "jekyll", "serve", "-t"],
        "docs"
      );
    }
  )
  .command(
    ["listRunningStages", "runningEnvs", "listRunningEnvs"],
    "Reports on running environments in your currently connected AWS account.",
    {
      string: { type: "boolean", demandOption: false, default: false },
    },
    async (options) => {
      if (!options.string) {
        console.log("PROJECT:", process.env.PROJECT);
      }
      for (const region of [process.env.REGION_A]) {
        const runningStages = await getAllStagesForRegion(region!);
        if (options.string) {
          console.log(runningStages.join(", "));
        } else {
          console.log("runningStages:", runningStages);
        }
      }
    }
  )
  .strict() // This errors and prints help if you pass an unknown command
  .scriptName("run") // This modifies the displayed help menu to show 'run' isntead of 'dev.js'
  .demandCommand(1, "").argv; // this prints out the help if you don't call a subcommand
