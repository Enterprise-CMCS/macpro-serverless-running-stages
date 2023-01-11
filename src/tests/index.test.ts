import { it, describe, expect, vi } from "vitest";
import { ServerlessRunningStages } from "../index";

describe("index test", () => {
  it("test function returns proper value", () => {
    const workflowFunction = vi.fn(() => ServerlessRunningStages.test);

    workflowFunction();

    expect(workflowFunction).toReturnWith(1);
  });
});
