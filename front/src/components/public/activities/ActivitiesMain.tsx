"use client"

import React, {FormEvent, useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {selectCurrentMember} from "@/app/store/slices/authSlice";
import {
    createActivity,
    declareActivityAttendance, getActivityAttendance,
    getActivityById,
    getActivityByOrganizationId, unregisterActivityAttendance
} from "@/api/services/activity";
import {Activity, AGs} from "@/api/type";
import Link from "next/link";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

const ActivityCreation = () => {
    const titleRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const member = useSelector(selectCurrentMember);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!member) return;
        if (titleRef.current?.value === "" || descriptionRef.current?.value === "" || !dateRef.current?.valueAsDate) return;
        if (!titleRef.current?.value || !descriptionRef.current?.value || !dateRef.current?.value) return;
        await createActivity({
            title: titleRef.current?.value,
            description: descriptionRef.current?.value,
            date: dateRef.current?.value,
            organizationId: member.organizationId,
        })
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Input ref={titleRef} type="text" placeholder="Title"/>
                <Input ref={descriptionRef} placeholder="Description"/>
                <Input ref={dateRef} type="datetime-local"/>
                <Button type="submit">CREATE ACTIVITY</Button>
            </form>
        </div>
    )
}


const ActivitiesMain = () => {
    const member = useSelector(selectCurrentMember);
    const [ActivityList, setActivityList] = useState<Activity[]>([])
    const [signedUpList, setSignedUpList] = useState<Map<number, boolean>>(new Map())

    const loadActivity = async () => {
        if (!member) return;
        const response = await getActivityByOrganizationId(member.organizationId)
        setActivityList(response)
        loadSignedUpList(response)
    }

    const loadSignedUpList = async (activities: Activity[] = ActivityList) => {
        if (!member) return;
        const mapToSetup = new Map<number, boolean>()
        for (const activity of activities) {
            const response = await getActivityAttendance(member.organizationId, {activityId: activity.id})
            if (response.data) {
                mapToSetup.set(activity.id, true)
            }
        }
        setSignedUpList(mapToSetup)
    }

    const signUpToActivity = async (activity: Activity) => {
        if (!member || !activity) return;
        const newMap = new Map(signedUpList)
        newMap.set(activity.id, true)
        setSignedUpList(newMap)
        const response = await declareActivityAttendance(member.organizationId, {activityId: activity.id})
    }

    const unsignUpToActivity = async (activity: Activity) => {
        if (!member || !activity) return;
        const newMap = new Map(signedUpList)
        newMap.delete(activity.id)
        setSignedUpList(newMap)
        const response = await unregisterActivityAttendance(member.organizationId, {activityId: activity.id})
    }

    useEffect(() => {
        loadActivity()
    }, []);

    return (
        <div>
            <h1>Activities Working ! </h1>
            {member?.isAdmin && <ActivityCreation></ActivityCreation>}
            {ActivityList.map((activity: Activity) => (
                <div key={activity.id} style={{border: "1px solid black"}}>
                    <Link href={`activities/${activity.id}`}>{activity.title}</Link>
                    {
                        signedUpList && signedUpList.has(activity.id) ?
                            <button onClick={() => {
                                unsignUpToActivity(activity)
                            }}>Se Désinscrire</button>
                            :
                            <button onClick={() => {
                                signUpToActivity(activity)
                            }}>S'inscrire</button>
                    }
                </div>
            ))}
        </div>
    )
}

export default ActivitiesMain