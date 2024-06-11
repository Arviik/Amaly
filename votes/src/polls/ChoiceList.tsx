import {Choice} from "./PollList.tsx";
import {ChoiceCard} from "./ChoiceCard.tsx";
import './ChoiceList.css'

interface ChoiceListProps{
    choices: Choice[]
    viewResult: boolean
    pollId?: string
    choiceClickHandler: (choice: Choice) => void;
    stats: Map<number|string, number>
}

export const ChoiceList = ({choices, viewResult, pollId, choiceClickHandler, stats}: ChoiceListProps) => {


    return (
        <div className="choice-list-container">
            {choices.map((choice, index) => (<ChoiceCard statsRatio={(stats && stats.get(Number(choice.id)) && stats.get('total')) ?  (stats.get(Number(choice.id))/stats.get('total')) : 0} viewResult={viewResult} choiceClickHandler={choiceClickHandler} checked={(choice.checked !== undefined) ? choice.checked : false} key={index} choice={choice}/>))}
            {stats && stats.get('total')} Votes
        </div>
    )
}