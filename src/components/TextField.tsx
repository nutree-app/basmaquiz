import { InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string | null;
  unit?: string;
};

export function TextField({ error, unit, className = "", ...props }: TextFieldProps) {
  return (
    <div className="w-full">
      <div className="relative">
        <input
          className={`w-full rounded-2xl border bg-card px-5 py-4 text-lg text-foreground placeholder:text-muted/70 outline-none transition-colors focus:border-pink ${
            error ? "border-pink-strong" : "border-border"
          } ${unit ? "pl-16" : ""} ${className}`}
          dir={props.type === "email" || props.type === "tel" ? "ltr" : "rtl"}
          style={props.type === "email" || props.type === "tel" ? { textAlign: "right" } : undefined}
          {...props}
        />
        {unit && (
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-muted">
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm font-medium text-pink-strong animate-fade-in">{error}</p>
      )}
    </div>
  );
}
