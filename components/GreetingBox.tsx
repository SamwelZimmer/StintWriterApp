"use client";

import { useRecoilState } from "recoil";

import { userDataAtom } from "../atoms/userDataAtom";
import { useFetchUserDataFromLocalStorage } from "../hooks/useFetchUserDataFromLocalStorage";

export default function GreetingBox() {
    const [userData, _] = useRecoilState(userDataAtom);
    useFetchUserDataFromLocalStorage();  

    return (
        <>
            <div className="flex flex-col gap-4 w-full">
                <span className="text-3xl font-medium text-text">Hey {userData?.name.split(" ")[0]}</span>
                <span className="text-xl  text-text/50">Ready to write?</span>
            </div>

        </>
    );
}