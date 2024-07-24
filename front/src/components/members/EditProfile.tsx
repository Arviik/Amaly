import {selectCurrentUser} from "@/app/store/slices/authSlice";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getMe, updateUser} from "@/api/services/user";
import {User} from "@/api/type";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {toast} from "../ui/use-toast";

const EditProfile = () => {
    const user = useSelector(selectCurrentUser);
    const [fullUser, setFullUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            if (!user) return;
            const response = await getMe();
            setFullUser(response);
        };
        loadUser();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!fullUser) return;
        setFullUser({...fullUser, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullUser) return;
        setIsLoading(true);
        try {
            await updateUser(fullUser.id, {
                email: fullUser.email,
                firstName: fullUser.firstName,
                lastName: fullUser.lastName,
            });
            toast({
                title: "Success",
                description: "Profile updated successfully",
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            });
            setIsLoading(false);
        }

        if (!fullUser) return null;

        /*const handleChangesPassword = () => {
            if (!fullUser) return;
            if (oldPasswordRef.current?.value === "" || newPasswordRef.current?.value === "" || verifyNewPasswordRef.current?.value === "") {
                return
            }
            if (verifyNewPasswordRef.current?.value !== newPasswordRef.current?.value) {
            }
        }*/

        return (
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Your Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={fullUser.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={fullUser.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={fullUser.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update Profile"}
                        </Button>
                    </CardContent>
                </Card>
            </form>
        );
    };
}

export default EditProfile;