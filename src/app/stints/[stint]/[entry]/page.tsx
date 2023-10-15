"use client";

import { useEffect, useState, useRef } from "react";
import { AiOutlineSave, AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import AuthChecker from "../../../../../components/AuthChecker";
import Navbar from "../../../../../components/Navbar";
import { getFromLocalStorage, formatDateFromTimestamp } from "../../../../../lib/helpers";
import { getEntry, updateSingleEntry, getNumberOfDays, getStartDate } from "../../../../../lib/firebase";

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
    const [userId, setUserId] = useState<object | null>();
    const [entryData, setEntryData] = useState<string>("");
    const [noOfDays, setNoOfDays] = useState<number>(1);
    const [date, setDate] = useState<string>("");
    const [showMenu, setShowMenu] = useState<boolean>(true);

    const formRef = useRef<HTMLFormElement | null>(null);
    const router = useRouter();

    // get the day using the current url
    const day = Number(context.params.entry.split("-")[1]);
    
    // get the stint id
    const stintId = context.params.stint;

    // getting the users id
    useEffect(() => {
        let fromStore = getFromLocalStorage("userData");
        if (fromStore) {
            let parsedData = JSON.parse(fromStore);
            if (parsedData && parsedData.uid) {
                setUserId(parsedData.uid);
            }
        }
    }, []);

    // getting the day's entry
    useEffect(() => {
        const fetchData = async () => {
            const data = await getEntry(userId, stintId, day);
            console.log(data);
            setEntryData(data);
        };

        fetchData();
    }, [userId, stintId]);

    // getting the number of days in the stint
    useEffect(() => {
        const fetchData = async () => {
            const numberOfDays = await getNumberOfDays(userId, stintId);
            setNoOfDays(numberOfDays);
        };

        fetchData();
    }, [userId, stintId]);

    // getting the stint's start date and calculating the entry's date
    useEffect(() => {
        const fetchData = async () => {
            const startTimeStamp = await getStartDate(userId, stintId);
            if (startTimeStamp) {
                const oneDayInSeconds = 86400;
                let currentTimestamp = startTimeStamp.seconds + ((day - 1) * oneDayInSeconds);
                setDate(formatDateFromTimestamp({ seconds: currentTimestamp, nanoseconds: 0 }));
            }
        };

        fetchData();
    }, [userId, day]);

    // closes the menu after a given time
    useEffect(() => {
        let timerId: NodeJS.Timeout;
    
        if (showMenu) {
            timerId = setTimeout(() => {
                setShowMenu(false);
            }, 5000); // 5000ms = 5 seconds
        }
    
        // Clear the timer if the component unmounts or if showMenu changes before the 5 seconds are up
        return () => clearTimeout(timerId);
    }, [showMenu]);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.stopPropagation();
        e.preventDefault();

        console.log("trying to submit")

        try {
            updateSingleEntry(userId, stintId, day, entryData);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>  
            { showMenu && <Navbar /> }

            <AuthChecker />

            <form onSubmit={handleSubmit} className="relative flex flex-col py-12 sm:py-24 px-8 h-screen">  

                <MenuBar formRef={formRef} visible={showMenu} day={Number(day)} stintId={stintId} noOfDays={noOfDays} date={date} />
                <section className="flex flex-col gap-8 w-full h-full sm:w-[500px] md:w-[700px] lg:w-[800px] mx-auto">
                    <div className="flex flex-row justify-between w-full items-center">
                        <h1 className="font-bold text-4xl">Day {day}</h1>
                        <button onClick={() => setShowMenu(!showMenu)} type="button" className="bg-white hover:opacity-50"><BsThreeDots size={30} /></button>
                    </div>

                    <textarea 
                        value={entryData ? entryData : ""} 
                        onChange={(e) => setEntryData(e.target.value)} 
                        className="block w-full h-full px-0 text-base border-0 focus:ring-0 focus:outline-none resize-none" 
                        placeholder="Write something..."                
                    />
                </section>
            </form>
        </>
    );
};

interface MenuBarProps {
    day: number;
    stintId: string;
    noOfDays: number;
    visible: boolean;
    date: string;
    formRef: React.RefObject<HTMLFormElement>;
}

const MenuBar = ({ day, stintId, noOfDays, visible, date, formRef }: MenuBarProps) => {

    const router = useRouter();

    const variants = {
        enter: { opacity: 1, y: "0%" },
        exit: { opacity: 1, y: "100%" },
    };

    return (
        <motion.div animate={visible ? "enter" : "exit"} variants={variants} className={`${visible ? "block": "hidden"} w-full px-8 flex absolute bottom-0 left-0 pb-4 sm:pb-8`}>
            <div  className={`w-full sm:w-[500px] md:w-[700px] lg:w-[800px] mx-auto h-min shadow-sm border border-black/10 flex flex-row justify-between item-center p-4`}>

                <div className="flex flex-row items-center gap-8">
                    <button type="button" disabled={day <= 1} onClick={() => router.push(`/stints/${stintId}/day-${day - 1}`)} className="hover:opacity-50 disabled:opacity-25" ><AiOutlineArrowLeft size={30} /></button>
                    <button type="button" disabled={day >= noOfDays} onClick={() => router.push(`/stints/${stintId}/day-${day + 1}`)} className="hover:opacity-50 disabled:opacity-25"><AiOutlineArrowRight size={30} /></button>
                </div>

                <span className="flex item-center my-auto font-medium">{date}</span>

                <button type="submit" className="bg-white hover:opacity-50"><AiOutlineSave size={30} /></button>
            </div>
        </motion.div>
    );
}