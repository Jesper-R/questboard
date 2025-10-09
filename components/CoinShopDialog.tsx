"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CoinShopDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CoinShopDialog({
  open,
  onOpenChange,
}: CoinShopDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-jacquard text-[#E6C100]">
            Coin Shop
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>under construction :)</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
