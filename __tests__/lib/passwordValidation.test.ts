import {
  validatePassword,
  getPasswordStrength,
} from "@/lib/passwordValidation";

describe("Password Validation Utility", () => {
  describe("validatePassword", () => {
    it("should show error for password less than 8 characters", () => {
      const result = validatePassword("Pass123");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("ต้องมีอย่างน้อย 8 ตัวอักษร");
    });

    it("should show error for password without lowercase letters", () => {
      const result = validatePassword("PASSWORD123");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("ต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว");
    });

    it("should show error for password without uppercase letters", () => {
      const result = validatePassword("password123");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("ต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว");
    });

    it("should show error for password without numbers", () => {
      const result = validatePassword("Password");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("ต้องมีตัวเลขอย่างน้อย 1 ตัว");
    });

    it("should validate correct passwords successfully", () => {
      const result = validatePassword("Password123");
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("getPasswordStrength", () => {
    it("should return weak for simple passwords", () => {
      expect(getPasswordStrength("pass")).toBe("weak");
      expect(getPasswordStrength("password")).toBe("weak");
    });

    it("should return strong for complex passwords", () => {
      expect(getPasswordStrength("Password123!")).toBe("strong");
      expect(getPasswordStrength("SuperSecretPassword123!!")).toBe("strong");
    });
  });
});
