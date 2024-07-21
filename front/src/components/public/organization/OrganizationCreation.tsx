"use client"
import React, {FormEvent, useRef} from 'react';
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {createOrganization} from "@/api/services/organization";
import {createMember} from "@/api/services/member";
import {useDispatch, useSelector} from "react-redux";
import {
    selectCurrentUser,
    selectMemberships,
    setMemberships,
    setSelectedOrganization
} from "@/app/store/slices/authSlice";
import {RootState} from "@/app/store";

const OrganizationForm = () => {
    const nameRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const router = useRouter()
    const user = useSelector(selectCurrentUser)
    const actualMemberships = useSelector(selectMemberships)
    const dispatch = useDispatch()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!nameRef.current?.value || !typeRef.current?.value || !addressRef.current?.value || !emailRef.current?.value || !phoneRef.current?.value || !user) return;
        const formData = {
            name: nameRef.current.value,
            type: typeRef.current.value,
            address: addressRef.current.value,
            email: emailRef.current.value,
            phone: phoneRef.current.value,
        };
        const orgaResponse = await createOrganization(formData)
        const memberResponse = await createMember({
            organizationId: orgaResponse.id,
            isAdmin: true,
            startDate: new Date(),
            userId: user?.id,
            employmentType: "Admin"
        })
        const newList = [...actualMemberships, {
            id: memberResponse.id,
            organizationId: memberResponse.organizationId,
            organizationName: orgaResponse.name,
            isAdmin: true
        }]
        dispatch(setMemberships(newList))
        dispatch(setSelectedOrganization(orgaResponse.id))
        setTimeout(() => {

        }, 1500)
        router.push("/dashboard")
        console.log(actualMemberships)
        console.log(formData)
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <Label htmlFor="name">Name:</Label>
                <Input id="name" type="text" ref={nameRef} />
            </div>
            <div>
                <Label htmlFor="type">Type:</Label>
                <Input id="type" type="text" ref={typeRef} />
            </div>
            <div>
                <Label htmlFor="address">Address:</Label>
                <Input id="address" type="text" ref={addressRef} />
            </div>
            <div>
                <Label htmlFor="email">Email:</Label>
                <Input id="email" type="email" ref={emailRef} />
            </div>
            <div>
                <Label htmlFor="phone">Phone:</Label>
                <Input id="phone" type="tel" ref={phoneRef} />
            </div>
            <Button type="submit">Submit</Button>.
            <Button onClick={() => {
                router.push("/dashboard")}}>Cancel</Button>
        </form>
    );
};

export default OrganizationForm;
