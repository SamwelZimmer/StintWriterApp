"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { motion } from "framer-motion";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { RiFileDownloadLine } from "react-icons/ri";
import ReactMarkdown from 'react-markdown';

import { BsDot } from "react-icons/bs";
import html2pdf from "html2pdf.js";

import AuthChecker from "../../../../components/AuthChecker";
import Navbar from "../../../../components/Navbar";
import { getStint } from "../../../../lib/firebase";
import { Stint } from "../../../../lib/types";
import { userIdAtom } from "../../../../atoms/userIdAtom";
import { userStintsAtom } from "../../../../atoms/userStintsAtom";
import { formatDateFromTimestamp, categorizeStints } from "../../../../lib/helpers";
import { useFetchUserDataFromLocalStorage } from "../../../../hooks/useFetchUserDataFromLocalStorage";
import { useFetchUserStintsFromLocalStorage } from "../../../../hooks/useFetchUserStintsFromLocalStorage";
import { DefaultSpinner } from "../../../../components/Loaders";

type ContextType = {
    params: {
        stint: string;
    };
    searchParams: {
        query?: string;
    };
};

export default function DownloadStintPage(context: ContextType) {
    const [stints, __] = useRecoilState(userStintsAtom);
    useFetchUserStintsFromLocalStorage();

    const stintId = context.params.stint;

    const stint = stints?.find(stint => stint.id === stintId);

    let data;
    let heading;

    if (stint) {
        heading = (
            <div className="w-full flex flex-col gap-8 pb-8">
                <h1 className="text-5xl font-semibold">{stint.title}</h1>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex gap-1"><span className="opacity-50">Start: </span>{formatDateFromTimestamp(stint.startDate)}</div>
                    <ReactMarkdown className="hidden sm:block">
                        -&gt;
                    </ReactMarkdown>
                    <div className="flex gap-1"><span className="opacity-50">End: </span>{formatDateFromTimestamp(stint.endDate)}</div>
                </div>
            </div>
        );

        data = (
            <div className="w-full flex flex-col gap-4 h-full">
                { stint.entries.map((item, i) => {
                    if (item.length <= 0) return 

                    return (
                        <div key={i} className="flex flex-col w-full">
                            { i !== 0 && <hr className="w-32 mx-auto pb-8" /> }
                            <div className="flex opacity-50">Day {i + 1}</div>
                            <ReactMarkdown className="markdown">{item}</ReactMarkdown>
                        </div>
                )})}
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <AuthChecker />

            <main className="bg-background dark:bg-background-dark flex flex-col h-screen items-center py-24 sm:pb-24 px-8 gap-8">
                {
                    data && heading
                    ?
                    <HtmlToPdfConverter data={data} heading={heading} />
                    :
                    <DefaultSpinner />
                }
            </main>
        </>
    );
};

interface HtmlToPdfConverter {
    data: React.ReactNode;
    heading: React.ReactNode;
};

const HtmlToPdfConverter = ({ data, heading }: HtmlToPdfConverter) => {
  const downloadPdf = () => {
    const element = document.getElementById('contentToConvert');

    const opt = {
      margin:       20,
      filename:     'myfile.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="flex flex-col w-full gap-12 sm:w-[500px] lg:w-[700px] h-full overflow-hidden">
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadPdf}
            className="rounded-md border px-6 py-3 flex gap-4 items-center w-max mx-auto font-medium shadow-md bg-accent text-text hover:bg-secondary/70 hover:text-background dark:border-gray-600 dark:text-text-dark"
        >
            <span>PDF</span>
            <RiFileDownloadLine size={20} />
        </motion.button>

      <div id="contentToConvert" className="pb-4 flex flex-col h-full gap-4 bg-white text-black dark:p-4 rounded-md">
        {heading}

        <div className="overflow-scroll h-full pb-12">
            {data}
        </div>
      </div>
    </div>
  );
};
