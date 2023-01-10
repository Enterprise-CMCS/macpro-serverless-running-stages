import * as readlineSync from "readline-sync";

type Tag = {
  Key: string;
  Value: string;
};

export class ServerlessRunningStages {
  private async getAllStacksForRegion(region: string) {
    return [];
  }

  static get test() {
    console.log("a1");
    return 1;
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
    return stacks;
  }
}
