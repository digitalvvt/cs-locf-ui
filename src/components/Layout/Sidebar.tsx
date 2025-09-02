import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, BookOpen, FileText, BarChart3, Users, Brain, TrendingUp, Workflow } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Assessments", href: "/assessments", icon: FileText },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "AI Intelligence", href: "/ai-intelligence", icon: Brain },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Workflows", href: "/workflows", icon: Workflow },
  { name: "Super Admin", href: "/super-admin", icon: Users },
];

export const Sidebar = () => {
  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">EduPlatform</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
