import NavBar from "@/components/ui/navBar";
import AppSidebar from "@/components/ui/side-bar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { protectionMemberUser } from "@/utils/serversideProtection";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import "../globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    profile,
    redirect: redirectTo,
    teamMemberProfile,
  } = await protectionMemberUser();

  if (redirectTo) {
    redirect(redirectTo);
  }
  if (!profile) redirect("/500");

  return (
    <SidebarProvider>
      {teamMemberProfile.alliance_member_role !== "MEMBER" && (
        <AppSidebar userData={profile} teamMemberProfile={teamMemberProfile} />
      )}

      <div className="min-h-screen h-full w-full bg-gray-100 flex flex-col md:mb-0">
        {teamMemberProfile.alliance_member_role !== "MEMBER" && (
          <div className="block md:hidden">
            <SidebarTrigger />
          </div>
        )}
        {teamMemberProfile.alliance_member_role === "MEMBER" && (
          <NavBar userData={profile} />
        )}

        <main className="flex-grow overflow-auto p-4">{children}</main>
      </div>
    </SidebarProvider>
  );
}
