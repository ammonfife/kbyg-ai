import { NavLink as RouterNavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building2, 
  Target, 
  Mail, 
  Crosshair,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Command Center" },
  { to: "/companies", icon: Building2, label: "Target Database" },
  { to: "/events", icon: Calendar, label: "Conference Events" },
  { to: "/strategy", icon: Target, label: "Execution Playbooks" },
  { to: "/email", icon: Mail, label: "Outreach Composer" },
  { to: "/import", icon: Crosshair, label: "Capture Analysis" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <aside 
      className={cn(
        "flex flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Crosshair className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">KBYG</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(collapsed && "mx-auto")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <RouterNavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-accent text-sidebar-primary font-medium",
                collapsed && "justify-center"
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </RouterNavLink>
        ))}
      </nav>

      <div className="p-4 border-t space-y-2">
        {user && (
          <>
            {!collapsed ? (
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent/50">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(user.email || 'U')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.email}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(user.email || 'U')}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            <Button
              variant="ghost"
              onClick={signOut}
              className={cn(
                "w-full",
                collapsed ? "justify-center px-2" : "justify-start"
              )}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Sign Out</span>}
            </Button>
          </>
        )}
        {!collapsed && (
          <p className="text-xs text-muted-foreground text-center pt-2">
            KBYG Intelligence Engine v1.0
          </p>
        )}
      </div>
    </aside>
  );
}
