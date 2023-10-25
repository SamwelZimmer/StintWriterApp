"use client";

import { useRecoilState } from "recoil";
import Link from "next/link";
import { motion } from "framer-motion";
import { AiOutlinePlus, AiOutlineArrowRight } from "react-icons/ai";
import { BsChevronLeft, BsChevronRight, BsDot } from "react-icons/bs";
import { useState } from "react";

import { userStintsAtom } from "../atoms/userStintsAtom";
import { useFetchUserStintsFromLocalStorage } from "../hooks/useFetchUserStintsFromLocalStorage";
import { categorizeStints, formatDateFromTimestamp, shortenString } from "../lib/helpers";
import { DefaultSpinner } from "./Loaders";
import { Stint } from "../lib/types";
import { ONE_DAY_IN_SECONDS } from "../lib/constants";
import Markdown from "react-markdown";

export default function ActiveStints() {

    const [stints, __] = useRecoilState(userStintsAtom);
    useFetchUserStintsFromLocalStorage();

    let activeStints;
    if (stints) {
        activeStints = categorizeStints(stints).active;
    };

    return (
        <div className="flex flex-col w-full h-full gap-2">
        <span className="font-semibold text-gray-400">Active Stints...</span>

        <section className="rounded-md p-4 border dark:border-gray-800 bg-background dark:bg-card-dark flex flex-col shadow-md h-[300px] sm:h-[300px]">
            {
                !activeStints ?

                <div className="w-full h-full flex bg-background dark:bg-card-dark items-center justify-center">
                    <div className="w-32 aspect-square p-4">
                        <DefaultSpinner />
                    </div>
                </div>
                :
                <div className="w-full h-full">
                    {
                        activeStints?.length > 0 ?

                        <Carousel activeStints={activeStints} />
                        :

                        <div className="flex h-full w-full items-center justify-center gap-4 sm:gap-8">
                            <span>You have no active stints</span>
                            <Link href={"/create"}>
                                <motion.button className="bg-primary hover:bg-accent shadow-md border mx-auto sm:mx-0 rounded-md px-6 py-3 w-max flex items-center gap-4 justify-between text-text hover:text-white"><AiOutlinePlus size={20} />New </motion.button>
                            </Link>
                        </div>
                    }
                </div>
            }

        </section>
        </div>
    );
};

interface CarouselProps {
    activeStints: Stint[];
};

const Carousel = ({ activeStints }: CarouselProps) => {

    const [activeIndex, setActiveIndex] = useState(0);

    const nowInSeconds = Math.floor(Date.now() / 1000);
    
    let timestamp = activeStints[activeIndex]?.startDate?.seconds;

    let differenceInSeconds = nowInSeconds - timestamp;    
    let day = Math.floor(differenceInSeconds / ONE_DAY_IN_SECONDS);

    let entry = activeStints[activeIndex].entries[day];

    const handleLeftClick = () => {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        }
    };

    const handleRightClick = () => {
        if (activeIndex < activeStints.length - 1) {
            setActiveIndex(activeIndex + 1);
        }
    };

    return (
        <div className="h-full w-full flex flex-col">
            <Link href={`/stints/${activeStints[activeIndex].id}/day-${day + 1}`} className="border dark:border-gray-500 dark:hover:border-secondary hover:border-secondary rounded-md w-full h-full flex flex-col justify-between p-4 my-2">


                <div className="flex flex-row w-full justify-between items-center">
                    <div className="overflow-hidden flex">
                        <span className="font-medium">{activeStints[activeIndex].title.length > 40 ? shortenString(activeStints[activeIndex].title, 35) + "..." : activeStints[activeIndex].title}</span>
                    </div>

                    <span className="text-sm">Day {day + 1}/{activeStints[activeIndex].numberOfDays}</span>
                </div>

                
                {
                    entry.length === 0 ?

                    <div className="w-full h-full flex flex-col gap-2">
                        <div className="w-full h-full flex flex-col items-center justify-center text-sm text-text/50">
                            <span className="mx-auto">You haven{"'"}t written today.</span>
                            <span className="mx-auto">Get moving.</span>
                        </div>
                    </div>
                    :
                    <div className="w-full h-full flex flex-col gap-2 py-2 overflow-hidden">
                        <Markdown className="hidden lg:block h-full">
                            {shortenString(entry, 120) + "..."}
                        </Markdown>

                        <Markdown className="block lg:hidden h-full">
                            {shortenString(entry, 80) + "..."}
                        </Markdown>
                    </div>
                }

                <div className="flex flex-row items-center w-full lg:w-max justify-start text-sm mx-auto lg:gap-8">
                    <div className="w-max flex flex-col">
                        <span className="font-light opacity-50">Start: </span>
                        <span className="w-max">{formatDateFromTimestamp(activeStints[activeIndex].startDate)}</span>
                    </div>
                    <span className="w-full flex items-center justify-center">
                    <AiOutlineArrowRight />
                    </span>
                    <div className="w-max flex flex-col items-end">
                        <span className="font-light opacity-50 text-left w-full">End: </span>
                        <span className="w-max">{formatDateFromTimestamp(activeStints[activeIndex].endDate)}</span>
                    </div>
                </div>
            </Link>

            <div className="w-full flex flex-row gap-4 h-min items-center justify-center">
                <motion.button disabled={activeIndex <= 0} onClick={handleLeftClick} className="hover:opacity-50 disabled:opacity-50"><BsChevronLeft size={20} /></motion.button>
                {
                    Array.from({ length: activeStints.length }).map((_, index) => (
                        <motion.button onClick={() => setActiveIndex(index)} key={index} className={`${activeIndex === index ? "bg-secondary" : "bg-gray-200 dark:bg-gray-700"} hover:bg-accent dark:hover:bg-accent w-3 aspect-square rounded-full`} >
                            
                        </motion.button>
                    ))
                }         
                <motion.button disabled={activeIndex >= activeStints.length - 1} onClick={handleRightClick} className="hover:opacity-50 disabled:opacity-50"><BsChevronRight size={20} /></motion.button>             
            </div>

        </div>
    );
}