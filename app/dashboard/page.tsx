import Navbar from "@/components/Navbar";
import CreateQuestDialog from "@/components/CreateQuestDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#151515]">
      <Navbar />
      <main className="container mx-auto p-4">
        <CreateQuestDialog>
          <Button variant="outline" className="text-[#E6C100]">
            <Plus />
            New Quest
          </Button>
        </CreateQuestDialog>
      </main>
    </div>
  );
};

export default DashboardPage;