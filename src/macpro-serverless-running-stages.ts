import {
  CloudFormationClient,
  paginateDescribeStacks,
  Stack,
  Tag,
} from "@aws-sdk/client-cloudformation";
import * as readlineSync from "readline-sync";

function tagsListToTagDict(tagList: Tag[]) {
  const retVal: any = {}; // TODO: remove any
  for (const keyValPair of tagList) {
    if (keyValPair.Key) {
      retVal[keyValPair.Key] = keyValPair.Value;
    }
  }
  return retVal;
}

export class ServerlessRunningStages {
  static async getAllStagesForRegion(
    region: string,
    ignoreStages = ["master"]
  ) {
    const client = new CloudFormationClient({ region });
    const stages: string[] = [];

    for await (const page of paginateDescribeStacks({ client }, {})) {
      if (page.Stacks) {
        stages.push(
          ...new Set(
            page.Stacks.reduce((acc: string[], stack: Stack) => {
              const tags = tagsListToTagDict(stack.Tags || []);
              if (
                tags["STAGE"] &&
                tags["PROJECT"] === process.env.PROJECT &&
                !ignoreStages.includes(tags["STAGE"])
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
}
