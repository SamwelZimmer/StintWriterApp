"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import CreateStintButton from "./CreateStintButton";
import { Stint } from "../lib/types";
import { getFromLocalStorage } from "../lib/helpers";

export default function UserStints() {

    const [stints, setStints] = useState<Stint[]>([]);

    useEffect(() => {
        let fromStore = getFromLocalStorage("userStints");
        if (fromStore) {
            setStints(JSON.parse(fromStore));
        }
    }, []);

    console.log(stints)

    return (
        <>
            {
                stints?.length == 0 ? 
                
                <div className="w-full flex">
                    <div className="mx-auto flex flex-col items-center gap-8 text-center">
                        <div>You don{"'"}t have any Stints yet. Why not create one??</div>
                        <CreateStintButton />
                    </div>
                </div>
                :
                <div>
                    {
                        stints.map((item, i) => {
                        return (
                            <div key={i}>
                            {item.title}
                            </div>
                        );
                        })
                    }
                    <CreateStintButton />
                </div>
            }
        </>
    );
}