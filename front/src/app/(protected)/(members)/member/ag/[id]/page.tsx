"use client"
import AGDetails from "@/components/public/ag/AGDetails";

const AGDetailsPage = ({params}: {params: {id: string}}) => {
    console.log("AGDetailsPage");
    console.log(params.id)

    return (
        <div>
            <AGDetails id={params.id}></AGDetails>
        </div>
    )
}

export default AGDetailsPage