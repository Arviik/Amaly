"use client"

import Link from "next/link";
import React, {useEffect, useState} from "react";
import {Activity, AGs} from "@/api/type";
import {declareAgAttendance, getAGSById} from "@/api/services/ags";
import {useSelector} from "react-redux";
import {selectCurrentMember} from "@/app/store/slices/authSlice";
import {
    declareActivityAttendance,
    getActivityAttendance,
    getActivityById,
    unregisterActivityAttendance
} from "@/api/services/activity";
import {Button} from "@/components/ui/button";

const AGDetails = ({id}: { id: string }) => {
    const [activity, setActivity] = useState<Activity>();
    const [isSignedUp, setIsSignedUp] = useState<boolean>(false)
    const member = useSelector(selectCurrentMember)

    const loadActivity = async () => {
        const response = await getActivityById(Number(id))
        setActivity(response)
        loadSignedUpList(response)
    }

    const signUpToActivity = async (activity: Activity) => {
        if (!member || !activity) return;
        setIsSignedUp(true)
        const response = await declareActivityAttendance(member.organizationId, {activityId: activity.id})
    }

    const unsignUpToActivity = async (activity: Activity) => {
        if (!member || !activity) return;
        setIsSignedUp(false)
        const response = await unregisterActivityAttendance(member.organizationId, {activityId: activity.id})
    }

    const loadSignedUpList = async (loadedActivity = activity) => {
        if (!member || !loadedActivity) return;
        const response = await getActivityAttendance(member.organizationId, {activityId: loadedActivity.id})
        if (response.data) {
            setIsSignedUp(true)
        }
    }

    useEffect(() => {
        loadActivity()
    }, []);

    return (
        <div>
            <Link href={`/ag`}>Back</Link>
            <h1>Activity Details</h1>
            {
                activity &&
                <>
                    <h1>{activity.title}</h1>
                    <h1>{activity.description}</h1>
                    {
                        isSignedUp ?
                            <Button onClick={() => {
                                unsignUpToActivity(activity)
                            }}>Se Désinscrire</Button>
                            :
                            <Button onClick={() => {
                                signUpToActivity(activity)
                            }}>S'inscrire</Button>
                    }
                </>
            }

        </div>
    )
}

export default AGDetails