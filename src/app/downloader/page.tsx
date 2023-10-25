"use client";

import { useRecoilState } from "recoil";

import AuthChecker from "../../../components/AuthChecker";
import Navbar from "../../../components/Navbar";
import StintDisplay from "../../../components/StintDisplay";
import StintCard from "./StintCard";
import { useFetchUserStintsFromLocalStorage } from "../../../hooks/useFetchUserStintsFromLocalStorage";
import { userStintsAtom } from "../../../atoms/userStintsAtom";
import { categorizeStints } from "../../../lib/helpers";

export default function DownloaderPage() {

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

            <main className="bg-background dark:bg-background-dark flex h-screen flex-col items-center gap-8 py-24 px-8">
                <h1 className="text-2xl sm:text-4xl font-semibold">Download A Stint</h1>

                <p className="w-full flex sm:w-[400px] text-center text-gray-400">Choose a stint and I{"'"}ll gather all the entries for you to download as a pdf.</p>
                
                <section className="w-full h-full sm:w-[600px] lg:w-[900px] flex flex-col gap-2">
                    <StintDisplay categorizedStints={categorizedStints || { "active": [], "upcoming": [], "past": [] }} Card={StintCard} />
                </section>
            </main>

        </>
    );
}