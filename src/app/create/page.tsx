import Form from "./Form";
import Navbar from "../../../components/Navbar";
import AuthChecker from "../../../components/AuthChecker";

export default function CreateStintPage() {
    return (
        <>
            <AuthChecker />
            
            <Navbar showBackButton />
            
            <main className="flex h-screen flex-col items-center justify-center gap-8 py-24 px-8">
                <h1 className="text-2xl sm:text-4xl font-semibold">Create Your Writing Stint</h1>
                
                <section className="w-max flex sm:w-[500px]">
                    <Form />
                </section>
            </main>
        </>
    );
};