import {useEffect, useState} from "react";
import {AGs, Organization} from "@/api/type";
import {useDispatch, useSelector} from "react-redux";
import {
    selectCurrentMember,
    selectCurrentUser, selectMemberships,
    setMemberships,
    setSelectedOrganization
} from "@/app/store/slices/authSlice";
import {useSearchParams} from "next/navigation";
import {declareAgAttendance} from "@/api/services/ags";
import {getOrganizationInviteWithUuid} from "@/api/services/organization";
import {createMember} from "@/api/services/member";
import {Button} from "@/components/ui/button";
import {router} from "next/client";

const JoinOrganization = () => {
    const [organization, setOrganization] = useState<Organization>();
    const member = useSelector(selectCurrentMember)
    const user = useSelector(selectCurrentUser)
    const searchParams = useSearchParams()
    const actualMemberships = useSelector(selectMemberships)
    const dispatch = useDispatch()

    const loadInvite = async () => {
        if (!searchParams.has("orgId")) return;
        const response = await getOrganizationInviteWithUuid(String(searchParams.get("orgId")))
        setOrganization(response.organization)
    }

    const handleDeclarePresence = async () => {
        console.log(member)
        console.log(user)
        console.log(organization)
        if (!organization || !user) return;
        const response = await createMember({
            organizationId: organization.id,
            userId: user.id,
            isAdmin: false,
            startDate: new Date()
        })
        const newList = [...actualMemberships, {
            id: response.id,
            organizationId: response.organizationId,
            organizationName: organization.name,
            isAdmin: false
        }]
        dispatch(setMemberships(newList))
        dispatch(setSelectedOrganization(organization.id))
        router.push("/dashboard")
    }

    useEffect(() => {
        console.log("hello")
        loadInvite()
    }, []);

    return (
        <div>
            <h1>Rejoindre {}</h1>
            <Button onClick={handleDeclarePresence}>Rejoindre</Button>
        </div>
    )
}

export default JoinOrganization;