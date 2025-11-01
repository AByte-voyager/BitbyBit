import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge, UrgencyBadge } from "./StatusBadge";
import { MapPin, Calendar, User, Image } from "lucide-react";
import { format } from "date-fns";

export default function ReportCard({ report, onClick }) {
  if (!report) return null; // safety check

  const {
    station_name = "Unknown Station",
    station_city = "",
    issue_category = "Issue",
    description = "",
    photo_url,
    status = "Submitted",
    urgency_level = "Medium",
    created_date,
    created_by
  } = report;

  return (
    <Card
      className="hover:shadow-lg transition-all cursor-pointer border-slate-200"
      onClick={() => onClick(report)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">{station_name}, {station_city}</span>
            </div>
            <h3 className="font-semibold text-slate-900 text-lg">{issue_category}</h3>
          </div>

          {photo_url && (
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                <img
                  src={photo_url}
                  alt="Issue"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-slate-600 text-sm line-clamp-2">{description}</p>

        <div className="flex flex-wrap gap-2">
          <StatusBadge status={status} />
          <UrgencyBadge urgency={urgency_level} />
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
          {created_date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(created_date), "MMM d, yyyy")}
            </div>
          )}
          {created_by && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {created_by.includes("@") ? created_by.split("@")[0] : created_by}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
