import { atom } from "recoil";
import { Stint } from "../lib/types";

export const userStintsAtom = atom<Stint[] | null>({
    key: "userStintsAtom",
    default: null,
});