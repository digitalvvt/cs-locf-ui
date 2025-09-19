import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavigationGroup } from "./navigationConfig";
import logo from "../../../../public/logo vvt final.png";

interface NavigationGroupsProps {
  navigationItems: NavigationGroup[];
}

export const NavigationGroups = ({ navigationItems }: NavigationGroupsProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };
  return (
    <>
      {navigationItems.map((group) => {
        const visibleItems = group.items.filter((item) => item.show);
        if (visibleItems.length === 0) return null;

        return (
          <SidebarGroup key={group.group}>
            {/* <SidebarGroupLabel>{group.group}</SidebarGroupLabel> */}
            {/* Logo Section */}

            <SidebarGroupContent>
              <div className="flex items-center justify-center ">
                <img src={logo} alt="LOCF Logo" className="h-[59px] w-[145px] object-contain" />
              </div>
              <SidebarMenu>
                {visibleItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={location.pathname === item.path}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}
    </>
  );
};
