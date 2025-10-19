"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useUserData } from "@/lib/contexts/UserContext";
import CountUp from "@/components/reactbits/CountUp";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QuestActivityChart from "@/components/QuestActivityChart";
import QuestActivityLog from "@/components/QuestActivityLog";
import BadgeCarousel from "@/components/BadgeCarousel";

export default function ProfilePage() {
  const { user: userData, updateUserData } = useUserData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");

  const currentLevel = userData?.level || 1;
  const currentXP = userData?.xp || 0;
  const xpForCurrentLevel = (currentLevel - 1) * 50;
  const xpProgress = currentXP - xpForCurrentLevel;
  const xpNeeded = 50;
  const progressPercentage = (xpProgress / xpNeeded) * 100;

  const handleSaveUsername = async () => {
    if (!editedUsername.trim()) return;

    try {
      await updateUserData({ username: editedUsername.trim() });
      setIsDialogOpen(false);
      setEditedUsername("");
    } catch (error) {
      console.error("Failed to update username:", error);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#151515]">
        <Navbar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151515]">
      <Navbar />

      <main className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          <div className="flex items-start gap-3 sm:gap-6">
            <div className="relative w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] flex-shrink-0">
              <Image
                src={userData?.avatar_path || "/avatars/default.png"}
                alt="User Avatar"
                width={128}
                height={128}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%]"
                style={{ imageRendering: "pixelated" }}
              />
              <Image
                src={userData?.border_path || "/borders/wood.png"}
                alt="Avatar Border"
                width={140}
                height={140}
                className="absolute inset-0 pointer-events-none w-full h-full"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            <div className="flex min-h-[100px] sm:h-[140px] py-1 flex-col justify-between flex-1">
              <div className="space-y-2">
                <div className="flex justify-start items-baseline gap-3">
                  <div className="flex items-center gap-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <button
                          onClick={() =>
                            setEditedUsername(userData?.username || "")
                          }
                          className="text-gray-400 hover:text-[#E6C100] transition-colors"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Username</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-5 ">
                          <Input
                            value={editedUsername}
                            onChange={(e) => setEditedUsername(e.target.value)}
                            placeholder="Enter new username"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveUsername();
                            }}
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              onClick={() => {
                                setIsDialogOpen(false);
                                setEditedUsername("");
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant={"outline"}
                              onClick={handleSaveUsername}
                              className="bg-[#E6C100]! text-black!"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <h1 className="text-4xl font-bold font-jacquard">
                      {userData?.username || "User"}
                    </h1>
                  </div>
                  <span className="text-gray-400"> - </span>
                  <p className="text-[#E6C100] text-2xl font-jacquard">
                    {userData?.user_title}
                  </p>
                </div>
                <div className="flex items-center gap-2 max-w-md">
                  <span className="text-sm text-gray-400">{currentLevel}</span>
                  <Progress value={progressPercentage} className="w-full" />
                  <span className="text-sm text-gray-400">
                    {currentLevel + 1}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/icons/coin.png"
                    alt="coin display"
                    width={30}
                    height={30}
                    style={{ imageRendering: "pixelated" }}
                  />
                  <CountUp
                    to={userData?.coins}
                    duration={1}
                    className="text-lg font-medium tabular-nums"
                  />
                </div>
                <div className="flex items-center">
                  <Image
                    src="/icons/xp.png"
                    alt="xp display"
                    width={30}
                    height={30}
                    style={{ imageRendering: "pixelated" }}
                  />
                  <CountUp
                    to={userData?.xp}
                    duration={1}
                    className="text-lg tabular-nums"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="my-8">
            <h2 className="text-3xl font-jacquard text-[#E6C100] mb-4">
              Quest Activity (Last 7 Days)
            </h2>
            <QuestActivityChart />
          </div>

          <div className="my-8">
            <h2 className="text-3xl text-[#E6C100] mb-4 font-jacquard">
              Badges
            </h2>
            <BadgeCarousel />
          </div>

          <div className="mt-8">
            <QuestActivityLog limit={0} />
          </div>
        </div>
      </main>
    </div>
  );
}
