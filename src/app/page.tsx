import Link from "next/link";

import UserStints from "../../components/UserStints";
import Navbar from "../../components/Navbar";
import AuthChecker from "../../components/AuthChecker";
import ActiveStints from "../../components/ActiveStints";
import GreetingBox from "../../components/GreetingBox";
import { NewStintButton, ViewStintsButton } from "../../components/DashboardActionButtons";

export default async function Home() {

  return (
    <>
      <AuthChecker />

      <Navbar showBackButton={false} />

      <main className="flex min-h-screen flex-col items-center py-24">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-8 sm:px-0 w-full sm:w-[500px] lg:w-[900px] bg-slate-200 h-full" >
          
          <div>
            <ActiveStints />
          </div>

          {/* <UserStints />

          <div className="col-start-1">
            <GreetingBox />
          </div>

          <div className="col-start-1 lg:col-start-2 flex flex-row gap-4">
            <ViewStintsButton />
            <NewStintButton />
          </div> */}



        </div>


      </main>
    </>

  );
};
