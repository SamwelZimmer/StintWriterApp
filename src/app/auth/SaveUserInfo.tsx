"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";

import { addToLocalStorage, getFromLocalStorage, updateLocalStorage } from "../../../lib/helpers";
import { userIdAtom } from "../../../atoms/userIdAtom";

interface SaveUserInfoProps {
    data: any;
};

export const SaveUserInfo = ({ data }: SaveUserInfoProps) => {
    const router = useRouter();

    if (data) {
        if (getFromLocalStorage("userData")) {
            updateLocalStorage("userData", JSON.stringify(data["userData"]))
        } else {
            addToLocalStorage("userData", JSON.stringify(data["userData"]));
        }

        if (getFromLocalStorage("userStints")) {
            updateLocalStorage("userStints", JSON.stringify(data["userStints"]));
        } else {
            addToLocalStorage("userStints", JSON.stringify(data["userStints"]));
        }

        router.push("/")
    } else {
        console.log("no data");
        router.push("http://localhost:3000/")
    }

    return (
        <>  
            {
                <main className="w-screen h-screen flex flex-col items-center justify-center">
                    <span>Just checking you out {";)"}</span>
                </main>
            }

        </>
    )
};