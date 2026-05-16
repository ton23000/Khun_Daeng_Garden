// Password validation utility
// Requirements: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("ต้องมีอย่างน้อย 8 ตัวอักษร");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("ต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("ต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("ต้องมีตัวเลขอย่างน้อย 1 ตัว");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function getPasswordStrength(
  password: string,
): "weak" | "medium" | "strong" {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 3) return "weak";
  if (score <= 5) return "strong";
  return "strong";
}
