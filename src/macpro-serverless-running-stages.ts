import * as readlineSync from "readline-sync";

type Tag = {
  Key: string;
  Value: string;
};

export class ServerlessRunningStages {
  private async getAllStacksForRegion(region: string) {
    const client = new CloudFormationClient({ region: region });
    const stacks = [];
    for await (const page of paginateDescribeStacks({ client }, {})) {
      stacks.push(...(page.Stacks || []));
    }
    return stacks;
  }

  private async getAllStacksForStage(
    region: string,
    stage: string,
    addFilters?: Tag[]
  ) {
    let stacks = await this.getAllStacksForRegion(region);
    const matchTags = [
      {
        Key: "STAGE",
        Value: stage,
      },
    ];
    matchTags.push(...(addFilters || []));
    for (let matchTag of matchTags) {
      stacks = stacks.filter((i) =>
        i.Tags?.find((j) => j.Key == matchTag.Key && j.Value == matchTag.Value)
      );
    }
    return stacks;
  }
}
