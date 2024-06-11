import {Choice, Poll} from "./PollList.tsx";
import {ChoiceList} from "./ChoiceList.tsx";
import './PollCard.css'
import {useEffect, useState} from "react";
import {createSecondPoll, createVote, getVotes} from "../services/polls.ts";

interface pollProps{
    poll: Poll,
    reloadList: () => void
}

export const PollCard = ({poll, reloadList}: pollProps) => {
    const [choiceList, setChoiceList] = useState<Choice[]>(poll.choices)
    const [viewResult, setViewResult] = useState<boolean>(false)
    const [stats, setStats] = useState<Map<number|string, number>>(new Map())

    const onChoiceChecked = (choice: Choice) => {
        const newChoiceList = poll.choices.map((c: Choice) => {
            if (JSON.stringify({...c, checked: undefined}) === JSON.stringify({...choice, checked: undefined})){
                c.checked = !c.checked;
            }else{
                c.checked = false;
            }
            return c;
        })
        setChoiceList(newChoiceList)
    }

    const submitVote = async () => {
        const selectedChoice = choiceList.find((choice) => choice.checked === true)
        if (selectedChoice?.id){
            console.log(selectedChoice.id)
            await createVote(selectedChoice.id)
            setViewResult(true)
        }
    }




    const loadStats = async () => {
        if (!poll.id) return
        const stats = await getVotes(poll.id)
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

    const closePoll = async () => {
        if (poll.modality === "ONE") {
            console.log("eeeyy")
            const statsWithoutTotal = new Map(stats)
            statsWithoutTotal.delete('total')
            const winningVote = [...statsWithoutTotal.entries()].reduce((a, e ) => e[1] > a[1] ? e : a)
            console.log(winningVote)
        }else{
            const statsWithoutTotal = new Map(stats)
            statsWithoutTotal.delete('total')
            const choiceToPush = []
            const firstVote = [...statsWithoutTotal.entries()].reduce((a, e ) => e[1] > a[1] ? e : a)
            if (choiceList.find((choice) => choice.id === firstVote[0])){
                choiceToPush.push(choiceList.find((choice) => choice.id === firstVote[0]))
            }
            statsWithoutTotal.delete(firstVote[0])
            const secondVote = [...statsWithoutTotal.entries()].reduce((a, e ) => e[1] > a[1] ? e : a)
            if (choiceList.find((choice) => choice.id === secondVote[0])){
                choiceToPush.push(choiceList.find((choice) => choice.id === secondVote[0]))
            }
            if (choiceToPush){
                // @ts-ignore
                await createSecondPoll(poll, choiceToPush)
            }
        }

        reloadList()
    }

    return (
        <div className="poll-card">
            <h3>{poll.text}</h3>
            <ChoiceList stats={stats} choiceClickHandler={onChoiceChecked} pollId={poll.id} viewResult={viewResult} choices={choiceList}/>
            <div className="poll-card__actions">
                <button onClick={() => {setViewResult(!viewResult)}} className="action-button">{viewResult ? "Hide Results" : "View Results"}</button>
                <button onClick={submitVote} className="submit-button">Submit</button>
                <button onClick={closePoll} className="submit-button">Close Poll</button>
            </div>
        </div>
    )
}