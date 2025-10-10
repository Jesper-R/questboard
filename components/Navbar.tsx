"use client";

import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useUserData } from "@/lib/contexts/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import CountUp from "@/components/reactbits/CountUp";
import CoinShopDialog from "@/components/CoinShopDialog";
import { Button } from "./ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { user: userData } = useUserData();
  const [shopOpen, setShopOpen] = useState(false);
  const isDashboard = pathname.startsWith("/dashboard");
  const isProfile = pathname.startsWith("/profile");

  if (isDashboard || isProfile) {
    return (
      <>
        <nav className="sticky top-0 bg-[#151515] z-50">
          <div className="container mx-auto py-3 px-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-4xl font-jacquard text-[#E6C100]">
                <span className="sm:hidden">Q</span>
                <span className="hidden sm:inline">QuestBoard</span>
              </span>
            </div>

            <div
              className={`flex items-center space-x-4 ${
                user ? "opacity-100" : "opacity-0"
              }`}
            >
              {isDashboard ? (
                <div className={"flex flex-col sm:flex-row gap-1"}>
                  <div className="flex items-center px-2">
                    <Image
                      src="/icons/xp.png"
                      alt="xp display"
                      width={28}
                      height={28}
                      style={{ imageRendering: "pixelated" }}
                    />
                    <CountUp
                      to={userData?.xp || 0}
                      duration={1}
                      className="text-sm font-medium tabular-nums"
                    />
                  </div>
                  <div className="flex items-center space-x-1 px-2">
                    <Image
                      src="/icons/coin.png"
                      alt="coin display"
                      width={24}
                      height={24}
                      style={{ imageRendering: "pixelated" }}
                    />
                    <CountUp
                      to={userData?.coins || 0}
                      duration={1}
                      className="text-sm font-medium tabular-nums"
                    />
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  className="hover:text-[#E6C100]"
                >
                  Dashboard
                </Button>
              )}

              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div
                      className={`flex items-center space-x-3 rounded-md p-3 border-none cursor-pointer hover:bg-[#222]
                    }`}
                    >
                      <div className="relative w-10 h-10">
                        <Image
                          src={userData?.avatar_path || "/avatars/default.png"}
                          alt="User Avatar"
                          width={32}
                          height={32}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                          style={{ imageRendering: "pixelated" }}
                        />
                        <Image
                          src="/borders/wood.png"
                          alt="Avatar Border"
                          width={40}
                          height={40}
                          className="absolute inset-0 pointer-events-none"
                          style={{ imageRendering: "pixelated" }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-medium text-sm">
                          {userData?.username || user?.firstName || "User"}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-400 text-xs">
                            Level {userData?.level || 1}
                          </span>
                          <span className="text-[#E6C100] text-xs">
                            {userData?.user_title || "Adventurer"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-50" align="end">
                    <DropdownMenuItem onClick={() => setShopOpen(true)}>
                      Coin Shop
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </nav>

        <CoinShopDialog open={shopOpen} onOpenChange={setShopOpen} />
      </>
    );
  }
}
