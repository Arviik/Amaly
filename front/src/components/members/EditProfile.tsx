import {selectCurrentUser} from "@/app/store/slices/authSlice";
import {useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {getMe, updateUser} from "@/api/services/user";
import {User} from "@/api/type";
import {Input} from "@/components/ui/input";
import { Button } from "../ui/button";
import {Label} from "@/components/ui/label";

const EditProfile = () => {
    const user = useSelector(selectCurrentUser)
    const [fullUser, setFullUser] = useState<User| null>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const oldPasswordRef = useRef<HTMLInputElement>(null);
    const newPasswordRef = useRef<HTMLInputElement>(null);
    const verifyNewPasswordRef = useRef<HTMLInputElement>(null);

    const loadUser = async () => {
        if (!user) return;
        const response = await getMe()
        setFullUser(response)
    }

    useEffect(() => {
        loadUser()
    }, []);

    const handleChangesInformation = async () => {
        if (!fullUser || emailRef.current?.value === "" || firstNameRef.current?.value === "" || lastNameRef.current?.value === "") {return}
        await updateUser(fullUser.id, {
            email: emailRef.current?.value,
            firstName: firstNameRef.current?.value,
            lastName: lastNameRef.current?.value,
        })
    }

    const handleChangesPassword = () => {
        if (!fullUser) return;
        if (oldPasswordRef.current?.value === "" || newPasswordRef.current?.value === "" || verifyNewPasswordRef.current?.value === "") {return}
        if (verifyNewPasswordRef.current?.value !== newPasswordRef.current?.value) {}
    }

    return (
        <div>
            <h1>Edit your profile</h1>
            {fullUser ?
                <>
                    <Label htmlFor={"email"}>Email</Label>
                    <Input id={"email"} value={fullUser.email} onChange={() => {setFullUser({...fullUser, email: String(emailRef.current?.value)})}} ref={emailRef} placeholder={"Email"} type={"email"}/>
                    <Label htmlFor={"firstName"}>First Name</Label>
                    <Input id={"firstName"} value={fullUser.firstName} onChange={() => {setFullUser({...fullUser, firstName: String(firstNameRef.current?.value)})}} ref={firstNameRef} placeholder={"First Name"} type={"text"}/>
                    <Label htmlFor={"lastName"}>Last Name</Label>
                    <Input id={"lastName"} value={fullUser.lastName} onChange={() => {setFullUser({...fullUser, lastName: String(lastNameRef.current?.value)})}}  ref={lastNameRef} placeholder={"Last Name"} type={"text"}/>
                    <Button onClick={handleChangesInformation}>Confirm Changes</Button>
                    <hr/>
                    <Input ref={oldPasswordRef} placeholder={"Old Password"} type={"password"}/>
                    <Input ref={newPasswordRef} placeholder={"New Password"} type={"password"}/>
                    <Input ref={verifyNewPasswordRef} placeholder={"Verify New Password"} type={"password"}/>
                    <Button onClick={handleChangesPassword}>Confirm Changes</Button>
                </>
                :
                    null
            }

        </div>
    )
}

export default EditProfile