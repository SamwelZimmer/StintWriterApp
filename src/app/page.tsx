import Link from "next/link";

import Navbar from "../../components/Navbar";
import AuthChecker from "../../components/AuthChecker";
import ActiveStints from "../../components/ActiveStints";
import GreetingBox from "../../components/GreetingBox";
import RecentEntries from "../../components/RecentEntries";
import { NewStintButton, ViewStintsButton } from "../../components/DashboardActionButtons";

export default async function Home() {

  return (
    <>
      <AuthChecker />

      <Navbar showBackButton={false} />

      <main className="flex min-h-screen flex-col items-center py-24">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-8 sm:px-0 w-full sm:w-[500px] lg:w-[900px] h-full" >
          
          <div className="col-start-1 row-start-1">
            <ActiveStints />
          </div>

          <div className="row-start-2 col-start-1 self-center">
            <GreetingBox />
          </div>

          <div className="row-start-3 lg:row-start-2 col-start-1 lg:col-start-2 h-full flex flex-col gap-2">
            <span className="font-semibold text-gray-400">Quick Actions...</span>
            <div className="flex flex-row justify-between sm:justify-around items-center border p-4 bg-background shadow-md rounded-md">
              <ViewStintsButton />
              <NewStintButton />
            </div>
          </div>

          <div className="row-start-4 lg:row-start-1 col-start-1 lg:col-start-2 h-full flex flex-col gap-2">
            <span className="font-semibold text-gray-400">Recently Written...</span>

            <div className="flex flex-col gap-4 h-full">

              <RecentEntries />

            </div>

          </div>



        </div>


      </main>
    </>

  );
};
