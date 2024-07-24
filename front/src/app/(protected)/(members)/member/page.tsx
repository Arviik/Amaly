import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ActivityIcon, CalendarIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const MemberDashboard: React.FC = () => {
  // Mock data
  const memberName = "John Doe";
  const memberRole = "Active Member";
  const lastLogin = "2 days ago";
  const upcomingActivities = [
    { id: 1, name: "Monthly Meeting", date: "May 15, 2023" },
    { id: 2, name: "Training Workshop", date: "May 22, 2023" },
  ];
  const recentEvents = [
    { id: 1, name: "Open House Day", date: "May 5, 2023" },
    { id: 2, name: "Fundraising Event", date: "April 30, 2023" },
  ];

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card className="border-t-4 border-primary">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Member Dashboard</CardTitle>
                  <CardDescription className="mt-1">
                    Welcome to your Amaly member space, {memberName}.
                  </CardDescription>
                </div>
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/avatar.png" alt={memberName} />
                  <AvatarFallback>
                    {memberName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      My Profile
                    </CardTitle>
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{memberRole}</div>
                    <p className="text-xs text-muted-foreground">
                      Last login: {lastLogin}
                    </p>
                    <Button asChild className="mt-4 w-full">
                      <Link href="/member/settings">View my profile</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      My Activities
                    </CardTitle>
                    <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {upcomingActivities.length} upcoming
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Planned activities
                    </p>
                    <ul className="mt-4 space-y-2">
                      {upcomingActivities.map((activity) => (
                        <li key={activity.id} className="text-sm">
                          <span className="font-medium">{activity.name}</span> -{" "}
                          {activity.date}
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant="outline" className="mt-4 w-full">
                      <Link href="/member/activities">View all activities</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Events
                    </CardTitle>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {recentEvents.length} recent
                    </div>
                    <p className="text-xs text-muted-foreground">Past events</p>
                    <ul className="mt-4 space-y-2">
                      {recentEvents.map((event) => (
                        <li key={event.id} className="text-sm">
                          <span className="font-medium">{event.name}</span> -{" "}
                          {event.date}
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant="outline" className="mt-4 w-full">
                      <Link href="/member/events">View all events</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Activity Participation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gray-100">
                    Activity Participation Graph Placeholder
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default MemberDashboard;
