
import React from 'react';
import { DemoDataGenerator } from '@/components/Demo/DemoDataGenerator';

const DemoSetup = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            OBE Platform Demo Setup
          </h1>
          <p className="text-lg text-gray-600">
            Generate comprehensive demo data to experience all platform features
          </p>
        </div>
        
        <DemoDataGenerator />
      </div>
    </div>
  );
};

export default DemoSetup;
