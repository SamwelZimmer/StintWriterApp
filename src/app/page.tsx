import Link from "next/link";

import UserStints from "../../components/UserStints";
import Navbar from "../../components/Navbar";
import AuthChecker from "../../components/AuthChecker";
import GreetingBox from "../../components/GreetingBox";

export default async function Home() {

  return (
    <>
      <AuthChecker />

      <Navbar showBackButton={false} />

      <main className="flex min-h-screen flex-col items-center py-24">
        {/* <span className="w-full px-8 text-2xl sm:text-center">Hey {userData?.name}, <br/>what{"'"}re we writing today?</span> */}
          yo
        <section className="flex flex-col h-full bg-red-200 w-full sm:w-[500px] md:w-[600px] lg:w-[800px] my-auto px-4">
          <UserStints />
        </section>

        <GreetingBox />

        <Link href={"/stints"} className="border p-4">
          see stints
        </Link>
      </main>
    </>

  );
};
