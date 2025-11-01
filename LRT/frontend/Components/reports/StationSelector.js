import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const STATIONS = {
  Edmonton: [
    "Clareview",
    "Belvedere",
    "Coliseum",
    "Stadium",
    "Churchill",
    "Central",
    "Bay/Enterprise Square",
    "Corona",
    "Grandin/Government Centre",
    "University",
    "Health Sciences",
    "McKernan/Belgravia",
    "South Campus/Fort Edmonton Park",
    "Southgate",
    "Century Park",
    "Mill Woods"
  ],
  Calgary: [
    "Tuscany",
    "Crowfoot",
    "Dalhousie",
    "Brentwood",
    "University",
    "Banff Trail",
    "Lions Park",
    "SAIT/ACAD/Jubilee",
    "Sunnyside",
    "Centre Street",
    "City Hall",
    "Victoria Park/Stampede",
    "Erlton/Stampede",
    "39 Avenue",
    "Chinook",
    "Heritage",
    "Southland",
    "Anderson",
    "Canyon Meadows",
    "Fish Creek-Lacombe",
    "Somerset-Bridlewood"
  ]
};

export default function StationSelector({ city, station, onCityChange, onStationChange }) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="city">City</Label>
        <Select value={city} onValueChange={onCityChange}>
          <SelectTrigger id="city">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Edmonton">Edmonton</SelectItem>
            <SelectItem value="Calgary">Calgary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {city && (
        <div>
          <Label htmlFor="station">Station</Label>
          <Select value={station} onValueChange={onStationChange}>
            <SelectTrigger id="station">
              <SelectValue placeholder="Select station" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {STATIONS[city].map((stationName) => (
                <SelectItem key={stationName} value={stationName}>
                  {stationName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}