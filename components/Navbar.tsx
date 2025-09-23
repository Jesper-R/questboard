"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
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
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) {
    return (
      <nav className="sticky top-0 bg-[#151515]">
        <div className="container mx-auto py-3 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-4xl font-jacquard text-[#E6C100]">
              <span className="sm:hidden">Q</span>
              <span className="hidden sm:inline">QuestBoard</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className={user ? "opacity-100" : "opacity-0"}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className={`flex items-center space-x-3 rounded-md p-3 border-none cursor-pointer hover:bg-[#222]
                    }`}
                  >
                    <Image
                      src={user?.imageUrl || "/icons/loading.png"}
                      alt="User Avatar"
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="text-white font-medium text-sm">
                        {user?.firstName || "User"}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-400 text-xs">Level XX</span>
                        <span className="text-[#E6C100] text-xs">
                          Java Enjoyer
                        </span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-50" align="end">
                  <DropdownMenuItem>X</DropdownMenuItem>
                  <DropdownMenuItem>X</DropdownMenuItem>
                  <DropdownMenuItem>X</DropdownMenuItem>
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
