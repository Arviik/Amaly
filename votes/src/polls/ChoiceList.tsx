import {Choice} from "./PollList.tsx";
import {ChoiceCard} from "./ChoiceCard.tsx";
import './ChoiceList.css'
import {useEffect, useState} from "react";
import {getVotes} from "../services/polls.ts";

interface ChoiceListProps{
    choices: Choice[]
    viewResult: boolean
    pollId?: string
    choiceClickHandler: (choice: Choice) => void;
}

export const ChoiceList = ({choices, viewResult, pollId, choiceClickHandler}: ChoiceListProps) => {
    const [stats, setStats] = useState<Map<number|string, number>>(new Map())



    const loadStats = async () => {
        if (!pollId) return
        const stats = await getVotes(pollId)
        const voteStats = new Map()
        stats.forEach((current: any) => {
            voteStats.set(current.id, current.Votes.length)
        }, [])

        const voteTotal = Array.from(voteStats.values()).reduce((acc: any, current: any) => acc + current)
        voteStats.set('total', voteTotal)
        console.log(voteStats)
        setStats(voteStats)
    }

    useEffect(() => {
            loadStats()
    }, [viewResult]);

    return (
        <div className="choice-list-container">
            {choices.map((choice, index) => (<ChoiceCard statsRatio={(stats && stats.get(Number(choice.id)) && stats.get('total')) ?  (stats.get(Number(choice.id))/stats.get('total')) : 0} viewResult={viewResult} choiceClickHandler={choiceClickHandler} checked={(choice.checked !== undefined) ? choice.checked : false} key={index} choice={choice}/>))}
            {stats && stats.get('total')} Votes
        </div>
    )
}