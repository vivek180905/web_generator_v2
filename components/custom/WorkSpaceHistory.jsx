"use client";
import React, { useEffect } from "react";
import { UserDetailContext } from "../../context/UserDetailContext";
import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { useSidebar } from "../ui/sidebar";

const WorkSpaceHistory = () => {
  const { userDetail, setUserDetail } = React.useContext(UserDetailContext);
  const convex = useConvex();
  const [workspaceList, setWorkspaceList] = React.useState([]);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    userDetail && GetAllWorkspace();
  }, [userDetail]);

  const GetAllWorkspace = async () => {
    const result = await convex.query(api.workspace.GetAllWorkspace, {
      userId: userDetail?._id,
    });
    setWorkspaceList(result);
    console.log(result);
    console.log(workspaceList);
  };
  return (
    <div>
      <h2 className="font-medium text-lg">Your Chats</h2>
      <div>
        {workspaceList &&
          workspaceList.map((workspace, index) => (
            <Link key={index} href={`/workspace/${workspace?._id}`}>
              <h2
                onClick={toggleSidebar}
                className="text-sm text-gray-400 mt-2 font-light hover:text-white cursor-pointer"
              >
                {workspace?.messages[0]?.content}
              </h2>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default WorkSpaceHistory;
