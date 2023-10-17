"use client";

import Link from "next/link";

import { motion } from "framer-motion";

export const ViewStintsButton = () => {
    return (
        <Link href={"/stints"}>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-md border px-6 py-3 shadow-md bg-secondary text-text hover:bg-primary/70 hover:text-background"
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
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-md border px-6 py-3 shadow-md bg-primary text-text hover:bg-secondary/70 hover:text-background"
            >
                New Stint
            </motion.button>
        </Link>
    );
};