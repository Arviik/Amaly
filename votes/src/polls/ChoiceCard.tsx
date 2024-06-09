import {Choice} from "./PollList.tsx";
import './ChoiceCard.css'
import {useRef} from "react";

interface ChoiceCardProps{
    choice: Choice
    checked?: boolean;
    viewResult: boolean;
    statsRatio?: number
    choiceClickHandler: (choice: Choice) => void;
}

export const ChoiceCard = ({choice, checked, choiceClickHandler, viewResult, statsRatio}: ChoiceCardProps) => {
    const checkboxRef = useRef<HTMLInputElement>(null)

    const onCardClick = () => {
        if (!viewResult){
            choiceClickHandler(choice)
        }
    }

    return (
        <>
            <div className={`choice-card ${(viewResult) ? 'view-result' : ''}`} onClick={onCardClick}>
                <div className={`stat-bar + ${(viewResult) ? 'stat-bar-active' : ''}`} style={{
                    width: `${ (statsRatio && viewResult) ? statsRatio*100 : 0}%`
                }}></div>
                <label>
                    {viewResult ?
                            <div className="result-card">
                                <span>{choice.choice}</span>
                                <span className="stats">{(statsRatio) ? Math.round(statsRatio*100) : 0}%</span>
                            </div>
                        :
                            <>
                                <input readOnly={true} checked={checked} ref={checkboxRef} type={"checkbox"}/>
                                {choice.choice}
                            </>
                    }

                </label>
            </div>
        </>

    )
}