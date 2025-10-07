"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useUserData } from "@/lib/hooks/useUserData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { user: userData } = useUserData();
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) {
    return (
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
            <div className={"flex flex-col sm:flex-row gap-1"}>
              <div className="flex items-center rounded-md px-2">
                <Image
                  src="/icons/xp.png"
                  alt="xp display"
                  width={24}
                  height={24}
                  style={{ imageRendering: "pixelated" }}
                />
                <span className="text-sm font-medium">{userData?.xp || 0}</span>
              </div>
              <div className="flex items-center space-x-1 rounded-md px-2">
                <Image
                  src="/icons/coin.png"
                  alt="coin display"
                  width={24}
                  height={24}
                  style={{ imageRendering: "pixelated" }}
                />
                <span className="text-sm font-medium">
                  {userData?.coins || 0}
                </span>
              </div>
            </div>

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
                        className="absolute top-1 left-1"
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
                  <DropdownMenuItem>Coin Shop</DropdownMenuItem>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
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
    );
  }
}
