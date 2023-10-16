"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { motion } from "framer-motion";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { BsDot } from "react-icons/bs";

import AuthChecker from "../../../../components/AuthChecker";
import Navbar from "../../../../components/Navbar";
import { getStint } from "../../../../lib/firebase";
import { Stint } from "../../../../lib/types";
import { userIdAtom } from "../../../../atoms/userIdAtom";
import { formatDateFromTimestamp, categorizeStints } from "../../../../lib/helpers";
import { useFetchUserDataFromLocalStorage } from "../../../../hooks/useFetchUserDataFromLocalStorage";

const ENTRIES_PER_PAGE = 49; 
const ONE_DAY_IN_SECONDS = 86400;

type ContextType = {
    params: {
        stint: string;
    };
    searchParams: {
        query?: string;
    };
};

export default function StintPage(context: ContextType) {
    const [userId, _] = useRecoilState(userIdAtom);
    useFetchUserDataFromLocalStorage();    
    const [stintData, setStintData] = useState<Stint | null>(null);
    const [page, setPage] = useState(1);

    const router = useRouter();

    const stintId = context.params.stint

    const nowInSeconds = Math.floor(Date.now() / 1000);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getStint(userId, stintId);
            console.log(data);
            if (data && "id" in data && "title" in data) {
                setStintData(data as Stint);
            } else {
                console.error('Data retrieved from Firebase does not match the Stint type.');
            }
        };

        fetchData();
    }, [userId, stintId]);

    const startIndex = (page - 1) * ENTRIES_PER_PAGE;
    const endIndex = startIndex + ENTRIES_PER_PAGE;
    const currentEntries = stintData?.entries.slice(startIndex, endIndex);   
    
    let numberOfPages = 1;
    if (stintData) {
        numberOfPages = Math.ceil(stintData.entries.length / ENTRIES_PER_PAGE);
    }
    
    let status = "";
    if (stintData){
        const nonEmptyKey = Object.entries(categorizeStints([stintData])).find(([key, value]) => value.length > 0)?.[0] || "";
        status = nonEmptyKey[0].toUpperCase() + nonEmptyKey.slice(1)
    }

    return (
        <>
            <Navbar />

            <AuthChecker />

            <main className="bg-background flex flex-col h-screen items-center justify-center py-24 sm:pb-24 px-8 gap-8">

                <div className="w-max flex flex-col gap-4">
                    <section className="flex flex-col sm:flex-row justify-between">
                        {
                            stintData?.title 
                            ?
                            <h1 className="text-4xl font-semibold w-[264px] sm:w-[416px]">{stintData?.title}</h1>
                            :
                            <div className="h-8 animate-pulse bg-gray-200 rounded-full w-[250px] sm:w-[400px]"></div>
                        }
                    </section>

                    <section className="flex flex-col w-full gap-4">
                        {
                            stintData 
                            ?
                            <>
                                <div className="flex gap-2 text-sm"><span className="font-light opacity-50">Status: </span><div>{status}</div></div>

                                <div className="flex flex-col sm:flex-row sm:items-center w-full justify-start text-sm gap-4">
                                    <div className="w-max flex sm:flex-col gap-2 sm:gap-0">
                                        <span className="font-light opacity-50">Start: </span>
                                        <span className="w-max">{formatDateFromTimestamp(stintData?.startDate || { seconds: 0, nanoseconds: 0 })}</span>
                                    </div>
                                    <span className="w-full hidden sm:flex items-center justify-center">
                                        <AiOutlineArrowRight size={20} />
                                    </span>
                                    <div className="w-max flex flex-row gap-2 sm:gap-0 sm:flex-col items-end">
                                        <span className="font-light opacity-50 text-left sm:w-full">End: </span>
                                        <span className="w-max">{formatDateFromTimestamp(stintData?.endDate || { seconds: 0, nanoseconds: 0 })}</span>
                                    </div>

                                </div>
                            </>
                            :
                            <>
                                <div className="h-4 mb-2 animate-pulse bg-gray-200 rounded-full w-2/3"></div>
                                <div className="h-4 mb-2 animate-pulse bg-gray-200 rounded-full w-1/2"></div>
                                <div className="h-4 animate-pulse bg-gray-200 rounded-full w-full"></div>
                            </>
                        }

                    </section>

                    <section className="w-max flex flex-col gap-2">

                        <div className="rounded-md w-max mx-auto">
                            <div className="grid grid-cols-7 gap-4 sm:gap-8 h-max overflow-scroll w-max mx-auto">
                                {
                                    currentEntries?
                                    <>
                                        {currentEntries?.map((entry, i) => {
                                            let timestamp = nowInSeconds;
                                            if (stintData) {
                                                timestamp = stintData?.startDate?.seconds + ((i - 1) * ONE_DAY_IN_SECONDS);
                                            }

                                            let bgColour = "bg-white";
                                            if (entry.length !== 0) {
                                                bgColour = "bg-secondary"
                                            } else if (timestamp < nowInSeconds) {
                                                bgColour = "bg-gray-200"
                                            }

                                            return (
                                                <button 
                                                    key={i} 
                                                    onClick={() => router.push(`/stints/${stintId}/day-${startIndex + i + 1}`)} 
                                                    className={`${bgColour} mx-auto hover:opacity-70 w-6 sm:w-8 aspect-square border rounded-md`} 
                                                />
                                        )})}
                                    </>
                                    :
                                    <>
                                        {Array.from({ length: 24 })?.map((_, i) => {
                                            return (
                                                <button 
                                                    key={i} 
                                                    onClick={() => router.push(`/stints/${stintId}/day-${startIndex + i + 1}`)} 
                                                    className={`${i < 10 ? "bg-gray-200" : "bg-white"} animate-pulse mx-auto hover:opacity-70 w-6 sm:w-8 aspect-square border rounded-md`} 
                                                />
                                        )})}
                                    </>
                                }
                            </div>
                        </div>

                        
                        {
                            numberOfPages > 1 &&
                            <>
                                <div className="w-full flex flex-row justify-center m-0 p-0">
                                    <nav className="flex flex-row gap-2 m-0 p-0">
                                        <motion.button onClick={() => setPage(page - 1)} disabled={page === 1} className={`border h-full px-2 rounded-md text-text bg-white disabled:opacity-50 hover:opacity-50`}>
                                            <AiOutlineArrowLeft size={20} />
                                        </motion.button>
                                        
                                        <>
                                            {
                                                numberOfPages <= 4 ? 
                                                <>
                                                    {Array.from({ length: numberOfPages }).map((_, idx) => (
                                                        <button 
                                                            key={idx}
                                                            onClick={() => setPage(idx + 1)}
                                                            className={`px-3 py-1 border rounded-md ${page === idx + 1 ? 'bg-accent text-white' : 'bg-white'} hover:opacity-50`}
                                                        >
                                                            {idx + 1}
                                                        </button>
                                                    ))}
                                                </>
                                                :
                                                <>
                                                    <button onClick={() => setPage(1)} className={`w-10 h-10 border rounded-md bg-white hover:opacity-50`}>
                                                        1
                                                    </button>

                                                    <div className={`items-center justify-center flex rounded-md `}>
                                                        <BsDot />
                                                    </div>

                                                    <div className={`w-10 h-10 border flex items-center justify-center rounded-md bg-accent text-white hover:opacity-50`}>
                                                        {page}
                                                    </div>

                                                    <div className={`items-center justify-center flex rounded-md `}>
                                                        <BsDot />
                                                    </div>

                                                    <button onClick={() => setPage(numberOfPages)} className={`w-10 h-10 border rounded-md bg-white hover:opacity-50`}>
                                                        {numberOfPages}
                                                    </button>
                                                </>
                                            }

                                        </>

                                        <motion.button onClick={() => setPage(page + 1)} disabled={page === numberOfPages} className={`border h-full px-2 rounded-md text-text bg-white disabled:opacity-50 hover:opacity-50`}>
                                            <AiOutlineArrowRight size={20} />
                                        </motion.button>
                                    </nav>

                                </div>
                                
                                <div className="flex items-center justify-center pt-4">
                                    <div className="mx-auto w-40 text-xl flex justify-between">
                                        Days: 
                                        <span className="w-1/3 flex items-center justify-center">{startIndex + 1}</span>
                                        - 
                                        <span className="w-1/3 flex items-center justify-center">{Math.min(endIndex, (stintData?.entries.length || 0))}</span></div>
                                </div>

                            </>
                        }

                    </section>
                </div>


                
            </main>
        </>
    );
};