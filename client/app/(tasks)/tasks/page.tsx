"use client"
import Tasks from "@/components/tasks/Tasks";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

const TasksPage = () => {
  const [activeTab, setActiveTab] = useState("Tasks");
  return (
<div className='w-full flex pt-32 flex-col items-center justify-start min-h-screen overflow-y-auto'>
      <div className="bg-background/40 backdrop-blur-md rounded-lg shadow-lg shadow-neutral-800/5 border border-primary/10 pt-2 px-2 absolute  left-0 top-[14vh]  m-2 sm:m-3 sm:left-[8vh] md:m-4">
        <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4">
          <Tabs
            defaultValue="Tasks"
            className="rounded-md"
            value={activeTab}
            onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-48 gap-2">
              <TabsTrigger value="Tasks" className="text-xs sm:text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Tasks</TabsTrigger>
              <TabsTrigger value="Dashboard" className="text-xs sm:text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Dashboard</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <button className="flex items-center  justify-center py-2 px-4 md:py-4 md:px-6 mt-4  rounded-full bg-primary text-primary-foreground absolute  right-0 top-[14vh]  m-2 sm:m-3 sm:right-[8vh] md:m-4 ">
        <PlusCircle className="w-5 h-5" />
        <span className="ml-2 hidden sm:block text-sm font-medium">Add Task</span>
      </button>
      {activeTab === "Dashboard" && (
        <div>This is dashboard</div>
      )}
      {activeTab === "Tasks" && (
        <Tasks />
      )}
    </div>
  );
}

export default TasksPage;