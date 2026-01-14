"use client";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import React from "react";
import { ArrowRight, Link } from "react-feather";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import SignInDialog from "./SignInDialog";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";

const Hero = () => {
  const CreateWorkspace = useMutation(api.workspace.CreateWorkSpace);

  const [userInput, setUserInput] = React.useState();
  const { messages, setMessages } = React.useContext(MessagesContext);
  const { userDetail, setUserDetail } = React.useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = React.useState(false);
  const router=useRouter();

  const onGenerate = async (input) => {
    if (!userDetail?.name) {
      setOpenDialog(true);
      return;
    }
    setMessages({
      role: "user",
      content: input,
    });
    
    const workspaceId = await CreateWorkspace({
      user: userDetail._id,
      messages:[{
        role: "user",
        content: input,
      }],
    })
    console.log(workspaceId);
    router.push(`/workspace/${workspaceId}`);
  };

  return (
    <div
      className="flex flex-col items-center mt-36 xl:mt-56 gap-2"
      suppressHydrationWarning
    >
      <h2 className="font-bold text-4xl">{Lookup.HERO_HEADING}</h2>
      <p className="text-gray-400 font-medium">{Lookup.HERO_DESC}</p>
      <div
        className="p-5 border rounded-xl max-w-xl w-full mt-3"
        style={{ backgroundColor: Colors.BACKGROUND }}
      >
        <div className="flex gap-2 " suppressHydrationWarning>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={Lookup.INPUT_PLACEHOLDER}
            className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
          />
          {userInput && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              className="bg-blue-500 p-2 h-10 w-8 rounded-md cursor-pointer"
            />
          )}
        </div>
        <div className="">
          <Link className="w-4 h-4" />
        </div>
      </div>
      <div className="flex mt-8 flex-wrap max-w-2xl items-center justify-center gap-3">
        {Lookup?.SUGGSTIONS.map((suggestion, index) => (
          <h2
            onClick={() => setUserInput(suggestion)}
            key={index}
            className="p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer"
          >
            {suggestion}
          </h2>
        ))}
      </div>
      <SignInDialog 
        openDialog={openDialog}
        closeDialog={(v) => setOpenDialog(v)}
      />
    </div>
  );
};

export default Hero;