import React, { useState } from "react";
import ReportForm from "../Components/reports/ReportForm";
import { CheckCircle, AlertTriangle, Shield, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { submitReport } from "@/api/reportApi"; // <-- new API

export default function Home() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-bold">LRT SafeReport</h1>
          </div>
          <p className="text-lg text-orange-50 max-w-2xl">
            Help improve accessibility and safety at Edmonton and Calgary LRT stations. 
            Report issues quickly and track their resolution.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {showSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Report submitted successfully! Inspectors will review it soon.
            </AlertDescription>
          </Alert>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <Shield className="w-8 h-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Safe & Anonymous</h3>
            <p className="text-sm text-slate-600">
              Contact info is optional. All reports are reviewed promptly.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <Users className="w-8 h-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Community Driven</h3>
            <p className="text-sm text-slate-600">
              Your reports help make LRT stations accessible for everyone.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <CheckCircle className="w-8 h-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Track Progress</h3>
            <p className="text-sm text-slate-600">
              See how your reports are being addressed by inspectors.
            </p>
          </div>
        </div>

        {/* Report Form */}
        <ReportForm onSuccess={handleSuccess} submitReport={submitReport} />

        {/* Emergency Notice */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 mb-1">Emergency Situations</h4>
              <p className="text-sm text-red-800">
                For immediate safety concerns or emergencies, please call 911. 
                This reporting system is for non-emergency accessibility and safety issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
