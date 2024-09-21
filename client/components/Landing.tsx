"use client"
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { BackgroundLines } from "./ui/background-lines";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

export function Landing() {
    const { theme } = useTheme();
    const router = useRouter();

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 py-20 md:py-0">
                <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
                    <h6 className={cn(
                        "text-2xl md:text-3xl gap-2 font-bold text-center",
                        theme === "dark"
                            ? "bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
                            : "text-black"
                    )}>
                        Welcome to
                    </h6>
                    <h1 className={cn(
                        "text-7xl md:text-8xl font-bold text-center",
                        theme === "dark"
                            ? "bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
                            : "text-black"
                    )}>
                        <span className="text-green-500">
                            Task
                        </span>Master
                    </h1>
                    <p className={cn(
                        "mt-4 font-normal text-base max-w-lg text-center mx-auto",
                        theme === "dark" ? "text-neutral-300" : "text-gray-600"
                    )}>
                        Effortlessly manage tasks with TaskMaster. Our interface helps you
                        organize, prioritize, and accomplish goals. Stay productive and
                        focused with our powerful task management tools.
                    </p>
                </div>

                <div className="flex space-x-4 mt-6 mb-20 md:mb-0">
                    <HoverBorderGradient
                        containerClassName="rounded-full"
                        as="button"
                        className="dark:bg-black px-4 bg-white text-black dark:text-white flex items-center space-x-2"
                        onClick={() => router.push('/tasks')}
                    >
                        <span>Manage your task now!</span>
                    </HoverBorderGradient>
                </div>
            </BackgroundLines>
        </div>
    );
}
