import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SortByOption = "dueDate" | "priority" | "status";

interface SortBySelectProps {
    sortBy: string;
    setSortBy: (value: SortByOption) => void;
}

const SortBySelect = ({ sortBy, setSortBy }: SortBySelectProps) => (
    <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="status">Status</SelectItem>
        </SelectContent>
    </Select>
);

interface FilterOption {
    value: string;
    label: string;
}

interface FilterSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    placeholder: string;
}

const FilterSelect = ({ value, onChange, options, placeholder }: FilterSelectProps) => (
    <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
            {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                    {option.label}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
);

export {
    FilterSelect,
    SortBySelect
}