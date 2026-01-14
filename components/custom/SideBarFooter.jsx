"use client";
import React from "react";
import { HelpCircle, Settings } from "react-feather";
import { Wallet } from "lucide-react";
import { LogOut } from "react-feather";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";

const SideBarFooter = () => {
  const Router = useRouter();
  const { toggleSidebar } = useSidebar();

  const options = [
    {
      name: "Settings",
      icon: Settings,
    },
    {
      name: "Help",
      icon: HelpCircle,
    },
    {
      name: "My Subscription",
      icon: Wallet,
      path: "/pricing",
    },
    {
      name: "Sign Out",
      icon: LogOut,
    },
  ];

  const onOptionClick = (option) => {
    toggleSidebar();
    if (option.path) {
      Router.push(option.path);
    }
  };

  return (
    <div className="p-5 mb-10">
      {options.map((option, index) => {
        return (
          <Button
            onClick={() => onOptionClick(option)}
            key={index}
            className="w-full flex justify-start my-3"
            variant="ghost"
          >
            <option.icon />
            {option.name}
          </Button>
        );
      })}
    </div>
  );
};

export default SideBarFooter;
