"use client"
import ActivitiesDetails from "@/components/public/activities/ActivitiesDetails";

const ActivityDetailsPage = ({params}: {params: {id: string}}) => {

    return (
        <div>
            <ActivitiesDetails id={params.id}></ActivitiesDetails>
        </div>
    )
}

export default ActivityDetailsPage