import ClerkAuthForm from "@/components/ClerkAuthForm";
import UnicornBackground from "@/components/UnicornStudioBackground";
import { SignIn, SignUp } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <UnicornBackground />
      <ClerkAuthForm />
    </div>
  );
};

export default page;
