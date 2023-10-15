"use client";

import Link from "next/link";

import { motion } from "framer-motion";

export default function CreateSpanButton() {
    return (
        <Link href={"/create"} className="">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="border border-black shadow-md rounded-md px-6 py-3">
                Create Stint
            </motion.button>
        </Link>
    );
}