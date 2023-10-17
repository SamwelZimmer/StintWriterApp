"use client";

import { useEffect, useState, useRef } from "react";
import { AiOutlineSave, AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import ReactMarkdown from 'react-markdown';
import { Toaster } from "react-hot-toast";

import AuthChecker from "../../../../../components/AuthChecker";
import Navbar from "../../../../../components/Navbar";
import { getFromLocalStorage, formatDateFromTimestamp, updateLocalStorage } from "../../../../../lib/helpers";
import { getEntry, updateSingleEntry, getNumberOfDays, getStartDate, getUserStints } from "../../../../../lib/firebase";
import { userIdAtom } from "../../../../../atoms/userIdAtom";
import { ONE_DAY_IN_SECONDS } from "../../../../../lib/constants";
import { userStintsAtom } from "../../../../../atoms/userStintsAtom";
import { useFetchUserDataFromLocalStorage } from "../../../../../hooks/useFetchUserDataFromLocalStorage";
import { useFetchUserStintsFromLocalStorage } from "../../../../../hooks/useFetchUserStintsFromLocalStorage";
import { errorToast, messageToast, successToast } from "../../../../../lib/toasties";
import { Stint } from "../../../../../lib/types";

type ContextType = {
    params: {
        entry: string;
        stint: string;
    };
    searchParams: {
        query?: string;
    };
};

export default function EntryPage(context: ContextType) {
    const [userId, _] = useRecoilState(userIdAtom);
    const [stints, __] = useRecoilState(userStintsAtom);
    useFetchUserDataFromLocalStorage();  
    useFetchUserStintsFromLocalStorage();

    const [entryData, setEntryData] = useState<string>("");
    const [showMenu, setShowMenu] = useState<boolean>(true);
    const [showMarkdown, setShowMarkdown] = useState<boolean>(false);

    const router = useRouter();

    // get the day using the current url
    const day = Number(context.params.entry.split("-")[1]);
    
    // get the stint id
    const stintId = context.params.stint;

    // get the stint from state
    const stint = stints?.find(stint => stint.id === stintId);

    // the current entry
    const entry = stint?.entries[day - 1];

    // getting the day's entry
    useEffect(() => {
        const fetchData = async () => {
            const data = await getEntry(userId, stintId, day);
            console.log(data);
            setEntryData(data);
        };

        fetchData();
    }, [userId, stintId]);

    // number of days in the stint
    const noOfDays = stint?.numberOfDays || 1;

    // calculate the date of the entry
    let startDate;
    let date = "date";
    if (stint) {
        startDate = stint?.startDate;
        const currentTimestamp = startDate.seconds + ((day - 1) * ONE_DAY_IN_SECONDS);
        date = formatDateFromTimestamp({ seconds: currentTimestamp, nanoseconds: 0 });
    }

    // closes the menu after a given time
    useEffect(() => {
        let timerId: NodeJS.Timeout;
    
        if (showMenu) {
            timerId = setTimeout(() => {
                setShowMenu(false);
            }, 5000); // 5000ms = 5 seconds
        };
    
        // Clear the timer if the component unmounts or if showMenu changes before the 5 seconds are up
        return () => clearTimeout(timerId);
    }, [showMenu]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.stopPropagation();
        e.preventDefault();

        messageToast("Hang on...")

        try {
            updateSingleEntry(userId, stintId, day, entryData);
            
            let updatedStints = await getUserStints(userId);
            updateLocalStorage("userStints", JSON.stringify(updatedStints));

            successToast("All good.")
        } catch (err) {
            console.log(err);
            errorToast("Yeah... we fucked up.")
        }
    };

    return (
        <>  
            { showMenu && <Navbar /> }

            <AuthChecker />

            <form onSubmit={handleSubmit} className="relative flex flex-col py-20 sm:py-24 px-8 h-screen">  

                <section className="flex flex-col gap-8 w-full h-full sm:w-[500px] md:w-[700px] lg:w-[800px] mx-auto z-0">
                    <div className="flex flex-row justify-between w-full items-center">
                        <h1 className="font-bold text-4xl">Day {day}</h1>
                        <div className="flex relative z-20">
                            <button onClick={() => setShowMenu(!showMenu)} type="button" className="bg-white hover:opacity-50"><BsThreeDots size={30} /></button>
                            <MenuBar showMarkdown={showMarkdown} setShowMarkdown={setShowMarkdown} visible={showMenu} day={Number(day)} stintId={stintId} noOfDays={noOfDays} date={date} />
                        </div>
                    </div>

                    { 
                        showMarkdown ? 
                        <>
                            <span className="font-light text-orange-400 opacity-50">{"markdown visible - read only"}</span>
                            <ReactMarkdown className="markdown block w-full h-full px-0 text-base border-0 my-0 focus:ring-0 focus:outline-none resize-none" >
                                {entryData}
                            </ReactMarkdown>                    
                        </>

                        :
                        <textarea 
                            value={entryData ? entryData : ""} 
                            onChange={(e) => setEntryData(e.target.value)} 
                            className="block w-full h-full px-0 text-base border-0 focus:ring-0 focus:outline-none resize-none" 
                            placeholder="Write something..."                
                        />
                    }

                </section>
            </form>

            <Toaster />
        </>
    );
};

interface MenuBarProps {
    day: number;
    stintId: string;
    noOfDays: number;
    visible: boolean;
    date: string;
    showMarkdown: boolean;
    setShowMarkdown: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuBar = ({ day, stintId, noOfDays, visible, date, showMarkdown, setShowMarkdown }: MenuBarProps) => {

    const router = useRouter();

    const variants = {
        enter: { opacity: 1, x: "0%" },
        exit: { opacity: 1, x: "100%" },
    };

    return (
        <motion.div animate={visible ? "enter" : "exit"} variants={variants} className={`${visible ? "block": "hidden"} w-full flex flex-col absolute top-12 pb-4 right-0 sm:pb-8 z-10 `} style={{ transform: 'translateX(calc(100%))' }}>
            <div className="relative z-10">
                <div  className={`absolute z-10 top-0 right-0 mx-auto h-min w-max border border-black/10 bg-background rounded-md flex flex-col gap-8 justify-between item-center p-4 shadow-lg text-secondary`}>

                    <div className="flex flex-col gap-4">
                        <button type="button" disabled={day <= 1} onClick={() => router.push(`/stints/${stintId}/day-${day - 1}`)} className="hover:opacity-50 disabled:opacity-25 flex items-center gap-4 text-sm" ><AiOutlineArrowLeft size={30} /><span className="text-gray-500">previous</span></button>
                        <button type="button" disabled={day >= noOfDays} onClick={() => router.push(`/stints/${stintId}/day-${day + 1}`)} className="hover:opacity-50 disabled:opacity-25 flex items-center gap-4 text-sm"><AiOutlineArrowRight size={30} /><span className="text-gray-500">next</span></button>
                    </div>
                    
                    <span className="flex item-center my-auto font-medium h-min w-max text-sm text-text">{date}</span>

                    <div className="flex flex-col gap-4">
                        <button type="button" onClick={() => setShowMarkdown(!showMarkdown)} className="bg-white hover:opacity-50 flex items-center gap-4 text-sm">{ showMarkdown ? <><AiOutlineEyeInvisible size={30} /><span className="text-gray-500">view</span></> : <><AiOutlineEye size={30} /><span className="text-gray-500">view</span></>} </button>
                        <button type="submit" className="bg-white hover:opacity-50 flex items-center gap-4 text-sm"><AiOutlineSave size={30} /><span className="text-gray-500">save</span></button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}