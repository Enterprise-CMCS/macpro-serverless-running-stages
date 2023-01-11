import { it, describe, expect, vi, assert, test, beforeEach } from "vitest";
import { ServerlessRunningStages } from "../index";
import {
  CloudFormationClient,
  paginateDescribeStacks,
  DescribeStacksCommand,
  Stack,
  //   Tag,
} from "@aws-sdk/client-cloudformation";
import { mockClient } from "aws-sdk-client-mock";

const cfnMock = mockClient(CloudFormationClient);

beforeEach(() => {
  cfnMock.reset();
});

describe("test paginate describe stacks command", () => {
  it("describe stacks command returns proper value", async () => {
    cfnMock
      .on(DescribeStacksCommand, {
        // NextToken: undefined,
      })
      .resolves({
        NextToken: "1",
        Stacks: [
          {
            StackName: "Bob",
            CreationTime: new Date(0),
            StackStatus: "Great",
          },
        ],
      })
      .on(DescribeStacksCommand, {
        NextToken: "1",
      })
      .resolves({
        Stacks: [
          {
            StackName: "Fred",
            CreationTime: new Date(0),
            StackStatus: "Good",
          },
        ],
      });

    const client = new CloudFormationClient({});
    // const stacks = await client.send(new DescribeStacksCommand({}));

    const paginator = paginateDescribeStacks({ client }, {});

    const stacks: Stack[] = [];
    for await (const page of paginator) {
      console.log("page:", page);
      stacks.push(...(page.Stacks || []));
    }

    expect(stacks).toHaveLength(2);
    expect(stacks[0]).toEqual({
      StackName: "Bob",
      CreationTime: new Date(0),
      StackStatus: "Great",
    });
    expect(stacks[1]).toEqual({
      StackName: "Fred",
      CreationTime: new Date(0),
      StackStatus: "Good",
    });
  });
});

// ############
// const workflowFunction = vi.fn(
//   () => ServerlessRunningStages.getAllStagesForRegion
// );

// expect(
//   ServerlessRunningStages.getAllStagesForRegion("my-region")
// ).toReturnWith([]);

// const response = await cfnMock.send(new DescribeStacksCommand({}));

// console.log("response:", response);
// expect(response.Stacks).toHaveLength(2);
// expect(response.Stacks?.[0]).toStrictEqual({
//   CreationTime: new Date(),
//   sk: "b",
// });
// ############
