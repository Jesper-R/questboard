"use client";

import { SignUp, SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function ClerkLandingPageModal() {
  const searchParams = useSearchParams();
  const clerkAction = searchParams.get("action") || "sign-up";

  return (
    <>
      {clerkAction === "sign-up" ? (
        <SignUp routing="virtual" signInUrl="/?action=sign-in" />
      ) : (
        <SignIn routing="virtual" signUpUrl="/" />
      )}
    </>
  );
}
