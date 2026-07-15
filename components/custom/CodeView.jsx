"use client";
import React, { useRef } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";
import axios from "axios";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import Prompt from "@/data/Prompt";
import { useContext } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { useConvex } from "convex/react";
import { Loader } from "react-feather";
import SandPackPreviewClient from "./SandPackPreviewClient";
import { ActionContext } from "@/context/ActionContext";
import { toast } from "sonner";

/**
 * Estimates the token count of a text string by counting whitespace-separated words.
 * @param {string} inputText - The text to count tokens for.
 * @returns {number} The approximate token count.
 */
const countToken = (inputText) => {
  if (!inputText) return 0;
  return inputText
    .trim()
    .split(/\s+/)
    .filter((word) => word).length;
};

/**
 * Code editor and preview component that displays AI-generated files in a
 * Sandpack environment. Handles code generation requests and manages the
 * code/preview tab switching.
 * @returns {JSX.Element} The code editor with file explorer and live preview.
 */
function CodeView() {
  const convex = useConvex();
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("code");
  const [files, setFiles] = React.useState(Lookup?.DEFAULT_FILE);
  const { messages, setMessages } = useContext(MessagesContext);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const UpdateTokens = useMutation(api.users.UpdateToken);
  const { action, setAction } = useContext(ActionContext);

  // Ref to track the last processed message count and prevent infinite loop
  const lastProcessedMsgCount = useRef(0);

  React.useEffect(() => {
    if (id) {
      GetFiles();
    }
  }, [id]);

  React.useEffect(() => {
    setActiveTab("preview");
  }, [action]);

  /**
   * Fetches saved file data from the workspace in Convex and merges it
   * with the default template files. Marks existing messages as processed.
   */
  const GetFiles = async () => {
    setLoading(true);
    const result = await convex.query(api.workspace.GetWorkspaceData, {
      workspaceId: id,
    });
    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...result?.fileData };
    setFiles(mergedFiles);
    // Mark all existing messages as processed so we don't re-trigger code gen
    if (Array.isArray(result?.messages)) {
      lastProcessedMsgCount.current = result.messages.length;
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (messages?.length > 0 && messages.length > lastProcessedMsgCount.current) {
      const role = messages[messages.length - 1].role;
      if (role === "user") {
        lastProcessedMsgCount.current = messages.length;
        GenerateAiCode();
      }
    }
  }, [messages]);

  /**
   * Sends the message history to the AI code generation API, parses the
   * structured response, and updates files in both local state and Convex.
   * Deducts tokens from the user's balance.
   */
  const GenerateAiCode = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
    try {
      const result = await axios.post("/api/gen-ai-code", {
        prompt: PROMPT,
      });
      console.log(result.data);
      const aiResp = result.data;

      const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResp.files };
      setFiles(mergedFiles);
      await UpdateFiles({
        workspaceId: id,
        files: aiResp?.files,
      });
      const token =
        Number(userDetail?.token) - Number(countToken(JSON.stringify(aiResp)));
      await UpdateTokens({
        userId: userDetail?._id,
        token: token,
      });
      setUserDetail((prev) => ({ ...prev, token: token }));
    } catch (error) {
      console.error("Error in GenerateAiCode:", error);
      toast.error("Failed to generate AI code. Please try again later.");
    } finally {
      setActiveTab("code");  
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="bg-[#181818] w-full p-2 border">
        <div className="flex items-center flex-wrap shrink-0 bg-black p-1 w-[140px] gap-3 justify-center rounded-full">
          <h2
            className={`text-sm cursor-pointer ${activeTab === "code" ? "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full" : ""}`}
            onClick={() => setActiveTab("code")}
          >
            Code
          </h2>
          <h2
            className={`text-sm cursor-pointer ${activeTab === "preview" ? "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full" : ""}`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </h2>
        </div>
      </div>
      <SandpackProvider
        template="react"
        theme="dark"
        customSetup={{ dependencies: { ...Lookup.DEPENDANCY } }}
        files={files}
        options={{ externalResources: ["https://cdn.tailwindcss.com"] }}
      >
        <SandpackLayout>
          {activeTab == "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor style={{ height: "80vh" }} />
            </>
          ) : (
            <>
              <SandPackPreviewClient />
            </>
          )}
        </SandpackLayout>
      </SandpackProvider>
      {loading && (
        <div className="p-10 bg-gray-900 opacity-80 absolute top-0 rounded-lg w-full h-full flex items-center justify-center">
          <Loader className="animate-spin h-10 w-10 text-white" />
          <h2 className="text-white">Generating Your Files...</h2>
        </div>
      )}
    </div>
  );
}

export default CodeView;