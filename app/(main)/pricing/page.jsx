"use client";
import React from "react";
import Lookup from "@/data/Lookup";
import { UserDetailContext } from "@/context/UserDetailContext";
import Colors from "@/data/Colors";
import PricingModel from "@/components/custom/PricingModel";

const page = () => {
  const { userDetail, setUserDetail } = React.useContext(UserDetailContext);
  return (
    <div className="mt-10 flex flex-col items-center mx-auto w-full p-10  md:px-32 lg:px-40">
      <h2 className="font-bold text-5xl">Pricing</h2>
      <p className="text-gray-400 max-w-xl text-center mt-4">
        {Lookup.PRICING_DESC}
      </p>
      <div
        className="p-5 border rounded-xl w-full flex justify-between mt-7 items-center"
        style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
      >
        <h2 className="text-lg">
          <span className="font-bold mr-2">{userDetail?.token}</span>
          Token Left
        </h2>
        <div className="">
          <h2 className="font-medium">Need More Token?</h2>
          <p>Upgrade your plan below</p>
        </div>
      </div>
      <PricingModel />
    </div>
  );
};

export default page;
