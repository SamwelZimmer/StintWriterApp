import { atom } from "recoil";

export const userIdAtom = atom<string | null>({
    key: "userIdAtom",
    default: null,
});