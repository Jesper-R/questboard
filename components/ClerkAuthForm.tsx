"use client";

import { SignUp, SignIn } from "@clerk/nextjs";
import { useSearchParams, usePathname } from "next/navigation";
import { Suspense } from "react";

function ClerkAuthFormContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const clerkAction = searchParams.get("action") || "sign-up";

  return (
    <>
      {clerkAction === "sign-up" ? (
        <SignUp
          routing="virtual"
          signInUrl={`${pathname}?action=sign-in`}
          forceRedirectUrl={"/dashboard"}
        />
      ) : (
        <SignIn
          routing="virtual"
          signUpUrl={`${pathname}?action=sign-up`}
          forceRedirectUrl={"/dashboard"}
        />
      )}
    </>
  );
}

export default function ClerkAuthForm() {
  return (
    <Suspense fallback={<div></div>}>
      <ClerkAuthFormContent />
    </Suspense>
  );
}
