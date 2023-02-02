import {
  CloudFormationClient,
  paginateDescribeStacks,
  Stack,
  Tag,
} from "@aws-sdk/client-cloudformation";

function tagsListToTagDict(tagList: Tag[]) {
  const retVal: { [key: string]: string } = {};
  for (const keyValPair of tagList) {
    if (keyValPair.Key && keyValPair.Value) {
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
    const uniqueStages: Set<string> = new Set();
    for await (const page of paginateDescribeStacks({ client }, {})) {
      if (page.Stacks) {
        page.Stacks.forEach((stack: Stack) => {
          const tags = tagsListToTagDict(stack.Tags || []);
          if (
            tags["STAGE"] &&
            tags["PROJECT"] === process.env.PROJECT &&
            !ignoreStages.includes(tags["STAGE"])
          ) {
            uniqueStages.add(tags["STAGE"]);
          }
        });
      }
    }
    return Array.from(uniqueStages);
  }
}
