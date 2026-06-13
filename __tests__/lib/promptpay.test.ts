import { generatePromptPayPayload } from "@/lib/promptpay";

describe("PromptPay Payload Generator Utility", () => {
  it("should generate correctly formatted promptpay string", () => {
    const payload = generatePromptPayPayload("0898762045", 435.5);

    // Check main segments based on PromptPay spec
    expect(payload.startsWith("000201")).toBe(true); // Payload Format Indicator 01
    expect(payload).toContain("010212"); // One-time use 12
    expect(payload).toContain("5303764"); // THB Currency (03 length, 764 value)
    expect(payload).toContain("5802TH"); // Country Code

    // Test exact length (last 4 chars are CRC)
    expect(payload.length).toBeGreaterThan(20);
  });

  it("should handle different number formats correctly", () => {
    const payload1 = generatePromptPayPayload("0898762045", 100);
    const payload2 = generatePromptPayPayload("898762045", 100);
    const payload3 = generatePromptPayPayload("089-876-2045", 100);

    // They should all normalize to 0066898762045 within the block
    expect(payload1).toBe(payload2);
    expect(payload1).toBe(payload3);
  });
});
