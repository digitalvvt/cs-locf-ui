import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Upload,
  Users,
  BarChart3,
  FileText,
  Brain,
  Target,
  TrendingUp,
  Settings,
  ClipboardList,
  LogOut,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./auth/AuthProvider";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  organizationName?: string;
  userRole?: string;
}

export const Navigation = ({
  activeTab,
  setActiveTab,
  organizationName,
  userRole,
}: NavigationProps) => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of the system.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out.",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "syllabus", label: "Syllabus", icon: Upload },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "mapping", label: "CO-PO Mapping", icon: Target },
    { id: "questions", label: "Questions", icon: Brain },
    { id: "assessment", label: "Assessment", icon: FileText },
    { id: "attainment", label: "CO Attainment", icon: BarChart3 },
    { id: "po-attainment", label: "PO Attainment", icon: TrendingUp },
    { id: "reports", label: "Reports", icon: ClipboardList, badge: "New" },
  ];

  // Add Super Admin tab for super admin users
  if (userRole === "super_admin") {
    navItems.push({ id: "superadmin", label: "Super Admin", icon: Settings });
  }

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      super_admin: "bg-red-100 text-red-800",
      admin: "bg-blue-100 text-blue-800",
      faculty: "bg-green-100 text-green-800",
      iqac: "bg-purple-100 text-purple-800",
      hod: "bg-orange-100 text-orange-800",
      coordinator: "bg-yellow-100 text-yellow-800",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">
                OBE Tool
                {organizationName && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    - {organizationName}
                  </span>
                )}
              </h1>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="relative">
                    <Button
                      variant={activeTab === item.id ? "default" : "ghost"}
                      onClick={() => setActiveTab(item.id)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-green-100 text-green-800"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{user?.email}</span>
              {userRole && (
                <Badge className={getRoleBadgeColor(userRole)}>{userRole.replace("_", " ")}</Badge>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
