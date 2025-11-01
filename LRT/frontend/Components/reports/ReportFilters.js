import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { fetchFilterOptions } from "@/api/reportApi"; // New API to fetch dynamic options

export default function ReportFilters({ filters, onFilterChange }) {
  const [cities, setCities] = useState(["Edmonton", "Calgary"]);
  const [statuses, setStatuses] = useState(["Submitted", "Under Review", "In Progress", "Resolved", "Closed"]);
  const [urgencies, setUrgencies] = useState(["Critical", "High", "Medium", "Low"]);

  // Optional: fetch dynamic filter options from backend
  useEffect(() => {
    async function loadFilters() {
      try {
        const data = await fetchFilterOptions(); // e.g., { cities, statuses, urgencies }
        if (data.cities) setCities(data.cities);
        if (data.statuses) setStatuses(data.statuses);
        if (data.urgencies) setUrgencies(data.urgencies);
      } catch (err) {
        console.error("Failed to fetch filter options", err);
      }
    }
    loadFilters();
  }, []);

  return (
    <div className="flex flex-wrap gap-3">
      {/* Search Input */}
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search stations or descriptions..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>
      </div>

      {/* Status Filter */}
      <Select
        value={filters.status || "all"}
        onValueChange={(value) => onFilterChange({ ...filters, status: value === "all" ? null : value })}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>{status}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Urgency Filter */}
      <Select
        value={filters.urgency || "all"}
        onValueChange={(value) => onFilterChange({ ...filters, urgency: value === "all" ? null : value })}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Urgency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Urgency</SelectItem>
          {urgencies.map((urgency) => (
            <SelectItem key={urgency} value={urgency}>{urgency}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* City Filter */}
      <Select
        value={filters.city || "all"}
        onValueChange={(value) => onFilterChange({ ...filters, city: value === "all" ? null : value })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cities</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>{city}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
