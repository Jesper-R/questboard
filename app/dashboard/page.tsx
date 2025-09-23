import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#151515] text-white">
      <Navbar />
      <main className="container mx-auto p-4">
        <Button variant="outline" className="text-[#E6C100]">
          <Plus />
          New Quest
        </Button>
      </main>
    </div>
  );
};

export default DashboardPage;
