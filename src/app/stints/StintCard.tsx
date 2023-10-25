"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AiOutlineArrowRight } from "react-icons/ai";

import { StintCardProps } from "../../../lib/types";
import { formatDateFromTimestamp, categorizeStints } from "../../../lib/helpers";

export default function StintCard ({ stint }: StintCardProps) {

    const router = useRouter()

    return (
        <motion.div 
            onClick={() => router.push(`/stints/${stint.id}`)} 
            className="w-full cursor-pointer h-min p-4 border dark:border-gray-800 hover:border-secondary dark:hover:border-secondary rounded-md flex flex-col gap-4 shadow-sm"
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