"use client";

import { SignUp, SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import UnicornScene from "unicornstudio-react";

export default function Home() {
  const searchParams = useSearchParams();
  const clerkAction = searchParams.get("action") || "sign-up";
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="fixed inset-0 -z-50">
        <UnicornScene
          projectId="VWxwwHafUsxj1d9x7I0P"
          width={dimensions.width}
          height={dimensions.height}
        />
      </div>

      {clerkAction === "sign-up" ? (
        <SignUp routing="virtual" signInUrl="/?action=sign-in" />
      ) : (
        <SignIn routing="virtual" signUpUrl="/" />
      )}
    </div>
  );
}
