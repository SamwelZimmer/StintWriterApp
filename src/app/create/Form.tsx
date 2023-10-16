"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { AiOutlinePlus, AiOutlineArrowRight } from "react-icons/ai";
import { Toaster } from "react-hot-toast";

import { createStint, getUserStints } from "../../../lib/firebase";
import { userStintsAtom } from "../../../atoms/userStintsAtom";
import { userIdAtom } from "../../../atoms/userIdAtom";
import { useFetchUserStintsFromLocalStorage } from "../../../hooks/useFetchUserStintsFromLocalStorage";
import { useFetchUserDataFromLocalStorage } from "../../../hooks/useFetchUserDataFromLocalStorage";
import { stringToSlug, getFromLocalStorage, updateLocalStorage } from "../../../lib/helpers";
import { successToast, errorToast, messageToast } from "../../../lib/toasties";

const fetchAndStoreStints = async (userId: string) => {
    try {
        const stints = await getUserStints(userId);
        updateLocalStorage("userStints", JSON.stringify(stints));
    } catch (error) {
        console.error("Error fetching and storing stints:", error);
    }
};

export default function Form() {

    const [userId, _] = useRecoilState(userIdAtom);
    useFetchUserDataFromLocalStorage();    
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // TODO: checks for each parameter
        try {
            createStint(userId, stringToSlug(title), title, startDate, endDate);
            // TODO: successful toast
            
            // update the local storage with new stint
            if (userId) {
                fetchAndStoreStints(userId);
            };

            successToast("A new stint. Nice")
            
            router.push(`/stints/${stringToSlug(title)}`);
        } catch (err) {
            console.error(err);

            successToast("Sorry, something went wrong")
        }
    };

    return (
        <>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-gray-100 shadow-md h-min rounded px-8 pt-6 pb-8 w-full">

            <div className="">
                <label className="block text-gray-400 text-sm mb-2" htmlFor="username">
                    Stint Name
                </label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="e.g. Trip to Japan" />
            </div>

            <div className="flex flex-col gap-8 sm:flex-row justify-between w-full">
                <div className="flex flex-col w-full">
                    <div className="flex flex-col sm:w-min">
                        <label className="block text-gray-400 text-sm mb-2" htmlFor="startDate">Start Date:</label>
                        <input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>

                <div className="hidden sm:flex items-center justify-center pt-8">
                    <AiOutlineArrowRight size={20} />
                </div>

                <div className="flex sm:items-end sm:justify-end col-start-1 sm:col-start-3 w-full">
                    <div className="flex flex-col w-full sm:w-min">
                        <label className="block text-gray-400 text-sm mb-2 " htmlFor="endDate">End Date:</label>
                        <input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="p-2 w-full sm:self-end shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>
            </div>



            <div className="w-full col-start-1 col-span-3 flex items-center justify-center">
                <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95}} className="bg-primary hover:bg-accent shadow-md border mx-auto sm:mx-0 rounded-md px-6 py-3 w-max flex items-center gap-4 justify-between text-text hover:text-white"><AiOutlinePlus size={20} />Create </motion.button>
            </div>

        </form>   

        <Toaster /> 
        </>
    );
}