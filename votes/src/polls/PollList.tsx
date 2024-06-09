import {useEffect, useState} from "react";
import {getPools} from "../services/polls.ts";
import {PollCard} from './PollCard.tsx'
import './PollList.css'

export interface Poll{
    id?: string;
    text: string;
    createdAt: Date;
    choices: Choice[]
}

export interface Choice{
    id?: string;
    choice: string;
    checked?: boolean
}

export const PollList = () => {
    const [polls, setPolls] = useState<Poll[]>([])

    const loadPolls = async () => {
        const newPolls = await getPools()
        setPolls(newPolls)
    }

    useEffect(() => {
        loadPolls()
    }, []);

    return (
        <div className="poll-list-container">
            {polls.map((poll, index) => (<PollCard key={index} poll={poll} />))}
        </div>
    )
}