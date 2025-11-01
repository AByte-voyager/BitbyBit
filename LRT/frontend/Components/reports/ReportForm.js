import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import StationSelector from "./StationSelector";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation } from "@tanstack/react-query";
import { submitReport, uploadFile } from "@/api/reportApi";

const ISSUE_CATEGORIES = [
  "Slippery Surface", "Blocked Access", "Broken Elevator", "Lighting Issue", "Vandalism", "Safety Concern", "Other"
];

const URGENCY_LEVELS = ["Low", "Medium", "High", "Critical"];

export default function ReportForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    station_city: "",
    station_name: "",
    issue_category: "",
    description: "",
    urgency_level: "Medium",
    reporter_contact: ""
  });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);

  const mutation = useMutation({
    mutationFn: async ({ reportData, photo }) => {
      let photoUrl = null;
      if (photo) {
        photoUrl = await uploadFile(photo);
      }
      return submitReport({ ...reportData, photo_url: photoUrl, status: "Submitted" });
    },
    onSuccess: () => {
      setFormData({
        station_city: "",
        station_name: "",
        issue_category: "",
        description: "",
        urgency_level: "Medium",
        reporter_contact: ""
      });
      setPhoto(null);
      if (onSuccess) onSuccess();
    },
    onError: () => {
      setError("Failed to submit report. Please try again.");
    }
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }
    setPhoto(file);
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => mutation.mutate({ reportData: { ...formData, latitude: position.coords.latitude, longitude: position.coords.longitude }, photo }),
        () => mutation.mutate({ reportData: formData, photo })
      );
    } else {
      mutation.mutate({ reportData: formData, photo });
    }
  };

  return (
    <Card className="border-none shadow-xl">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-xl">
        <CardTitle className="text-2xl">Report an Issue</CardTitle>
        <CardDescription className="text-orange-50">
          Help us improve LRT accessibility and safety
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <StationSelector
            city={formData.station_city}
            station={formData.station_name}
            onCityChange={(value) => setFormData({ ...formData, station_city: value, station_name: "" })}
            onStationChange={(value) => setFormData({ ...formData, station_name: value })}
          />

          <div>
            <Label htmlFor="category">Issue Category *</Label>
            <Select
              value={formData.issue_category}
              onValueChange={(value) => setFormData({ ...formData, issue_category: value })}
              required
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                {ISSUE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="urgency">Urgency Level</Label>
            <Select
              value={formData.urgency_level}
              onValueChange={(value) => setFormData({ ...formData, urgency_level: value })}
            >
              <SelectTrigger id="urgency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {URGENCY_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Please describe the issue in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="resize-none"
            />
          </div>

          <div>
            <Label htmlFor="photo">Photo (optional)</Label>
            <div className="mt-2">
              <label
                htmlFor="photo"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
              >
                {photo ? (
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-700">{photo.name}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {(photo.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Click to upload photo</p>
                    <p className="text-xs text-slate-400">PNG, JPG up to 10MB</p>
                  </div>
                )}
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="contact">Contact Info (optional)</Label>
            <Input
              id="contact"
              type="text"
              placeholder="Email or phone (if you want updates)"
              value={formData.reporter_contact}
              onChange={(e) => setFormData({ ...formData, reporter_contact: e.target.value })}
            />
          </div>

          <Button
            type="submit"
            disabled={mutation.isLoading || !formData.station_city || !formData.station_name || !formData.issue_category || !formData.description}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
          >
            {mutation.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting Report...
              </>
            ) : (
              "Submit Report"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
