"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentMember } from "@/app/store/slices/authSlice";
import {
  createActivity,
  declareActivityAttendance,
  getActivityAttendance,
  getActivityByOrganizationId,
  unregisterActivityAttendance,
} from "@/api/services/activity";
import { Activity } from "@/api/type";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, PlusCircleIcon, MinusCircleIcon } from "lucide-react";
import {useRouter} from "next/navigation";

const ActivityCreation = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const member = useSelector(selectCurrentMember);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!member || !title || !description || !date) return;
    await createActivity({
      title,
      description,
      date,
      organizationId: member.organizationId,
    });
    // Reset form fields after submission
    setTitle("");
    setDescription("");
    setDate("");
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Create a new activity</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Title"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <Input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="datetime-local"
          />
          <Button type="submit" className="w-full">
            Create Activity
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const ActivitiesMain = () => {
    const member = useSelector(selectCurrentMember);
    const [activityList, setActivityList] = useState<Activity[]>([])
    const [signedUpList, setSignedUpList] = useState<Map<number, boolean>>(new Map())
    const router = useRouter()

  const loadActivity = async () => {
    if (!member) return;
    const response = await getActivityByOrganizationId(member.organizationId);
    setActivityList(response);
    loadSignedUpList(response);
  };

  const loadSignedUpList = async (activities: Activity[] = activityList) => {
    if (!member) return;
    const mapToSetup = new Map<number, boolean>();
    for (const activity of activities) {
      const response = await getActivityAttendance(member.organizationId, {
        activityId: activity.id,
      });
      if (response.data) {
        mapToSetup.set(activity.id, true);
      }
    }
    setSignedUpList(mapToSetup);
  };

  const signUpToActivity = async (activity: Activity) => {
    if (!member || !activity) return;
    const newMap = new Map(signedUpList);
    newMap.set(activity.id, true);
    setSignedUpList(newMap);
    await declareActivityAttendance(member.organizationId, {
      activityId: activity.id,
    });
  };

  const unsignUpToActivity = async (activity: Activity) => {
    if (!member || !activity) return;
    const newMap = new Map(signedUpList);
    newMap.delete(activity.id);
    setSignedUpList(newMap);
    await unregisterActivityAttendance(member.organizationId, {
      activityId: activity.id,
    });
  };

  useEffect(() => {
    loadActivity();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Activités</h1>
      {member?.isAdmin && <ActivityCreation />}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activityList.map((activity: Activity) => (
          <Card key={activity.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">
                <Link
                  href={`activities/${activity.id}`}
                  className="hover:underline"
                >
                  {activity.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-600 mb-4">{activity.description}</p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {new Date(activity.date).toLocaleString()}
              </div>
              <Separator className="my-4" />
              {signedUpList && signedUpList.has(activity.id) ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => unsignUpToActivity(activity)}
                >
                  <MinusCircleIcon className="mr-2 h-4 w-4" />
                  unsubscribes
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => signUpToActivity(activity)}
                >
                  <PlusCircleIcon className="mr-2 h-4 w-4" />
                  subscribes
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesMain;
