// Dashboard.jsx
import MetaTags from "@/components/MetaTags";
import React from "react";

const Dashboard = () => {
  return (
    <>
      <MetaTags title="Dashboard - LOCF" description="View overall program and course performance" />
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">Welcome Back, User!</h1>
          <p className="text-xl text-gray-600 mt-2">We're glad to have you here.</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
