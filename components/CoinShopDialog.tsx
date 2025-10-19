"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShopItem as ShopItemType, UserInventory } from "@/lib/supabase/models";
import ShopItem from "./ShopItem";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";
import { useUserData } from "@/lib/contexts/UserContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface CoinShopDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ShopCategory = "title" | "border" | "avatar";

export default function CoinShopDialog({
  open,
  onOpenChange,
}: CoinShopDialogProps) {
  const { supabase } = useSupabase();
  const { user, updateUserData } = useUserData();
  const [selectedCategory, setSelectedCategory] =
    useState<ShopCategory>("title");
  const [shopItems, setShopItems] = useState<ShopItemType[]>([]);
  const [inventory, setInventory] = useState<UserInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  const fetchShopData = async () => {
    if (!supabase || !user) return;

    setLoading(true);

    const { data: items } = await supabase
      .from("shop_items")
      .select("*")
      .order("cost", { ascending: true });

    const rarityOrder: Record<string, number> = {
      common: 0,
      rare: 1,
      epic: 2,
      legendary: 3,
    };
    items?.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);

    const { data: inv } = await supabase
      .from("user_inventory")
      .select("*")
      .eq("user_id", user.id);

    setShopItems(items || []);
    setInventory(inv || []);
    setLoading(false);
  };

  useEffect(() => {
    if (open && !hasFetchedRef.current) {
      fetchShopData();
      hasFetchedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handlePurchase = async (item: ShopItemType) => {
    if (!supabase || !user) return;
    if (user.coins < item.cost) return;

    const { error: inventoryError } = await supabase
      .from("user_inventory")
      .insert({ user_id: user.id, item_id: item.id, is_equipped: false });

    if (inventoryError) throw inventoryError;

    await updateUserData({ coins: user.coins - item.cost });

    fetchShopData();
  };

  const handleEquip = async (item: ShopItemType) => {
    if (!supabase || !user) return;

    const inventoryItem = inventory.find((inv) => inv.item_id === item.id);
    if (!inventoryItem) return;

    const { error } = await supabase
      .from("user_inventory")
      .update({ is_equipped: true })
      .eq("id", inventoryItem.id);

    if (error) throw error;

    const userUpdate: Partial<{
      user_title: string;
      avatar_path: string;
      border_path: string;
    }> = {};
    if (item.type === "title") {
      userUpdate.user_title = item.data;
    } else if (item.type === "avatar") {
      userUpdate.avatar_path = item.data;
    } else if (item.type === "border") {
      userUpdate.border_path = item.data;
    }

    if (Object.keys(userUpdate).length > 0) {
      await updateUserData(userUpdate);
    }

    fetchShopData();
  };

  const filteredItems = shopItems.filter(
    (item) => item.type === selectedCategory
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[1100px] w-[95vw] max-h-[85vh] bg-[#1a1919] p-0 overflow-x-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Coin Shop</DialogTitle>
        </DialogHeader>
        <div className="flex h-[85vh]">
          <div className="w-48 flex flex-col gap-2 border-r p-6">
            <h2 className="text-3xl font-jacquard text-[#E6C100] mb-4 text-center">
              Coin Shop
            </h2>
            <Button
              variant={selectedCategory === "title" ? "secondary" : "ghost"}
              onClick={() => setSelectedCategory("title")}
              className={`justify-start ${
                selectedCategory === "title" ? "text-[#E6C100]" : ""
              }`}
            >
              Titles
            </Button>
            <Button
              variant={selectedCategory === "border" ? "secondary" : "ghost"}
              onClick={() => setSelectedCategory("border")}
              className={`justify-start ${
                selectedCategory === "border" ? "text-[#E6C100]" : ""
              }`}
            >
              Borders
            </Button>
            <Button
              variant={selectedCategory === "avatar" ? "secondary" : "ghost"}
              onClick={() => setSelectedCategory("avatar")}
              className={`justify-start ${
                selectedCategory === "avatar" ? "text-[#E6C100]" : ""
              }`}
            >
              Avatars
            </Button>

            <div className="mt-auto">
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/coin.png"
                  alt="coins"
                  width={24}
                  height={24}
                  style={{ imageRendering: "pixelated" }}
                />
                <span className="text-lg font-semibold ">{user?.coins}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 pr-12">
            {loading ? (
              <p>Loading...</p>
            ) : filteredItems.length === 0 ? (
              <p>No items available</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                {filteredItems.map((item) => {
                  const inventoryItem = inventory.find(
                    (inv) => inv.item_id === item.id
                  );
                  return (
                    <ShopItem
                      key={item.id}
                      item={item}
                      owned={!!inventoryItem}
                      equipped={inventoryItem?.is_equipped || false}
                      onPurchase={handlePurchase}
                      onEquip={handleEquip}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
