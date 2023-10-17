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
                <span className="text-xl">Hey {userData?.name}</span>
                <span className="text-xl">Ready to write?</span>
            </div>

        </>
    );
}