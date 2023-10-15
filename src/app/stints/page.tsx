"use client";

import { useRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AiOutlineCalendar, AiOutlineClockCircle, AiOutlinePlus, AiOutlineArrowRight } from "react-icons/ai";
import { PiClockCountdownBold, PiClockClockwiseBold, PiClockCounterClockwiseBold } from "react-icons/pi";
import Link from "next/link";

import Navbar from "../../../components/Navbar";
import AuthChecker from "../../../components/AuthChecker";
import { userIdAtom } from "../../../atoms/userIdAtom";
import { userStintsAtom } from "../../../atoms/userStintsAtom";
import { useFetchUserDataFromLocalStorage } from "../../../hooks/useFetchUserDataFromLocalStorage";
import { useFetchUserStintsFromLocalStorage } from "../../../hooks/useFetchUserStintsFromLocalStorage";
import { Stint, CategorisedStints } from "../../../lib/types";
import { formatDateFromTimestamp, categorizeStints } from "../../../lib/helpers";

export default function StintsPage() {

    const [userId, _] = useRecoilState(userIdAtom);
    const [stints, __] = useRecoilState(userStintsAtom);
    useFetchUserDataFromLocalStorage();
    useFetchUserStintsFromLocalStorage();

    let categorizedStints;
    if (stints) {
        categorizedStints = categorizeStints(stints);
    };

    return (
        <>
          <AuthChecker />
          
          <Navbar showBackButton />

          <main className="bg-background flex flex-col h-screen items-center justify-center pt-24 pb-8 sm:pb-24 px-8 gap-8">
            
            <section className="w-full flex flex-col sm:flex-row justify-between sm:w-[600px] lg:w-[900px] gap-8">
                <h1 className="text-4xl font-semibold text-center">Your Stints</h1>
                <Link href={"/create"}>
                  <motion.button className="bg-primary hover:bg-accent shadow-md border mx-auto sm:mx-0 rounded-md px-6 py-3 w-max flex items-center gap-4 justify-between text-text hover:text-white"><AiOutlinePlus size={20} />New </motion.button>
                </Link>
            </section>

            <section className="w-full h-full sm:w-[600px] lg:w-[900px] flex flex-col gap-2">
                {/* <span className="opacity-50">Exisiting Stints</span> */}
                <Tabs categorizedStints={categorizedStints || { "active": [], "upcoming": [], "past": [] }} />
            </section>


        </main>
        </>

    );
};

interface StintCardProps {
    stint: Stint;
}

const StintCard = ({ stint }: StintCardProps) => {

    const router = useRouter()

    return (
        <motion.div 
            onClick={() => router.push(`/stints/${stint.id}`)} 
            className="w-full cursor-pointer h-min p-4 border hover:border-secondary rounded-md flex flex-col gap-4 shadow-sm"
        >
            <span className="font-semibold">{stint.title}</span>
            <div className="flex flex-row items-center w-full justify-start text-sm">
                <div className="w-max flex flex-col">
                    <span className="font-light opacity-50">Start: </span>
                    <span className="w-max">{formatDateFromTimestamp(stint.startDate)}</span>
                </div>
                <span className="w-full flex items-center justify-center">
                  <AiOutlineArrowRight />
                </span>
                <div className="w-max flex flex-col items-end">
                    <span className="font-light opacity-50 text-left w-full">End: </span>
                    <span className="w-max">{formatDateFromTimestamp(stint.endDate)}</span>
                </div>

            </div>
        </motion.div>
    );
}

const tabs = ["active", "upcoming", "past"];

const icons = [<PiClockCountdownBold key="countdown" />, <PiClockClockwiseBold key="clockwise" />, <PiClockCounterClockwiseBold key="anticlockwise" />];

interface TabsProps {
    categorizedStints: CategorisedStints;
};

const Tabs = ({ categorizedStints }: TabsProps) => {
    const [selectedTab, setSelectedTab] = useState(0);

    const stintCategories = [categorizedStints.active, categorizedStints.upcoming, categorizedStints.past];
  
    return (
      <div className="w-full h-full rounded-lg overflow-hidden shadow-xl flex flex-col">

        <nav className="bg-gray-100 px-2 pt-2 border-b border-gray-200">
          <ul className="flex w-full">
            {tabs.map((item, i) => (
              <li
                key={i}
                className={`relative flex justify-center gap-4 items-center w-full px-4 py-2.5 cursor-pointer ${i === selectedTab ? "bg-gray-200" : "bg-white"} ${i === 0 && "rounded-tl-md"} ${i === tabs.length - 1 && "rounded-tr-md"}`}
                onClick={() => setSelectedTab(i)}
              > 
                <span className="hidden sm:block text-secondary">{icons[i]}</span>
                <span>{item}</span>

                {i === selectedTab ? (
                  <motion.div className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" layoutId="underline" />
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex items-center overflow-scroll w-full h-full p-2 sm:p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab ? selectedTab : "empty"}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`w-full ${stintCategories[selectedTab].length > 0 && "self-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" } gap-2 sm:gap-4`}
            >
                { stintCategories[selectedTab].length > 0 ? 
                    <>
                      {
                          stintCategories[selectedTab].map((stint) => (
                              <StintCard key={stint.id} stint={stint} />
                          ))
                      }
                    </>
                    :
                    <>
                        <div className="my-auto mx-auto w-full h-full text-center font-medium text-2xl sm:text-3xl">No {tabs[selectedTab]} stints</div>
                    </>
                }
       
            </motion.div>
          </AnimatePresence>
        </main>

      </div>
    );
  }
  