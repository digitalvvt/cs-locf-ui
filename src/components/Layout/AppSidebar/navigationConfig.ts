import {
  Home,
  BookOpen,
  Upload,
  HelpCircle,
  ClipboardCheck,
  TrendingUp,
  Target,
  Network,
  FileText,
  BarChart3,
  Bot,
  GitBranch,
  Lightbulb,
  FileEdit,
  FileSpreadsheet,
  Users,
  Activity,
  Shield,
  Brain,
  Calculator,
  LineChart,
  Award,
  History as HistoryIcon,
} from "lucide-react";

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: any;
  show: boolean;
}

export interface NavigationGroup {
  group: string;
  items: NavigationItem[];
}

export const getNavigationItems = (
  shouldShowItem: (itemId: string) => boolean
): NavigationGroup[] => {
  return [
    {
      group: "Main",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          path: "/",
          icon: Home,
          show: shouldShowItem("dashboard"),
        },
        {
          id: "2",
          label: "Program Management",
          path: "/program-management",
          icon: BookOpen,
          show: shouldShowItem("2"),
        },
        {
          id: "3",
          label: "Question Generator",
          path: "/question-generator",
          icon: Brain,
          show: shouldShowItem("3"),
        },
        {
          id: "4",
          label: "Question Bank",
          path: "/q-bank",
          icon: Upload,
          show: shouldShowItem("4"),
        },

        {
          id: "5",
          label: "Question History",
          path: "/question-history",
          icon: HistoryIcon,
          show: shouldShowItem("5"),
        },

        {
          id: "6",
          label: "Assessment",
          path: "/assessment",
          icon: Home,
          show: shouldShowItem("6"),
        },
        {
          id: "7",
          label: "Attainment",
          path: "/attainment",
          icon: Home,
          show: shouldShowItem("7"),
        },
        {
          id: "8",
          label: "PO Attainment",
          path: "/po-attainment",
          icon: Home,
          show: shouldShowItem("8"),
        },
        {
          id: "9",
          label: "Mapping",
          path: "/mapping",
          icon: Home,
          show: shouldShowItem("9"),
        },
        {
          id: "10",
          label: "Reports",
          path: "/reports",
          icon: Home,
          show: shouldShowItem("10"),
        },
        {
          id: "11",
          label: "Exams",
          path: "/admin/exams",
          icon: Home,
          show: shouldShowItem("11"),
        },
        {
          id: "12",
          label: "Class Analysis",
          path: "/admin/class-analysis",
          icon: Home,
          show: shouldShowItem("12"),
        },
        {
          id: "13",
          label: "Grader",
          path: "/admin/grader",
          icon: Home,
          show: shouldShowItem("13"),
        },
      ],
    },
  ];
};

export const getAdminNavigationItems = (
  shouldShowItem: (itemId: string) => boolean
): NavigationGroup[] => {
  return [
    {
      group: "Administration",
      items: [
        {
          id: "assignments",
          label: "User Management",
          path: "/assignments",
          icon: Users,
          show: shouldShowItem("assignments"),
        },
        {
          id: "system-health",
          label: "System Health",
          path: "/system-health",
          icon: Activity,
          show: shouldShowItem("system-health"),
        },
      ],
    },
  ];
};

export const getStudentNavigationItems = (
  shouldShowItem: (itemId: string) => boolean
): NavigationGroup[] => {
  return [
    {
      group: "Student",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          path: "/",
          icon: Home,
          show: shouldShowItem("dashboard"),
        },
        {
          id: "exam",
          label: "Exam",
          path: "/exams",
          icon: FileEdit,
          show: shouldShowItem("exam"),
        },
      ],
    },
  ];
};

// Legacy support - keeping the old function signature for backward compatibility
export const getNavigationItems_Old = (
  userRole: string | undefined,
  userCourseAssignments: any[],
  userProgramAssignments: any[]
) => {
  const baseItems = [
    {
      group: "Main",
      items: [
        { title: "Dashboard", url: "/", icon: Home },
        { title: "Courses", url: "/courses", icon: BookOpen },
        { title: "Syllabus Upload", url: "/syllabus", icon: Upload },
        { title: "Question Bank", url: "/question-bank", icon: HelpCircle },
        { title: "Assessment", url: "/assessment", icon: ClipboardCheck },
        { title: "Attainment", url: "/attainment", icon: TrendingUp },
        { title: "PO Attainment", url: "/po-attainment", icon: Target },
        { title: "Mapping", url: "/mapping", icon: Network },
        { title: "Reports", url: "/reports", icon: FileText },
      ],
    },
    {
      group: "Analytics",
      items: [
        { title: "Analytics Hub", url: "/analytics", icon: BarChart3 },
        { title: "Predictive Analytics", url: "/predictive-analytics", icon: Brain },
        { title: "Statistical Analysis", url: "/statistical-analysis", icon: Calculator },
        { title: "Executive Dashboard", url: "/executive-analytics", icon: LineChart },
        { title: "Accreditation Dashboard", url: "/enhanced-accreditation", icon: Award },
      ],
    },
    {
      group: "Advanced",
      items: [
        { title: "AI Agents", url: "/ai-agents", icon: Bot },
        { title: "Workflows", url: "/workflows", icon: GitBranch },
        { title: "Question Generator", url: "/questions", icon: Lightbulb },
        { title: "Exam Builder", url: "/exam-builder", icon: FileEdit },
        { title: "Assessments", url: "/assessments", icon: FileSpreadsheet },
      ],
    },
  ];

  // Add admin-specific items
  if (userRole === "admin" || userRole === "super_admin" || userRole === "hod") {
    baseItems.push({
      group: "Administration",
      items: [
        { title: "User Management", url: "/assignments", icon: Users },
        { title: "System Health", url: "/system-health", icon: Activity },
      ],
    });
  }

  // Add super admin items
  if (userRole === "super_admin") {
    baseItems.push({
      group: "Super Admin",
      items: [{ title: "Super Admin", url: "/super-admin", icon: Shield }],
    });
  }

  return baseItems;
};
