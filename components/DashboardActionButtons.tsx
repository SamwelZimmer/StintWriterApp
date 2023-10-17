"use client";

import Link from "next/link";

import { motion } from "framer-motion";

export const ViewStintsButton = () => {
    return (
        <Link href={"/stints"}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-md border px-6 py-3 shadow-md font-medium bg-background border-black text-text hover:bg-primary/70 hover:text-background"
            >
                My Stints
            </motion.button>
        </Link>
    );
};

export const NewStintButton = () => {
    return (
        <Link href={"/create"}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-md border px-6 py-3 font-medium shadow-md bg-accent text-text hover:bg-secondary/70 hover:text-background"
            >
                New Stint
            </motion.button>
        </Link>
    );
};