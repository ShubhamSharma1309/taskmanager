"use client"
import { FilterSelect, SortBySelect } from "@/components/Filter";
import Tasks from "@/components/tasks/Tasks";
import {
  Tabs,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { useState } from "react";


const TasksPage = () => {
  const [sortBy, setSortBy] = useState("dueDate");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterDueDate, setFilterDueDate] = useState("ALL");
  const [activeTab, setActiveTab] = useState("Tasks");
  return (
    <div className='w-full flex pt-32 flex-col items-center justify-start min-h-screen overflow-y-auto'>
      <div className="bg-background/40 backdrop-blur-md rounded-lg shadow-lg shadow-neutral-800/5 border border-primary/10 pt-2 px-2 absolute left-0 top-[14vh] m-2 sm:m-3 sm:left-[9vh] md:m-4">
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

      {activeTab === "Tasks" && (
        <>
          <div className="w-full max-w-4xl mx-auto mt-4">
            <div className="flex flex-col sm:flex-row justify-center items-center mt-10 md:mt-14 mx-16 sm:mx-12 gap-4  mb-0">
              <div className="w-full lg:w-auto flex gap-2">
                <SortBySelect sortBy={sortBy} setSortBy={setSortBy} />
                <FilterSelect
                  value={filterPriority}
                  onChange={setFilterPriority}
                  options={[
                    { value: "ALL", label: "All Priorities" },
                    { value: "LOW", label: "Low" },
                    { value: "MEDIUM", label: "Medium" },
                    { value: "HIGH", label: "High" },
                  ]}
                  placeholder="Filter by Priority"
                />
              </div>

              <div className="w-full lg:w-auto flex gap-2">
                <FilterSelect
                  value={filterStatus}
                  onChange={setFilterStatus}
                  options={[
                    { value: "ALL", label: "All Statuses" },
                    { value: "TODO", label: "To Do" },
                    { value: "IN_PROGRESS", label: "In Progress" },
                    { value: "COMPLETED", label: "Completed" },
                  ]}
                  placeholder="Filter by Status"
                />
                <FilterSelect
                  value={filterDueDate}
                  onChange={setFilterDueDate}
                  options={[
                    { value: "ALL", label: "All Due Dates" },
                    { value: "TODAY", label: "Due Today" },
                    { value: "THIS_WEEK", label: "Due This Week" },
                    { value: "THIS_MONTH", label: "Due This Month" },
                  ]}
                  placeholder="Filter by Due Date"
                />
              </div>
            </div>
          </div>
          <Tasks
            sortBy={sortBy}
            filterPriority={filterPriority}
            filterStatus={filterStatus}
            filterDueDate={filterDueDate}
          />
        </>
      )}

      {activeTab === "Dashboard" && (
        <div>This is dashboard</div>
      )}
    </div>
  );
}

export default TasksPage;