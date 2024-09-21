import React from 'react'
import { FilterSelect, SortBySelect } from "@/components/tasks/filter/Select-Filter-sort";

const Filter = ({ state, dispatch }: { state: any, dispatch: React.Dispatch<any> }) => {
    return (
        <div className="w-full max-w-4xl mx-auto mt-10 sm:mt-4">
            <div className="flex flex-col sm:flex-row justify-center items-center mt-10 md:mt-14 mx-16 sm:mx-10 gap-4  mb-0">
                <div className="w-full lg:w-auto flex gap-2">
                    <SortBySelect sortBy={state.sortBy} setSortBy={(value) => dispatch({ type: 'SET_SORT_BY', payload: value })} />
                    <FilterSelect
                        value={state.filterPriority}
                        onChange={(value) => dispatch({ type: 'SET_FILTER_PRIORITY', payload: value })}
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
                        value={state.filterStatus}
                        onChange={(value) => dispatch({ type: 'SET_FILTER_STATUS', payload: value })}
                        options={[
                            { value: "ALL", label: "All Statuses" },
                            { value: "TODO", label: "To Do" },
                            { value: "IN_PROGRESS", label: "In Progress" },
                            { value: "COMPLETED", label: "Completed" },
                        ]}
                        placeholder="Filter by Status"
                    />
                    <FilterSelect
                        value={state.filterDueDate}
                        onChange={(value) => dispatch({ type: 'SET_FILTER_DUE_DATE', payload: value })}
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
    )
}

export default Filter
