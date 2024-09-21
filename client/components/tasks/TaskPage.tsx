"use client"
import Dashboard from "@/components/dashboard/Dashboard";
import Tasks from "@/components/tasks/Tasks";
import {
  Tabs,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { useReducer, useEffect } from "react";
import Filter from "./filter/Filter";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";

const initialState = {
  sortBy: "dueDate",
  filterPriority: "ALL",
  filterStatus: "ALL",
  filterDueDate: "ALL",
  activeTab: "Tasks"
};

const reducer = (state: typeof initialState, action: { type: string, payload: any }) => {
  switch (action.type) {
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    case 'SET_FILTER_PRIORITY':
      return { ...state, filterPriority: action.payload };
    case 'SET_FILTER_STATUS':
      return { ...state, filterStatus: action.payload };
    case 'SET_FILTER_DUE_DATE':
      return { ...state, filterDueDate: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    default:
      return state;
  }
};

const TasksPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentUser } = useSelector((state: RootState) => state.user)
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/sign-in');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null; // or a loading spinner
  }

  return (
    <div className='w-full flex pt-32 flex-col items-center justify-start min-h-screen'>
      <div className="bg-background/40 backdrop-blur-md rounded-lg shadow-lg shadow-neutral-800/5 border border-primary/10 pt-2 px-2 absolute left-0 top-[14vh] m-2 sm:m-3 sm:left-[9vh] md:m-4">
        <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4">
          <Tabs
            defaultValue="Tasks"
            className="rounded-md"
            value={state.activeTab}
            onValueChange={(value) => dispatch({ type: 'SET_ACTIVE_TAB', payload: value })}>
            <TabsList className="grid grid-cols-2 w-48 gap-2">
              <TabsTrigger value="Tasks" className="text-xs sm:text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Tasks</TabsTrigger>
              <TabsTrigger value="Dashboard" className="text-xs sm:text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Dashboard</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {state.activeTab === "Tasks" && (
        <>
          <Filter state={state} dispatch={dispatch} />
          <div className="overflow-x-auto w-full">
            <Tasks
              sortBy={state.sortBy}
              filterPriority={state.filterPriority}
              filterStatus={state.filterStatus}
              filterDueDate={state.filterDueDate}
            />
          </div>
        </>
      )}

      {state.activeTab === "Dashboard" && (
        <Dashboard />
      )}
    </div>
  );
}

export default TasksPage;