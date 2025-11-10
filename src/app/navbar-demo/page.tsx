"use client";

import { useState } from "react";
import { NavBarDemo } from "@/components/ui/tubelight-navbar-demo";
import { ProdiPlanNavBar } from "@/components/ui/prodiplan-navbar";
import { useAuth } from "@/components/providers/auth-provider";

export default function NavbarDemoPage() {
  const { user } = useAuth();
  const [showProdiPlan, setShowProdiPlan] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Toggle Button */}
      <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4">
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => setShowProdiPlan(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showProdiPlan
                ? "bg-primary-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            ProdiPlan Navbar
          </button>
          <button
            onClick={() => setShowProdiPlan(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !showProdiPlan
                ? "bg-primary-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Original Tubelight Navbar
          </button>
        </div>
      </div>

      {/* Navbar */}
      {showProdiPlan ? (
        <ProdiPlanNavBar user={user} />
      ) : (
        <div className="pt-6">
          <NavBarDemo />
        </div>
      )}

      {/* Main Content */}
      <main className={`${showProdiPlan ? "pt-20" : "pt-24"} px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-4xl mx-auto py-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">
              Navbar Component Demo
            </h1>
            <p className="text-lg text-neutral-600 mb-6">
              This page showcases the tubelight-navbar component integrated into the ProdiPlan website.
            </p>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                  ProdiPlan Navbar (Customized)
                </h2>
                <p className="text-neutral-600">
                  A customized version of the tubelight-navbar that matches the ProdiPlan website theme and navigation structure. 
                  It includes the logo, navigation items that change based on user authentication and current page, 
                  and user menu with logout functionality.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                  Original Tubelight Navbar
                </h2>
                <p className="text-neutral-600">
                  The original tubelight-navbar component with the tubelight effect. 
                  It features a smooth animated light effect that follows the active tab.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                  Features
                </h2>
                <ul className="list-disc list-inside text-neutral-600 space-y-1">
                  <li>Smooth tubelight animation effect</li>
                  <li>Responsive design with mobile icons</li>
                  <li>Active tab highlighting</li>
                  <li>Integration with ProdiPlan authentication system</li>
                  <li>Dynamic navigation items based on page context</li>
                  <li>Matches website theme and color scheme</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}