import ClerkAuthForm from "@/components/ClerkAuthForm";
import UnicornBackground from "@/components/UnicornStudioBackground";

const page = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <UnicornBackground />
      <ClerkAuthForm />
    </div>
  );
};

export default page;
