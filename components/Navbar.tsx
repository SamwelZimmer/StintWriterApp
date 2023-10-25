"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RiMenu4Line, RiMenu5Line, RiDashboardLine, RiAddLine, RiCalendar2Line, RiSunFill, RiMoonFill, RiDoorOpenLine, RiFileDownloadLine } from "react-icons/ri";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Link from "next/link";
import { Toaster } from 'react-hot-toast';

import { signOutUser } from "../lib/firebase";
import { successToast, errorToast } from "../lib/toasties";
import { removeFromLocalStorage, getFromLocalStorage } from "../lib/helpers";

export default function Navbar({ showBackButton=true }) {

    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();

    const handleLogout = () => {
        try {
            signOutUser();

            if (getFromLocalStorage("userData")) {
                removeFromLocalStorage("userData");
            };

            if (getFromLocalStorage("userStints")) {
                removeFromLocalStorage("userStints");
            };
            
            router.push("/auth");
            successToast("see ya later x");
        } catch (err) {
            console.log(err);
            errorToast("somin' went wrong");
        }
    }

    return (
        <>
            <motion.div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)} transition={{ layout: { duration: 0.2 } }} layout className={`fixed z-40 top-0 left-0 p-8 flex flex-col justify-between h-screen ${isOpen && 'border-r-2 bg-background shadow-xl'}`}>
                <div className="flex gap-8 flex-col h-screen">
                    <motion.div onClick={() => {if (isOpen === true) {setIsOpen(false)}}} layout="position" className="cursor-pointer rounded-lg w-max">
                        { isOpen ? <RiMenu4Line size={30} /> : <RiMenu5Line size={30} /> }
                    </motion.div>

                    {isOpen && (
                        <>
                            <motion.div className="flex flex-col w-full items-center gap-4 h-full">
                                { navItems.map((item, index) => <NavItem key={index} {...item} />) }
                            </motion.div>

                            <div className="flex flex-col gap-4">
                                <motion.button className="flex flex-row w-full items-center gap-3 hover:opacity-50 text-secondary">
                                    <RiSunFill size={30} /><p className="text-gray-500">Theme</p>
                                </motion.button>  

                                <motion.button onClick={handleLogout} className="flex flex-row w-full items-center gap-3 hover:opacity-50 text-secondary">
                                    <RiDoorOpenLine size={30} /><p className="text-gray-500">Logout</p>
                                </motion.button>  
                            </div>
                        </>   
                    )}

                </div>

                <div  className="flex gap-8 flex-col">               

                    { showBackButton && 
                        <motion.div onClick={() => router.back()} className="flex flex-row rounded-lg items-center pt-8 gap-4 cursor-pointer hover:opacity-50">
                            { isOpen && <p className="text-gray-500">Go Back</p> }
                            <motion.div layout="position"><AiOutlineArrowLeft size={30} /></motion.div> 
                        </motion.div>
                    }
                </div>
                
            </motion.div>

            <Toaster />
        </>
    );
};

const navItems = [
    {route: "/", Icon: RiDashboardLine, text: "Dashboard" },
    {route: "/stints", Icon: RiCalendar2Line, text: "My Stints" },
    {route: "/create", Icon: RiAddLine, text: "New Stint" },
    {route: "/downloader", Icon: RiFileDownloadLine, text: "Download" },
];

interface NavItemProps {
    route: string;
    Icon: React.ComponentType<any>;
    size?: number; 
    text: string;
};

const NavItem = ({ route, Icon, text, size=30 }: NavItemProps ) => {

    return (
        <Link href={route} className="flex flex-row w-full items-center gap-4 hover:opacity-50 text-secondary">
            <Icon size={size} />
            <p className="text-gray-500">{text}</p>
        </Link>
    );
};
