import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  Users,
  FileText,
  BarChart,
  Brain,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 group-data-[collapsible=icon]:justify-center">
          {/* Logo Icon */}
          {/* <div className="flex items-center justify-center">
            <Image
              src="/logo-icon.png"
              alt="RecruitAI logo"
              width={100}
              height={100}
              className="shrink-0"
            />
          </div> */}
                  <SidebarTrigger  />

          {/* Text (hidden when collapsed) */}
          <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
            RecruitAI
          </span>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>
        {/* Recruitment */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl mb-4">
            Recruitment
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="flex gap-3 text-xl"
                  render={
                    <a href="/candidates">
                      <Users />
                      <span>Candidates</span>
                    </a>
                  }
                />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  className="flex gap-3 text-xl"
                  render={
                    <a href="/jobs">
                      <FileText />
                      <span>Job Posts</span>
                    </a>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* AI Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl mb-4">
            AI Insights
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="flex gap-3 text-xl"
                  render={
                    <a href="/ai-ranking">
                      <Brain />
                      <span>AI Ranking</span>
                    </a>
                  }
                />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  className="flex gap-3 text-xl"
                  render={
                    <a href="/analytics">
                      <BarChart />
                      <span>Analytics</span>
                    </a>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="mb-20 py-4 border-t-2 border-gray-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="flex gap-3 text-xl"
              render={
                <a href="/settings">
                  <Settings />
                  <span>Settings</span>
                </a>
              }
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="flex gap-3 text-xl text-red-800/80 hover:text-red-600"
              render={
                <a href="/settings">
                  <LogOut />
                  <span>Logout</span>
                </a>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
