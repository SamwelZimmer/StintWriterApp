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

    return (
        <>
            <Navbar />

            <AuthChecker />

            <main className="bg-background flex flex-col h-screen items-center justify-center pt-24 pb-8 sm:pb-24 px-8 gap-8">

                <section className="w-full flex flex-col sm:flex-row justify-between sm:w-[600px] lg:w-[900px] gap-8">
                    <h1 className="text-4xl font-semibold text-center">{stintData?.title}</h1>
                </section>

                <section className="flex flex-col w-full sm:w-[600px] lg:w-[900px]">
                    <span>Start: </span>
                    <span>End: </span>
                    <span>Status: </span>
                </section>

                <section className="w-full sm:w-[600px] lg:w-[900px] flex flex-col gap-2">

                    <div className=" rounded-md w-max p-4 mx-auto">
                        <div className="grid grid-cols-7 gap-4 sm:gap-8 h-max overflow-scroll w-max mx-auto">
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
                
            </main>
        </>
    );
};