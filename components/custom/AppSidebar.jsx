import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { MessageCircleCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorkSpaceHistory from "./WorkSpaceHistory";
import SideBarFooter from "./SideBarFooter";

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="p-5">
        <Image src={"/image.png"} alt="logo" width={30} height={30} />
        <Button className="mt-5">
          <MessageCircleCode /> Start New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent className="p-5">
        <SidebarGroup>
          <WorkSpaceHistory />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SideBarFooter />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
