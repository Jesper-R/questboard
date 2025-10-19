"use client";

import { ShopItem as ShopItemType } from "@/lib/supabase/models";
import Image from "next/image";
import { Button } from "./ui/button";

interface ShopItemProps {
  item: ShopItemType;
  owned: boolean;
  equipped: boolean;
  onPurchase: (item: ShopItemType) => void;
  onEquip: (item: ShopItemType) => void;
}

const rarityColors = {
  common: "text-gray-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-yellow-400",
};

export default function ShopItem({
  item,
  owned,
  equipped,
  onPurchase,
  onEquip,
}: ShopItemProps) {
  return (
    <div className="border rounded-lg p-3 flex flex-col gap-2 transition-colors">
      <div className="aspect-square bg-[#151515] rounded flex items-center justify-center p-2">
        {item.type === "avatar" || item.type === "border" ? (
          <img
            src={item.data}
            alt={item.name}
            className="w-full h-full"
            style={{ imageRendering: "pixelated" }}
          />
        ) : (
          <span className="text-[#E6C100] font-jacquard text-3xl text-center px-2 break-words">
            {item.data}
          </span>
        )}
      </div>
      <div className="min-h-[60px]">
        <h3 className="font-semibold text-white text-sm leading-tight">
          {item.name}
        </h3>
        <p className={`text-xs ${rarityColors[item.rarity]} capitalize mt-0.5`}>
          {item.rarity}
        </p>
        {item.description && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {item.description}
          </p>
        )}
      </div>
      <div className="mt-auto">
        {equipped ? (
          <Button
            variant="outline"
            className="w-full text-green-400 border-green-400!"
            disabled
          >
            Equipped
          </Button>
        ) : owned ? (
          <Button
            variant="outline"
            className="w-full hover:bg-[#E6C100] hover:text-[#E6C100] hover:border-[#E6C100]!"
            onClick={() => onEquip(item)}
          >
            Equip
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full hover:bg-[#E6C100] hover:text-[#E6C100] hover:border-[#E6C100]! flex items-center justify-center gap-1"
            onClick={() => onPurchase(item)}
          >
            <Image
              src="/icons/coin.png"
              alt="coin"
              width={16}
              height={16}
              style={{ imageRendering: "pixelated" }}
            />
            {item.cost}
          </Button>
        )}
      </div>
    </div>
  );
}
