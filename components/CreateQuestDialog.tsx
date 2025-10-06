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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Quest, QuestInsert } from "@/lib/supabase/models";

interface CreateQuestDialogProps {
  children: ReactNode;
  createQuest: (questData: Omit<QuestInsert, "user_id">) => Promise<Quest>;
}

export default function CreateQuestDialog({
  children,
  createQuest,
}: CreateQuestDialogProps) {
  const [questType, setQuestType] = useState("daily");
  const [difficulty, setDifficulty] = useState<
    "easy" | "medium" | "hard" | "epic"
  >("easy");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      await createQuest({
        title: title.trim(),
        description: description.trim(),
        type: questType as "daily" | "weekly" | "onetime",
        difficulty,
        due_time: questType === "daily" ? time : undefined,
        due_day: questType === "weekly" ? dayOfWeek : undefined,
        due_date:
          questType === "onetime" && date ? (() => {
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            return endOfDay.toISOString();
          })() : undefined,
      });

      setTitle("");
      setDescription("");
      setTime("");
      setDayOfWeek("");
      setDate(undefined);
      setQuestType("daily");
      setDifficulty("easy");
      setOpen(false);
    } catch (error) {
      console.error("Failed to create quest:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-[#1a1a1a] ">
        <DialogHeader>
          <DialogTitle className="text-[#E6C100]">Create New Quest</DialogTitle>
          <DialogDescription className="text-gray-400">
            Plan your next quest to earn valuable xp and coins!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="quest-title" className="text-sm font-medium">
              Quest Title
            </Label>
            <Input
              id="quest-title"
              type="text"
              placeholder="Enter quest title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quest-description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="quest-description"
              className="h-30 max-h-48 resize-y"
              placeholder="Enter quest description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Quest Type</Label>
              <Select value={questType} onValueChange={setQuestType}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="onetime">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Difficulty</Label>
              <Select
                value={difficulty}
                onValueChange={(value) =>
                  setDifficulty(value as "easy" | "medium" | "hard" | "epic")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy (10 XP, 5 coins)</SelectItem>
                  <SelectItem value="medium">
                    Medium (25 XP, 10 coins)
                  </SelectItem>
                  <SelectItem value="hard">Hard (50 XP, 20 coins)</SelectItem>
                  <SelectItem value="epic">Epic (100 XP, 50 coins)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {questType === "daily" && (
            <div className="grid gap-2">
              <Label htmlFor="daily-time" className="text-sm font-medium">
                Daily Time
              </Label>
              <Input
                id="daily-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          )}

          {questType === "weekly" && (
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Day of Week</Label>
              <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
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
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${
                      !date ? "text-muted-foreground" : ""
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0 ">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="flex gap-2 justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#E6C100] text-black hover:bg-[#E6C100]/90"
              disabled={isSubmitting || !title.trim() || !description.trim()}
            >
              {isSubmitting ? "Creating..." : "Create Quest"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
