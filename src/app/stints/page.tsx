"use client";

import { useRecoilState } from "recoil";
import { motion } from "framer-motion";
import { AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";

import Navbar from "../../../components/Navbar";
import AuthChecker from "../../../components/AuthChecker";
import StintDisplay from "../../../components/StintDisplay";
import { userStintsAtom } from "../../../atoms/userStintsAtom";
import { useFetchUserStintsFromLocalStorage } from "../../../hooks/useFetchUserStintsFromLocalStorage";
import { categorizeStints } from "../../../lib/helpers";
import StintCard from "./StintCard";

export default function StintsPage() {

    const [stints, __] = useRecoilState(userStintsAtom);
    useFetchUserStintsFromLocalStorage();

    let categorizedStints;
    if (stints) {
        categorizedStints = categorizeStints(stints);
    };

    return (
        <>
          <AuthChecker />
          
          <Navbar showBackButton />

          <main className="bg-background dark:bg-background-dark flex flex-col h-screen items-center justify-center pt-24 pb-8 sm:pb-24 px-8 gap-8">
            
            <section className="w-full flex flex-col sm:flex-row justify-between sm:w-[600px] lg:w-[900px] gap-8">
                <h1 className="text-4xl font-semibold text-center">Your Stints</h1>
                <Link href={"/create"}>
                  <motion.button className="bg-primary hover:bg-accent dark:border-gray-800 dark:text-text-dark shadow-md border mx-auto sm:mx-0 rounded-md px-6 py-3 w-max flex items-center gap-4 justify-between text-text hover:text-white"><AiOutlinePlus size={20} />New </motion.button>
                </Link>
            </section>

            <section className="w-full h-full sm:w-[600px] lg:w-[900px] flex flex-col gap-2">
                <StintDisplay categorizedStints={categorizedStints || { "active": [], "upcoming": [], "past": [] }} Card={StintCard} />
            </section>
        </main>
        </>

    );
};
