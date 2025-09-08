import ClerkLandingPageModal from "@/components/ClerkLandingPageModal";
import UnicornLandingBackground from "@/components/UnicornLandingBackground";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <UnicornLandingBackground />

      <Suspense fallback={<div>Loading</div>}>
        <ClerkLandingPageModal />
      </Suspense>
    </div>
  );
}
