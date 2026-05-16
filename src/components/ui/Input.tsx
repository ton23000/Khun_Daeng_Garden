import React, { useState } from "react";
import styles from "./Input.module.css";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={isPassword ? styles.passwordWrapper : ""}>
          <input
            ref={ref}
            type={inputType}
            className={`${styles.input} ${isPassword ? styles.inputPassword : ""}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className={styles.toggleButton}
              onClick={togglePasswordVisibility}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
