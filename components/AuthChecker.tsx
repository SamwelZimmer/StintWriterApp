"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getFromLocalStorage } from "../lib/helpers";

export default function AuthChecker() {

    const router = useRouter();

    useEffect(() => {
        let fromStore = getFromLocalStorage("userData");

        if (!fromStore) {
            router.push("/auth");
        } else {
            let parsedData = JSON.parse(fromStore);

            if (!parsedData.uid) {
                router.push("/auth");
            };
        };

    }, []);

    return <></>;
};