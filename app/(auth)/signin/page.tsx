import { SignInForm } from "@/components/Auth/SignInForm";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
