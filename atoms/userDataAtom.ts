import { atom } from "recoil";
import { UserInfo } from "../lib/types";

export const userDataAtom = atom<UserInfo | null>({
    key: "userDataAtom",
    default: null,
});