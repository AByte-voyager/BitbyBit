import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, UrgencyBadge } from "../Components/reports/StatusBadge";
import { ArrowLeft, MapPin, Calendar, User, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { getReport, updateReport } from "@/api/reportApi";

export default function ReportDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const urlParams = new URLSearchParams(window.location.search);
  const reportId = urlParams.get('id');

  const [inspectorNotes, setInspectorNotes] = useState("");
  const [status, setStatus] = useState("");

  const { data: report, isLoading, isError } = useQuery({
    queryKey: ['report', reportId],
    queryFn: () => getReport(reportId),
    enabled: !!reportId,
  });

  useEffect(() => {
    if (report) {
      setInspectorNotes(report.inspector_notes || "");
      setStatus(report.status);
    }
  }, [report]);

  const updateMutation = useMutation({
    mutationFn: (payload) => updateReport(reportId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report', reportId] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-[400px] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Report not found</h2>
          <Button onClick={() => navigate(createPageUrl("Dashboard"))}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const {
    issue_category,
    station_name,
    station_city,
    description,
    photo_url,
    created_date,
    created_by,
    reporter_contact,
    latitude,
    longitude,
    urgency_level,
  } = report;

  const googleMapUrl = latitude && longitude
    ? `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${latitude},${longitude}&zoom=16`
    : null;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Dashboard"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Report Details */}
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
              <CardTitle>Report Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-xl mb-2">{issue_category}</h3>
                <div className="flex items-center gap-2 text-slate-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{station_name}, {station_city}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <StatusBadge status={status} />
                <UrgencyBadge urgency={urgency_level} />
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h4 className="font-medium text-slate-900 mb-2">Description</h4>
                <p className="text-slate-700 leading-relaxed">{description}</p>
              </div>

              {photo_url && (
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Attached Photo
                  </h4>
                  <a
                    href={photo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow"
                  >
                    <img src={photo_url} alt="Issue" className="w-full h-auto" />
                  </a>
                </div>
              )}

              {googleMapUrl && (
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location Preview
                  </h4>
                  <div className="w-full h-64 rounded-lg overflow-hidden border border-slate-200">
                    <iframe
                      title="report-location"
                      width="100%"
                      height="100%"
                      loading="lazy"
                      allowFullScreen
                      src={googleMapUrl}
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Reported: {format(new Date(created_date), "MMMM d, yyyy 'at' h:mm a")}</span>
                </div>
                {created_by && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>By: {created_by}</span>
                  </div>
                )}
                {reporter_contact && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Contact: {reporter_contact}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Inspector Actions */}
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-slate-800 text-white">
              <CardTitle>Inspector Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label htmlFor="status">Update Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Inspector Notes</Label>
                <Textarea
                  id="notes"
                  value={inspectorNotes}
                  onChange={(e) => setInspectorNotes(e.target.value)}
                  placeholder="Add notes about actions taken, timeline, or additional context..."
                  rows={8}
                  className="resize-none"
                />
              </div>

              <Button
                onClick={() => updateMutation.mutate({ status, inspector_notes: inspectorNotes })}
                disabled={updateMutation.isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {updateMutation.isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>

              {updateMutation.isSuccess && (
                <div className="text-center text-sm text-green-600 font-medium">
                  Changes saved successfully!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
