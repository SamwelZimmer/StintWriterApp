"use client";

import { useRecoilState } from "recoil";

import { userDataAtom } from "../atoms/userDataAtom";
import { useFetchUserDataFromLocalStorage } from "../hooks/useFetchUserDataFromLocalStorage";

export default function GreetingBox() {
    const [userData, _] = useRecoilState(userDataAtom);
    useFetchUserDataFromLocalStorage();  

    return (
        <section className="h-full w-full bg-red-200 p-4">
            <div className="flex flex-col gap-4 p-4 bg-green-200 w-max rounded-md">
                <span className="text-xl">Hey {userData?.name}</span>
                <span className="text-xl">Ready to write?</span>
            </div>

        </section>
    );
}