import { it, describe, expect, vi, assert, test } from "vitest";
import { ServerlessRunningStages } from "../index";

import {
  CloudFormationClient,
  paginateDescribeStacks,
  Stack,
  Tag,
} from "@aws-sdk/client-cloudformation";

vi.mock("CloudFormationClient");

// test('mocked axios', async () => {
//   await axios.get('string')

//   expect(axios.get).toHaveBeenCalledWith('string')
//   expect(axios.post).toBeUndefined()
// })

// test('can get actual axios', async () => {
//   const ax = await vi.importActual<typeof axios>('axios')

//   expect(vi.isMockFunction(ax.get)).toBe(false)
// })

describe("index test", () => {
  it("test function returns proper value", () => {
    // const workflowFunction = vi.fn(
    //   () => ServerlessRunningStages.getAllStagesForRegion
    // );

    // console.log(workflowFunction());

    expect(
      ServerlessRunningStages.getAllStagesForRegion("my-region")
    ).toReturnWith([]);
  });
});

test("Math.sqrt()", () => {
  expect(Math.sqrt(4)).toBe(2);
  expect(Math.sqrt(144)).toBe(12);
  expect(Math.sqrt(2)).toBe(Math.SQRT2);
});

test("JSON", () => {
  const input = {
    foo: "hello",
    bar: "world",
  };

  const output = JSON.stringify(input);

  expect(output).eq('{"foo":"hello","bar":"world"}');
  assert.deepEqual(JSON.parse(output), input, "matches original");
});

it("foo", () => {
  assert.equal(Math.sqrt(4), 2);
});
