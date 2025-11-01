import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, Wrench, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  "Submitted": { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock },
  "Under Review": { color: "bg-purple-100 text-purple-800 border-purple-200", icon: Eye },
  "In Progress": { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Wrench },
  "Resolved": { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
  "Closed": { color: "bg-slate-100 text-slate-800 border-slate-200", icon: XCircle }
};

const URGENCY_CONFIG = {
  "Low": "bg-slate-100 text-slate-700 border-slate-200",
  "Medium": "bg-blue-100 text-blue-700 border-blue-200",
  "High": "bg-orange-100 text-orange-700 border-orange-200",
  "Critical": "bg-red-100 text-red-700 border-red-200"
};

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { ...STATUS_CONFIG["Submitted"], icon: Clock };
  const Icon = config.icon;

  return (
    <Badge 
      className={cn("border", config.color)} 
      title={status || "Submitted"}
    >
      <Icon className="w-3 h-3 mr-1" />
      {status || "Submitted"}
    </Badge>
  );
}

export function UrgencyBadge({ urgency }) {
  const colorClass = URGENCY_CONFIG[urgency] || URGENCY_CONFIG["Medium"];

  return (
    <Badge 
      className={cn("border", colorClass)} 
      title={urgency || "Medium"}
    >
      {urgency || "Medium"}
    </Badge>
  );
}
