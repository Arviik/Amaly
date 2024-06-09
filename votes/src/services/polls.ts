import ky from "ky";
import {Poll} from "../polls/PollList.tsx";

export const getPools = async (): Promise<Poll[]> => {
    return await ky.get("http://localhost:3000/polls").json();
}

export const getVotes = async (pollId: string): Promise<Poll[]> => {
    return await ky.get("http://localhost:3000/choices", {searchParams: {poll_id: pollId}}).json();
}

export const createVote = async (choiceId: string): Promise<void> => {
    return await ky.post("http://localhost:3000/votes", {json: {userId: 1, choiceId: choiceId}}).json();
}

