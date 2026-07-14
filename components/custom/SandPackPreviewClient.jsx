import React, { useEffect } from "react";
import { SandpackPreview, useSandpack } from "@codesandbox/sandpack-react";
import { ActionContext } from "@/context/ActionContext";
import { useContext } from "react";

/**
 * Sandpack preview wrapper that handles deploy and export actions by
 * obtaining the CodeSandbox URL from the Sandpack client.
 * @returns {JSX.Element} The Sandpack preview with navigation controls.
 */
function SandPackPreviewClient() {
  const previewRef = React.useRef();
  const { sandpack } = useSandpack();
  const { action, setAction } = useContext(ActionContext);

  useEffect(() => {
    GetSandpackClient();
  }, [sandpack, action]);

  /**
   * Retrieves the Sandpack client instance and performs deploy/export
   * actions by opening the CodeSandbox URL in a new tab.
   */
  const GetSandpackClient = async () => {
    const client = previewRef.current?.getClient();
    if (client) {
      console.log("Client", client);
      const result = await client.getCodeSandboxURL();
      console.log(result);
      if(action?.actionType=="deploy")
      {
        window.open(`https://${result?.sandboxId}.csb.app/`);
      }
      else
      if(action?.actionType=="export")
      {
        window?.open(result?.editorUrl);
      }
    }
  };

  return (
    <SandpackPreview
      style={{ height: "80vh" }}
      ref={previewRef}
      showNavigator
    />
  );
}

export default SandPackPreviewClient;
