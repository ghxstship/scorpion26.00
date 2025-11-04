"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Trophy, Medal, TrendingUp } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";

export default function MemberLeaderboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== UserRole.MEMBER) {
      router.push("/login");
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  const leaders = [
    { rank: 1, name: "Sarah Johnson", points: 2450, workouts: 48 },
    { rank: 2, name: "Mike Chen", points: 2340, workouts: 45 },
    { rank: 3, name: "Emily Davis", points: 2180, workouts: 42 },
    { rank: 4, name: "You", points: 1950, workouts: 38 },
    { rank: 5, name: "Chris Wilson", points: 1820, workouts: 35 },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-muted-foreground">{rank}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-montserrat font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">See how you rank against others</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={Trophy} size="md" aria-hidden={true} />
            Top Performers This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaders.map((leader) => (
              <div key={leader.rank} className={`flex items-center justify-between p-4 border rounded-lg ${leader.name === "You" ? "bg-primary/5 border-primary" : ""}`}>
                <div className="flex items-center gap-4">
                  <div className="w-8 flex justify-center">{getRankIcon(leader.rank)}</div>
                  <div>
                    <p className="font-semibold">{leader.name}</p>
                    <p className="text-sm text-muted-foreground">{leader.workouts} workouts</p>
                  </div>
                </div>
                <Badge variant="outline">{leader.points} pts</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
