"use client";
import React, { useEffect } from "react";
import Header from "../components/custom/Header";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/custom/AppSidebar";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ActionContext } from "@/context/ActionContext";
import { useRouter } from "next/navigation";

/**
 * Root application provider that wraps children with authentication, theme,
 * messaging, sidebar, and payment contexts.
 * @param {{ children: React.ReactNode }} props - Component props.
 * @returns {JSX.Element} The fully contextualized application shell.
 */
const Provider = ({ children }) => {
  const [messages, setMessages] = React.useState([]);
  const [userDetail, setUserDetail] = React.useState();
  const [action, setAction] = React.useState();
  const convex = useConvex();
  const router=useRouter();

  useEffect(() => {
    IsAuthenticated();
  }, []);

  /**
   * Checks if the user is authenticated by reading localStorage and
   * fetching user details from the Convex database. Redirects to
   * the home page if no valid user session is found.
   */
  const IsAuthenticated = async () => {
    if (typeof window !== "undefined") {
      let user;
      try {
        user = JSON.parse(localStorage.getItem("user"));
      } catch (e) {
        console.error("Corrupted user data in localStorage, clearing.", e);
        localStorage.removeItem("user");
      }
      //fetch from db
      if(!user)
      {
        router.push('/');
        return; 
      }
      const result = await convex.query(api.users.GetUser, {
        email: user?.email,
      });
      setUserDetail(result);
      console.log(result);
    }
  };

  return (
    <div>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}
      >
        <PayPalScriptProvider
          options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
        >
          <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <MessagesContext.Provider value={{ messages, setMessages }}>
              <ActionContext.Provider value={{ action, setAction }}>
                <NextThemesProvider
                  attribute="class"
                  enableSystem
                  defaultTheme="dark"
                  disableTransitionOnChange
                >
                  <Header />
                  <SidebarProvider defaultOpen={false}>
                    <AppSidebar />
                    {children}
                  </SidebarProvider>
                </NextThemesProvider>
              </ActionContext.Provider>
            </MessagesContext.Provider>
          </UserDetailContext.Provider>
        </PayPalScriptProvider>
      </GoogleOAuthProvider>
    </div>
  );
};

export default Provider;
