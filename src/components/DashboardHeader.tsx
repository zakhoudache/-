import React, { useState } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Search } from "lucide-react";

interface DashboardHeaderProps {
  onSearch?: (query: string) => void;
  onImportanceFilter?: (importance: string) => void;
}

const DashboardHeader = ({
  onSearch = () => {},
  onImportanceFilter = () => {},
}: DashboardHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex-1 max-w-2xl flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            className="w-full pl-10 pr-4"
            placeholder="Search historical entries..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select
          defaultValue="all"
          onValueChange={(value) => onImportanceFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by importance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Importance</SelectItem>
            <SelectItem value="high">High Importance</SelectItem>
            <SelectItem value="medium">Medium Importance</SelectItem>
            <SelectItem value="low">Low Importance</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
};

export default DashboardHeader;
