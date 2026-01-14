"use client";
import React, { useContext, useEffect } from "react";
import { useParams } from "next/navigation";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MessagesContext } from "@/context/MessagesContext";
import Colors from "@/data/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import Image from "next/image";
import Lookup from "@/data/Lookup";
import { ArrowRight, Link, Loader } from "react-feather";
import axios from "axios";
import prompt from "@/data/Prompt";
import { useMutation } from "convex/react";
import ReactMarkdown from "react-markdown";
import { useSidebar } from "@/components/ui/sidebar";
import { toast } from "sonner";

const countToken = (inputText) => {
  if (!inputText) return 0;
  return inputText
    .trim()
    .split(/\s+/)
    .filter((word) => word).length;
};

const ChatView = () => {
  const { id } = useParams();
  const convex = useConvex();
  const { messages = [], setMessages } = useContext(MessagesContext);
  const messagesArray = Array.isArray(messages) ? messages : [];
  const { userDetail,setUserDetail } = useContext(UserDetailContext);
  const [userInput, setUserInput] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const { toggleSidebar } = useSidebar();
  const UpdateTokens=useMutation(api.users.UpdateToken);

  useEffect(() => {
    GetWorkspaceData();
  }, [id]);

  // use workspace id to get the workspace data
  const GetWorkspaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspaceData, {
      workspaceId: id,
    }); // Updated query name and parameter
    if (Array.isArray(result.messages)) {
      setMessages(result.messages); // Set to messages array
    } else {
      setMessages([]); // Fallback to empty array
      console.error("Expected messages to be an array", result.messages);
    }
    console.log(result);
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role === "user") {
        console.log("User message");
        GetAiResponse();
      }
    }
  }, [messages]);

  const GetAiResponse = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages) + prompt.CHAT_PROMPT;
    console.log("prompt", PROMPT);
    try {
      const result = await axios.post("/api/ai-chat", {
        prompt: PROMPT,
      });
      console.log(result.data.result);
      setMessages((prev) => [
        ...prev,
        { content: result.data.result, role: "ai" },
      ]);
      const aiResp = result.data.result; 
      const token = Number(userDetail?.token) - Number(countToken(JSON.stringify(aiResp)));
      setUserDetail(prev => ({ ...prev, token: token }));
      await UpdateTokens({
        userId: userDetail?._id,
        token: token, // Changed from 'tokens' to 'token'
      });
      await UpdateMessages({
        messages: [...messages, { content: result.data.result, role: "ai" }],
        workspaceId: id,
      });
    } catch (error) {
      console.error("Error in GetAiResponse:", error);
      toast.error("Failed to generate AI response. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const onGenerate = (input) => {
    if(userDetail?.token<10)
    {
        toast.error("You don't have enough tokens to generate response");
        return ;
    }    
    setMessages((prev) => [...prev, { content: input, role: "user" }]);
    setUserInput("");
  };

  return (
    <div className="relative h-[85vh] flex flex-col">
      <div className="flex-1 overflow-y-scroll scrollbar-hide pl-5">
        {messagesArray.map((message, index) => (
          <div
            key={index}
            style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
            className="p-3 mb-2 rounded-lg flex gap-2 items-center leading-7"
          >
            {message?.role === "user" && (
              <Image
                src={userDetail?.picture}
                alt="useImage"
                width={35}
                height={35}
                className="rounded-full"
              />
            )}
            <ReactMarkdown className="flex flex-col">
              {message.content}
            </ReactMarkdown>
          </div>
        ))}
        {loading && (
          <div
            className="p-3 mb-2 rounded-lg flex gap-2 items-start"
            style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
          >
            <Loader className="spin animate-spin h-5 w-5" />
            <h2>Generating Response</h2>
          </div>
        )}
      </div>
      {/* Input Section */}
      <div className="flex gap-2 items-end">
        {userDetail && (
          <Image
            src={userDetail?.picture}
            alt="user"
            width={30}
            height={30}
            className="rounded-full cursor-pointer"
            onClick={toggleSidebar}
          />
        )}
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
      </div>
    </div>
  );
};

export default ChatView;
