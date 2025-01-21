/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { getDoctorSchema } from "@/lib/validation"
import { FormFieldType } from "./PatientForm"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { Doctor } from "@/types/appwrite.types"
import FileUploader from "../FileUploader"
import { deleteDoctor, registerDoctor, updateDoctor } from "@/lib/actions/doctor.actions"

const DoctorForm = ({
    type,
    doctor,
    setOpen,
}:{
    type: "edit" | "delete" | "create";
    doctor?: Doctor;
    setOpen: (open: boolean) => void;
} ) => {

  const [isLoading, setIsLoading] = useState(false);

  const DoctorFormValidation = getDoctorSchema(type);

  const form = useForm<z.infer<typeof DoctorFormValidation>>({
    resolver: zodResolver(DoctorFormValidation),
    defaultValues: {
      name: doctor ? doctor.name : '',
      image: doctor ? [doctor.image as unknown as File] : [],
      status: doctor ? doctor.status : 'available',
    },
  })
  async function onSubmit(values: z.infer<typeof DoctorFormValidation>) {
    setIsLoading(true);

    let formData;
    
    if(type === 'create' && values.image && values.image.length > 0) {
        const bolbFile = new Blob([values.image[0]], {
            type: values.image[0].type,
        })
        
        formData = new FormData();
        formData.append("blobFile", bolbFile);
        formData.append("fileName", values.image[0].name)
    }
    
    try {
        if(type === 'create'){
            const doctorData = {
                name: values.name,
                image: formData,
                status: values.status,
            }
            
            const doctor = await registerDoctor(doctorData);

            if(doctor){
                if (setOpen) {
                    setOpen(false);
                }
                form.reset();
            }
        } else {
            const doctorToUpdate = {
                doctorId: doctor?.$id!,
                doctor:{
                    name: values?.name,
                    status: values?.status,
                },
            }

            const updatedDoctor = await updateDoctor(doctorToUpdate);

            if(updatedDoctor) {
                if (setOpen) {
                    setOpen(false);
                }
                form.reset();
            }
        }
    } catch (error) {
        console.log(error);
    }
    if(type === 'delete'){
        try{
        if (doctor) {
            await deleteDoctor({ doctorId: doctor.$id, doctor: doctor });
    
            if (setOpen) {
                setOpen(false);
            }
        } else {
            console.error("Doctor ID is missing");
        }
        } catch (error) {
            console.error("Error deleting doctor:", error);
        } finally {
            setIsLoading(false);
        }
    }
  }

  let buttonLabel;

  switch (type){
    case "delete":
        buttonLabel = 'Delete Doctor';
        break;

    case "create":
        buttonLabel = 'Add Doctor';
        break;
    
    case "edit":
        buttonLabel = 'Edit Doctor';
        break;
    default:
        break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1">

        {type !== "delete" && (
            <>
                <CustomFormField 
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    label="Doctor's Name"
                    placeholder="John Doe"
                />
                <CustomFormField 
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="status"
                    label="Availability of the Doctor"
                    placeholder="Please select the availability of the doctor"
                >
                        <SelectItem 
                            key={'available'} 
                            value={'available'}
                        >
                            <div className="flex cursor-pointer items-center gap-2">
                                <Image 
                                    src='/assets/icons/available.svg'
                                    width={24}
                                    height={24}
                                    alt='available'
                                    className="rounded-md"
                                />
                                <p>Available</p>
                            </div>
                        </SelectItem>
                        <SelectItem 
                            key={'leave'} 
                            value={'leave'}
                        >
                            <div className="flex cursor-pointer items-center gap-2">
                                <Image 
                                    src='/assets/icons/leave.svg'
                                    width={24}
                                    height={24}
                                    alt='leave'
                                    className="rounded-md"
                                />
                                <p>Leave</p>
                            </div>
                        </SelectItem>
                </CustomFormField>
            { type === 'create' &&
                <CustomFormField 
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="image"
                    label="Upload Doctor's Photo"
                    renderSkeleton={(field:any) => (
                        <FormControl>
                            <FileUploader 
                                files={field.value} 
                                onChange={field.onChange}    
                            />
                        </FormControl>
                    )}
                />}

            </>
        )}

        {type === "delete" && (
            <div className="flex items-center gap-3">
                <Image 
                    src={doctor?.imageUrl || ''}
                    alt={doctor?.name || ''}
                    width={100}
                    height={100}
                    className="size-8 rounded-md"
                />

                <p className="whitespace-nowrap">
                    Dr. {doctor?.name}
                </p>
            </div>
        )}

        <SubmitButton isLoading={isLoading} className={`${type === 'delete' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>
            {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  )
}

export default DoctorForm