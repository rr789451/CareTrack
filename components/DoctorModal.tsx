'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { useState } from "react";
import { Doctor } from "@/types/appwrite.types";
import DoctorForm from "./forms/DoctorForm";

const DoctorModal = ({ 
    type,
    doctor,
}: {
    type: 'edit' | 'delete' | 'create',
    doctor?: Doctor,
}) => {

  const [open, setOpen] = useState(false);
    
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant={`${type === 'create' ? 'default' : 'ghost' }`} className={`capitalize ${type === 'edit' && 'text-blue-500' || type === 'delete' && 'text-red-500' || type === 'create' && 'text-green-500 px-12 hover:bg-green-500 hover:text-white'}`}>
                {type}
            </Button>
        </DialogTrigger>
        <DialogContent className="shad-dialog sm:max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader className="mb-4 space-y-3">
            <DialogTitle className="capitalize">{type} Doctor</DialogTitle>
            {type === 'edit' && <DialogDescription>
                Please fill in the following details to {type} a doctor.
            </DialogDescription>
            || 
            type === 'create' && <DialogDescription>
                Please fill in the following details to {type} a doctor.
            </DialogDescription>
            ||
            <DialogDescription>
                Are you sure you want to {type} this doctor?
            </DialogDescription>
            }
            </DialogHeader>
            <DoctorForm 
                type={type}
                doctor={doctor}
                setOpen={setOpen}
            />
        </DialogContent>
    </Dialog>
  )
}

export default DoctorModal;