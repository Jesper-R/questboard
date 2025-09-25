"use client";

import { useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface CreateQuestDialogProps {
  children: ReactNode;
}

export default function CreateQuestDialog({
  children,
}: CreateQuestDialogProps) {
  const [questType, setQuestType] = useState("daily");

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-[#1a1a1a] border-[#333]">
        <DialogHeader>
          <DialogTitle className="text-[#E6C100]">Create New Quest</DialogTitle>
          <DialogDescription className="text-gray-400">
            Plan your next quest to earn valuable xp and coins!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Quest Title</label>
            <input
              type="text"
              className="w-full mt-1 h-10 px-3 py-2 bg-[#151515] border border-[#333] rounded"
              placeholder="Enter quest title"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full mt-1 p-2 bg-[#151515] border border-[#333] rounded h-20 max-h-48 resize-y overflow-y-auto"
              placeholder="Enter quest description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Quest Type</label>
              <Select value={questType} onValueChange={setQuestType}>
                <SelectTrigger className="w-full mt-1 bg-[#151515] border-[#333]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#151515] border-[#333]">
                  <SelectItem value="daily">Daily Quest</SelectItem>
                  <SelectItem value="weekly">Weekly Quest</SelectItem>
                  <SelectItem value="onetime">One-time Quest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Difficulty</label>
              <Select>
                <SelectTrigger className="w-full mt-1 bg-[#151515] border-[#333]">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-[#151515] border-[#333]">
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {questType === "daily" && (
            <div>
              <label className="text-sm font-medium">Daily Time</label>
              <input
                type="time"
                className="w-full mt-1 h-10 px-3 py-2 bg-[#151515] border border-[#333] rounded"
              />
            </div>
          )}

          {questType === "weekly" && (
            <div>
              <label className="text-sm font-medium">Day of Week</label>
              <Select>
                <SelectTrigger className="w-full mt-1 bg-[#151515] border-[#333]">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent className="bg-[#151515] border-[#333]">
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {questType === "onetime" && (
            <div>
              <label className="text-sm font-medium">Due Date & Time</label>
              <input
                type="datetime-local"
                className="w-full mt-1 h-10 px-3 py-2 bg-[#151515] border border-[#333] rounded"
              />
            </div>
          )}

          <div className="flex gap-2 justify-end mt-6">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-[#E6C100] text-black hover:bg-[#E6C100]/90">
              Create Quest
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
