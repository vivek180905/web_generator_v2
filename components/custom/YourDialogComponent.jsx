
import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const YourDialogComponent = () => {
  return (
    <Dialog>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <DialogContent>
        {/* Visible DialogTitle */}
        <DialogTitle>Your Dialog Title</DialogTitle>
        
        {/* Or, to hide the DialogTitle visually but keep it accessible */}
        {/* 
        <DialogTitle>
          <VisuallyHidden>Your Dialog Title</VisuallyHidden>
        </DialogTitle>
        */}
        
        {/* ...existing content... */}
      </DialogContent>
    </Dialog>
  );
};

export default YourDialogComponent;