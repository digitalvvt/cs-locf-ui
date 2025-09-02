
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, BarChart3, Users, Brain, FileText, Award, ArrowRight, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">OBE Platform</span>
            </div>
            <div className="flex gap-4">
              <Link to="/demo-setup">
                <Button variant="outline" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Demo Setup
                </Button>
              </Link>
              <Link to="/auth">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Outcome-Based Education
          <span className="text-blue-600 block">Made Simple</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Streamline your institution's OBE implementation with AI-powered syllabus processing, 
          automated CO-PO mapping, comprehensive analytics, and accreditation-ready reports.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/auth">
            <Button size="lg" className="flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/demo-setup">
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Try Demo Data
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Complete OBE Solution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Brain className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>AI-Powered Processing</CardTitle>
              <CardDescription>
                Upload syllabus documents and let AI extract course outcomes, 
                learning objectives, and generate CO-PO mappings automatically.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Question Generation</CardTitle>
              <CardDescription>
                Generate assessment questions from syllabus content with proper 
                CO mapping, Bloom's taxonomy, and difficulty levels.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Track CO and PO attainment with real-time analytics, 
                trend analysis, and comprehensive performance insights.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>Multi-Role Management</CardTitle>
              <CardDescription>
                Support for faculty, HODs, IQAC coordinators, and administrators 
                with role-based access and workflow management.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle>Accreditation Reports</CardTitle>
              <CardDescription>
                Generate NBA, NAAC, and other accreditation reports automatically 
                with proper formatting and compliance standards.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Database className="h-12 w-12 text-indigo-600 mb-4" />
              <CardTitle>Demo Environment</CardTitle>
              <CardDescription>
                Explore all features with comprehensive demo data including 
                sample institutions, courses, assessments, and analytics.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Demo Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Experience the Full Platform
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Try our comprehensive demo environment with Sunrise Engineering College data. 
            Explore all features including user management, course creation, assessment tracking, 
            and detailed analytics with realistic data.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto mb-8">
            <h3 className="font-semibold text-blue-900 mb-4">Demo Includes:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
              <div>✓ 3 Engineering Programs</div>
              <div>✓ 5 Sample Courses</div>
              <div>✓ 200+ Question Bank</div>
              <div>✓ Student Assessment Data</div>
              <div>✓ CO-PO Mappings</div>
              <div>✓ Analytics & Reports</div>
            </div>
          </div>
          <Link to="/demo-setup">
            <Button size="lg" className="flex items-center gap-2 mx-auto">
              <Database className="h-5 w-5" />
              Generate Demo Data
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Ready to Transform Your OBE Implementation?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join institutions worldwide in streamlining their outcome-based education processes.
        </p>
        <Link to="/auth">
          <Button size="lg" className="flex items-center gap-2 mx-auto">
            Get Started Now
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-6 w-6" />
            <span className="text-xl font-bold">OBE Platform</span>
          </div>
          <p className="text-gray-400">
            Empowering educational institutions with intelligent OBE solutions
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
