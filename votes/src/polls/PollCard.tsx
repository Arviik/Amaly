import {Choice, Poll} from "./PollList.tsx";
import {ChoiceList} from "./ChoiceList.tsx";
import './PollCard.css'
import {useState} from "react";
import {createVote} from "../services/polls.ts";

interface pollProps{
    poll: Poll,

}

export const PollCard = ({poll}: pollProps) => {
    const [choiceList, setChoiceList] = useState<Choice[]>(poll.choices)
    const [viewResult, setViewResult] = useState<boolean>(false)

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

    return (
        <div className="poll-card">
            <h3>{poll.text}</h3>
            <ChoiceList choiceClickHandler={onChoiceChecked} pollId={poll.id} viewResult={viewResult} choices={choiceList}/>
            <div className="poll-card__actions">
                <button onClick={() => {setViewResult(!viewResult)}} className="action-button">{viewResult ? "Hide Results" : "View Results"}</button>
                <button onClick={submitVote} className="submit-button">Submit</button>
            </div>
        </div>
    )
}