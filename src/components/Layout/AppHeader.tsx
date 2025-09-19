// components/Layout/AppHeader.tsx
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronDown, User } from "lucide-react";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  onLogout?: () => void;
  onProfile?: () => void;
}

export const AppHeader = ({
  title,
  subtitle,
  userName = "User",
  onLogout,
  onProfile,
}: AppHeaderProps) => {
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="flex-1">
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      {/* Enhanced Avatar Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-10 w-auto px-2 py-1 rounded-full hover:bg-accent/50 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-accent transition-all duration-200">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-3 w-3 text-muted-foreground opacity-50" />
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-48 p-2 animate-in slide-in-from-top-2 duration-200"
          sideOffset={8}
        >
          {/* User Info Section */}
          <div className="flex items-center gap-3 p-2 mb-2 bg-muted/50 rounded-lg">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
            </div>
          </div>

          <DropdownMenuItem
            onClick={onProfile}
            className="flex items-center gap-3 p-2 cursor-pointer rounded-md transition-colors duration-150"
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>

          {/* Divider (optional) */}
          <DropdownMenuSeparator />

          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem
            onClick={onLogout}
            className="flex items-center gap-3 p-2 cursor-pointer hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors duration-150 focus:bg-destructive/10 focus:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
