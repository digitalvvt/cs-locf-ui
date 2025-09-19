import React from "react";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { NavigationGroups } from "./NavigationGroups";
import { BookOpen, Home, Upload, Brain, History, ScrollText } from "lucide-react";
import { getNavigationItems, getStudentNavigationItems } from "./navigationConfig";

export const AppSidebar = () => {
  const userDetails =
  typeof window !== "undefined" ? JSON.parse(localStorage.getItem("userDetails") || "{}") : {};
const isAdmin = userDetails.id === 4;
  // const items = [
  //   {
  //     group: "Main",
  //     items: [
  //       {
  //         id: "dashboard",
  //         label: "Dashboard",
  //         path: "/",
  //         icon: Home,
  //         show: true,
  //       },
  //       {
  //         id: "2",
  //         label: "Program Management",
  //         path: "/program-management",
  //         icon: BookOpen,
  //         show: true,
  //       },
  //       {
  //         id: "3",
  //         label: "Question Generator",
  //         path: "/question-generator",
  //         icon: Brain,
  //         show: true,
  //       },
  //       {
  //         id: "4",
  //         label: "Question Bank",
  //         path: "/q-bank",
  //         icon: Upload,
  //         show: true,
  //       },

  //       {
  //         id: "5",
  //         label: "Question History",
  //         path: "/question-history",
  //         icon: History,
  //         show: true,
  //       },
  //       // {
  //       //   label: "Generated Question",
  //       //   path: "/generated-questions",
  //       //   icon: ScrollText,
  //       //   show: true,
  //       // },
  //       {
  //         id: "6",
  //         label: "Assessment",
  //         path: "/assessment",
  //         icon: Home,
  //         show: true,
  //       },
  //       {
  //         id: "7",
  //         label: "Attainment",
  //         path: "/attainment",
  //         icon: Home,
  //         show: true,
  //       },
  //       {
  //         id: "8",
  //         label: "PO Attainment",
  //         path: "/po-attainment",
  //         icon: Home,
  //         show: true,
  //       },
  //       {
  //         id: "9",
  //         label: "Mapping",
  //         path: "/mapping",
  //         icon: Home,
  //         show: true,
  //       },
  //       {
  //         id: "10",
  //         label: "Reports",
  //         path: "/reports",
  //         icon: Home,
  //         show: true,
  //       },
  //     ],
  //   },
  // ];

  const userData = localStorage.getItem("userDetails");
  const role = userData ? JSON.parse(userData).role : null;


  const navigationItems =
  role === "student"
    ? getStudentNavigationItems(() => true)
    : getNavigationItems((id) => (id === "13" ? isAdmin : true));


  return (
    <Sidebar>
      <SidebarContent>
        <NavigationGroups navigationItems={navigationItems} />
      </SidebarContent>
    </Sidebar>
  );
};
