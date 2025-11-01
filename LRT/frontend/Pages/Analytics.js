import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FileText, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { listReports } from "@/api/reportApi"; // ✅ use your API

const COLORS = ['#f97316', '#ef4444', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

export default function Analytics() {
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: listReports,
  });

  // Calculate statistics
  const stats = {
    total: reports.length,
    byStatus: reports.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {}),
    byUrgency: reports.reduce((acc, r) => {
      acc[r.urgency_level] = (acc[r.urgency_level] || 0) + 1;
      return acc;
    }, {}),
    byCategory: reports.reduce((acc, r) => {
      acc[r.issue_category] = (acc[r.issue_category] || 0) + 1;
      return acc;
    }, {}),
    byCity: reports.reduce((acc, r) => {
      acc[r.station_city] = (acc[r.station_city] || 0) + 1;
      return acc;
    }, {}),
    byStation: reports.reduce((acc, r) => {
      const key = `${r.station_name} (${r.station_city})`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  };

  // Format data for charts
  const categoryData = Object.entries(stats.byCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const urgencyData = Object.entries(stats.byUrgency)
    .map(([name, value]) => ({ name, value }));

  const cityData = Object.entries(stats.byCity)
    .map(([name, value]) => ({ name, value }));

  const topStations = Object.entries(stats.byStation)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Analytics & Insights</h1>
          <p className="text-slate-600 mt-1">
            Track trends and patterns in accessibility reports
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Reports
                </CardTitle>
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {stats.total}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Critical Issues
                </CardTitle>
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {stats.byUrgency['Critical'] || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Resolved
                </CardTitle>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {stats.byStatus['Resolved'] || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Pending
                </CardTitle>
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {(stats.byStatus['Submitted'] || 0) + (stats.byStatus['Under Review'] || 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Issues by Category */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Issues by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f97316" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Issues by Urgency */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Issues by Urgency Level</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={urgencyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {urgencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Reports by City */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Reports by City</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top 10 Stations */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Top 10 Stations with Most Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topStations} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={150}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <Card className="border-none shadow-lg bg-gradient-to-r from-orange-500 to-red-600 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <CardTitle>Key Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-orange-50">
              <li>
                • Most common issue: <strong className="text-white">
                  {categoryData[0]?.name || 'N/A'}
                </strong> ({categoryData[0]?.value || 0} reports)
              </li>
              <li>
                • Station with most reports: <strong className="text-white">
                  {topStations[0]?.name || 'N/A'}
                </strong> ({topStations[0]?.value || 0} reports)
              </li>
              <li>
                • Resolution rate: <strong className="text-white">
                  {stats.total > 0 ? ((stats.byStatus['Resolved'] || 0) / stats.total * 100).toFixed(1) : 0}%
                </strong>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}