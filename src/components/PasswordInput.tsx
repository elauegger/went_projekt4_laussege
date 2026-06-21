"use client";

import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function PasswordInput({ className = "", ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        className={`${className} pr-12`}
      />
      <button
        type="button"
        aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
        title={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
        onClick={() => setShowPassword((current) => !current)}
        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#6f6a58] transition hover:bg-[#f3ecd9] hover:text-[#4f503f] focus:outline-none focus:ring-2 focus:ring-[#7b8750]/40"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
