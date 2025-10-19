"use client";

import { Badge, UserBadge } from "@/lib/supabase/models";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useUserData } from "@/lib/contexts/UserContext";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";
import { badgeService } from "@/lib/services";
import { useEffect, useState } from "react";

const rarityColors = {
  common: "bg-gray-500/10 text-gray-500",
  rare: "bg-blue-500/10 text-blue-500",
  epic: "bg-purple-500/10 text-purple-500",
  legendary: "bg-yellow-500/10 text-yellow-500",
};

export default function BadgeCarousel() {
  const { user } = useUserData();
  const { supabase } = useSupabase();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);

  useEffect(() => {
    async function fetchBadges() {
      if (!supabase || !user) return;

      try {
        const [allBadges, earnedBadges] = await Promise.all([
          badgeService.getAllBadges(supabase),
          badgeService.getUserBadges(supabase, user.id),
        ]);

        setBadges(allBadges);
        setUserBadges(earnedBadges);
      } catch (error) {
        console.error("Error fetching badges:", error);
      }
    }

    fetchBadges();

    window.addEventListener("badgesUpdated", fetchBadges);

    return () => {
      window.removeEventListener("badgesUpdated", fetchBadges);
    };
  }, [supabase, user?.id]);

  const getUserProgress = (badge: Badge): number => {
    const userValue = user?.[badge.requirement_type] || 0;
    return Math.min(100, (userValue / badge.requirement_value) * 100);
  };

  const isBadgeEarned = (badge: Badge): boolean => {
    return userBadges.some((ub) => ub.badge_id === badge.id);
  };

  const getBadgeEarnedDate = (badgeId: string) => {
    return userBadges.find((ub) => ub.badge_id === badgeId)?.earned_at || null;
  };

  if (!user || badges.length === 0) return null;

  return (
    <div className="w-full px-12 py-4">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {badges.map((badge) => {
            const earned = isBadgeEarned(badge);
            const progress = getUserProgress(badge);
            const earnedDate = getBadgeEarnedDate(badge.id);

            return (
              <CarouselItem
                key={badge.id}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <div className="relative rounded-lg bg-[#1a1919]/80 p-4 h-full flex flex-col select-none">
                  <div className="flex items-center justify-center mb-3">
                    <Image
                      src={badge.icon_path}
                      alt={badge.name}
                      width={80}
                      height={80}
                      className={earned ? "" : "opacity-40 grayscale"}
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>

                  <div className="absolute top-2 right-2">
                    <span
                      className={`text-xs capitalize px-2 py-0.5 rounded-2xl font-semibold ${
                        rarityColors[badge.rarity]
                      }`}
                    >
                      {badge.rarity}
                    </span>
                  </div>

                  <div className="text-center mb-3">
                    <h3 className="font-semibold text-sm mb-1">{badge.name}</h3>
                    <p className="text-xs text-gray-400 italic">
                      {badge.requirement}
                    </p>
                  </div>

                  <div className="mt-auto">
                    {earned ? (
                      <div className="text-center h-5 flex items-center justify-center">
                        <p className="text-xs text-green-500 font-semibold">
                          {earnedDate
                            ? `Earned ${new Date(
                                earnedDate
                              ).toLocaleDateString()}`
                            : "Earned!"}
                        </p>
                      </div>
                    ) : (
                      <div className="w-full bg-gray-600/50 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-[#E6C100] transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="bg-[#E6C100]/20 border-[#E6C100] text-[#E6C100] hover:bg-[#E6C100]/30 hover:text-[#E6C100]" />
        <CarouselNext className="bg-[#E6C100]/20 border-[#E6C100] text-[#E6C100] hover:bg-[#E6C100]/30 hover:text-[#E6C100]" />
      </Carousel>
    </div>
  );
}
