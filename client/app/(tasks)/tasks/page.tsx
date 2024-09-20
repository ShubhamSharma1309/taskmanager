"use client"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState } from "react";

const TasksPage = () => {
  const [activeTab, setActiveTab] = useState("Tasks");
  return (
    <div className='w-full flex pt-32 flex-col items-center justify-center min-h-screen bg-white dark:bg-stone-900'>
      <div className="bg-background/40 backdrop-blur-md rounded-lg shadow-lg shadow-neutral-800/5 border border-primary/10 pt-2 px-2 absolute  left-0 top-[14vh]  m-2 sm:m-3 sm:left-[8vh] md:m-4">
        <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4">
          {/* <Tabs
            defaultValue="description"
            className="rounded-md"
          >
            <TabsList className="grid grid-cols-2 w-36 sm:w-40 md:w-48 gap-2 sm:gap-3">
              <TabsTrigger value="description" className="text-xs sm:text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Dashboard</TabsTrigger>
              <TabsTrigger value="submissions" className="text-xs sm:text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Tasks</TabsTrigger>
            </TabsList>
          </Tabs> */}
          <Tabs
            defaultValue="Tasks"
            className="rounded-md"
            value={activeTab}
            onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-48 gap-2">
              <TabsTrigger
                value="Tasks"
                className={cn(
                  "transition-colors duration-200",
                  activeTab === "Dashboard" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                Tasks
              </TabsTrigger>
              <TabsTrigger
                value="Dashboard"
                className={cn(
                  "transition-colors duration-200",
                  activeTab === "Tasks" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                Dashboard
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {activeTab === "Dashboard" && (
          <div>This is dashboard</div>
        )}
        {activeTab === "Tasks" && (
          <div>This is Tasks</div>
        )}
      </div>

    </div >
  );
}

export default TasksPage;