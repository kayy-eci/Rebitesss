import type { ReactNode } from "react";
import AuthShell from "./auth-shell";
import AuthForm from "./auth-form";

interface AuthSplitProps {
  mode: "signin" | "signup";
  title: ReactNode;
  subtitle: string;
  submitLabel: string;
  redirectTo: string;
  bottomHint: {
    text: string;
    linkText: string;
    href: string;
  };
  brand: {
    title: ReactNode;
    description: string;
  };
}

export default function AuthSplit({
  mode,
  title,
  subtitle,
  submitLabel,
  redirectTo,
  bottomHint,
  brand,
}: AuthSplitProps) {
  return (
    <AuthShell brand={brand}>
      <AuthForm
        mode={mode}
        title={title}
        subtitle={subtitle}
        submitLabel={submitLabel}
        redirectTo={redirectTo}
        bottomHint={bottomHint}
      />
    </AuthShell>
  );
}
