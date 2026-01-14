import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Colors from "../../data/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";
import { ActionContext } from "../../context/ActionContext";
import { Download, Rocket } from 'lucide-react';
import { usePathname } from "next/navigation";

const Header = () => {
  const { userDetail, setUserDetail } = React.useContext(UserDetailContext);
  const { action, setAction } = React.useContext(ActionContext);

  const path=usePathname();

  const onActionBtn=(action)=>{
    setAction({
      actionType:action,
      timeStamp:Date.now()
    });
  }

  return (
    <div className="p-4 flex items-center justify-between">
      <Image src={"/image.png"} width={40} height={40} alt="Logo" />
      {!userDetail && (
        <div className="flex gap-5">
          <Button variant="ghost">Sign In</Button>
          <Button
            className="text-white"
            style={{
              backgroundColor: Colors.BLUE,
            }}
          >
            Get Started
          </Button>
        </div>
      )}
      {userDetail && path?.includes('workspace') && (
        <div className="flex gap-5">
          <Button variant="ghost" onClick={()=>onActionBtn('export')}>Export <Download/></Button>
          <Button
            onClick={()=>onActionBtn('deploy')}
            className="text-white"
            style={{
              backgroundColor: Colors.BLUE,
            }}
          >
            Deploy <Rocket/>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;
