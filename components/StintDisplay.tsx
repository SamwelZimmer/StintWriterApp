"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { AiOutlineCalendar, AiOutlineClockCircle, AiOutlinePlus, AiOutlineArrowRight } from "react-icons/ai";
import { PiClockCountdownBold, PiClockClockwiseBold, PiClockCounterClockwiseBold } from "react-icons/pi";

import { Stint, CategorisedStints, StintCardProps } from "../lib/types";
import { formatDateFromTimestamp, categorizeStints } from "../lib/helpers";


const tabs = ["active", "upcoming", "past"];

const icons = [<PiClockCountdownBold key="countdown" />, <PiClockClockwiseBold key="clockwise" />, <PiClockCounterClockwiseBold key="anticlockwise" />];

interface TabsProps {
    categorizedStints: CategorisedStints;
    Card: React.ComponentType<StintCardProps>;
};

export default function StintDisplay({ categorizedStints, Card }: TabsProps) {
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
                              <Card key={stint.id} stint={stint} />
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
};