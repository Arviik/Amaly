"use client"

import Link from "next/link";
import React, {useCallback, useEffect, useState} from "react";
import {Activity, AGs, Member, User} from "@/api/type";
import {declareAgAttendance, getAGSById} from "@/api/services/ags";
import {useSelector} from "react-redux";
import {selectCurrentMember} from "@/app/store/slices/authSlice";
import {
    declareActivityAttendance, deleteMemberFromActivity,
    getActivityAttendance,
    getActivityById, getMemberFromActivity,
    unregisterActivityAttendance
} from "@/api/services/activity";
import {Button} from "@/components/ui/button";
import {redirect, usePathname, useRouter} from "next/navigation";
import {DataTable} from "@/components/common/DataTable";
import {deleteMember, getMembersByOrganizationId} from "@/api/services/member";
import {toast} from "@/components/ui/use-toast";
import {Field} from "@/components/common/CrudModals";
import {getUserName} from "@/api/services/user";

const columns: { key: keyof (Member & Pick<User, "firstName" | "lastName">); header: string }[] = [
    {key: "firstName", header: "First Name" },
    {key: "lastName", header: "Last Name" },
];

const fields: Field[] = [
];

const AGDetails = ({id}: { id: string }) => {
    const [activity, setActivity] = useState<Activity>();
    const [isSignedUp, setIsSignedUp] = useState<boolean>(false)
    const [members, setMembers] = useState<(Member & Pick<User, "firstName" | "lastName">)[]>([]);
    const member = useSelector(selectCurrentMember)
    const pathname = usePathname()
    const router = useRouter()

    const handleDelete = async (id: number) => {
        try {
            if (!activity) return;
            await deleteMemberFromActivity(activity?.id, id);
            toast({
                title: "Success",
                description: "Member deleted successfully",
            });
            fetchMembers();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete member",
                variant: "destructive",
            });
        }
    };

    const fetchMembers = useCallback(async () => {
        console.log("ok")
        if (!activity?.organizationId) {
            toast({
                title: "Error",
                description: "No organization selected",
                variant: "destructive",
            });
            console.log("return")
            return;
        }
        try {
            console.log("id")
            const data = await getMemberFromActivity(activity.id);
            console.log(data)
            const membersFromActivity = data.map((object) => object.members)
            const membersList: (Member & Pick<User, "firstName" | "lastName">)[] = []
            for (const member of membersFromActivity) {
                console.log(member.id)
                const response = await getUserName(member.id)
                console.log(response)
                membersList.push({...member, firstName:  response.user.firstName, lastName: response.user.lastName})
            }
            console.log(membersList)
            setMembers(membersList);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch members",
                variant: "destructive",
            });
        }
    }, [activity, toast]);

    useEffect(() => {
        fetchMembers()
    }, [activity]);

    const loadActivity = async () => {
        const response = await getActivityById(Number(id))
        if (response.organizationId !== member?.organizationId) {
            redirect("activities")
        }
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
            <Button onClick={() => {router.push(pathname.split('/').slice(0, pathname.split('/').length - 1).join('/'))}}>Back</Button>
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
                    <hr/>
                    {
                        member?.isAdmin &&
                        <div className="p-4 space-y-4">
                            <DataTable<(Member & Pick<User, "firstName" | "lastName">)>
                                data={members}
                                columns={columns}
                                onDelete={handleDelete}
                                fields={fields}
                                onCreate={() => {}}
                                onUpdate={() => {}}/>
                        </div>

                    }
                </>
            }

        </div>
    )
}

export default AGDetails