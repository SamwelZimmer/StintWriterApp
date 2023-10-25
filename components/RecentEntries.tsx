"use client";

import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import Link from "next/link";

import { userDataAtom } from "../atoms/userDataAtom";
import { userStintsAtom } from "../atoms/userStintsAtom";
import { useFetchUserDataFromLocalStorage } from "../hooks/useFetchUserDataFromLocalStorage";
import { useFetchUserStintsFromLocalStorage } from "../hooks/useFetchUserStintsFromLocalStorage";
import { shortenString } from "../lib/helpers";

export default function RecentEntries() {

    const [userData, _] = useRecoilState(userDataAtom);
    const [stints, __] = useRecoilState(userStintsAtom);
    useFetchUserDataFromLocalStorage();   
    useFetchUserStintsFromLocalStorage();

    const reversedEntries = userData?.recentEntries.slice().reverse();

    return (
        <>
            {
                (reversedEntries && reversedEntries.length > 0)
                ?
                <>
                {
                    reversedEntries.map((entry, i) => {
                        let stintId = entry.split("/")[0];
                        let day = entry.split("/")[1];

                        let stint = stints?.find(stint => stint.id === stintId);

                        return (
                            <Link href={`/stints/${stintId}/day-${day}`} key={i} className="w-full h-full border dark:border-gray-800 rounded bg-background dark:bg-card-dark shadow-sm p-4 flex items-center justify-between hover:border-secondary">
                                
                                { stint?.title && <span className="font-medium">{stint?.title.length > 40 ? shortenString(stint?.title, 35) + "..." : stint?.title}</span> }
                                <div className="flex flex-row gap-2 items-center">
                                    <span className="text-sm opacity-50">Day:</span>
                                    <span>{day}/{stint?.numberOfDays}</span>
                                </div>

                            </Link>
                        )
                    })
                }
                </>
                :
                <div className="flex flex-col justify-center items-center w-full h-full border border-secondary/50 border-dashed p-8 rounded-md gap-2 ">
                    <span className="text-gray-400 text-sm">You haven{"'"}t written anything yet.</span>
                    <span className="text-gray-400 text-sm">Create a stint and write your first entry.</span>
                </div>
            }
        </>
    );
}