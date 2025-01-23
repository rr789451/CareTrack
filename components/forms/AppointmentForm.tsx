/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useEffect, useState } from "react"
import { getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { FormFieldType } from "./PatientForm"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"
import { Appointment, Doctor } from "@/types/appwrite.types"
import { getRecentDoctorList } from "@/lib/actions/doctor.actions"
import { DoctorStatusBadge } from "../DoctorStatusBadge"

const AppointmentForm = ({
    userId,
    patientId,
    type,
    appointment,
    setOpen,
}:{
    userId: string;
    patientId: string;
    type: "create" | "cancel" | "schedule" | "edit" | 'complete';
    appointment?: Appointment;
    setOpen: (open: boolean) => void;
} ) => {

  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isFetchingDoctors, setIsFetchingDoctors] = useState(false);
  const router = useRouter();

  const AppointmentFormValidation = getAppointmentSchema(type);
  
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.doctor.$id : '',
      schedule: appointment ? new Date(appointment?.schedule) : new Date(Date.now()),
      reason: appointment ? appointment.reason : '',
      note: appointment?.note || '',
      cancellationReason: appointment?.cancellationReason || '',
      completionReason: appointment?.completionReason || '',
    },
  })

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsFetchingDoctors(true);
      try {
        const fetchedDoctors = await getRecentDoctorList();
        setDoctors(fetchedDoctors.documents || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setIsFetchingDoctors(false);
      }
    };
  
    fetchDoctors();
  }, []);

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);
    let status;

    switch (type){
        case "schedule":
            status = 'scheduled';
            break;

        case "cancel":
            status = 'cancelled';
            break;
        
        case "edit":
            status = 'pending';
            break;
        
        case "complete":
            status = 'completed';
            break;
        
        default:
            status = 'pending';
            break;
      }

    try {
        if(type === 'create' && patientId){
            const appointmentData = {
                userId,
                patient: patientId,
                doctor: values.primaryPhysician,
                schedule: new Date(values.schedule),
                reason: values.reason!,
                note: values.note,
                status: status as Status
            }

            const appointment = await createAppointment(appointmentData);

            if(appointment){
                form.reset();
                router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
            }
        } else {
            const appointmentToUpdate = {
                userId,
                appointmentId: appointment?.$id!,
                appointment:{
                    doctor: values.primaryPhysician,
                    schedule: new Date(values?.schedule),
                    status: status as Status,
                    cancellationReason: values?.cancellationReason,
                    completionReason: values?.completionReason,
                },
                type
            }

            const updatedAppointment = await updateAppointment(appointmentToUpdate);

            if(updatedAppointment) {
                if (setOpen) {
                    setOpen(false);
                }
                form.reset();
            }
        }
    } catch (error) {
        console.log(error);
    }
  }

  let buttonLabel;

  switch (type){
    case "cancel":
        buttonLabel = 'Cancel Appointment';
        break;

    case "create":
        buttonLabel = 'Create Appointment';
        break;
    
    case "schedule":
        buttonLabel = 'Schedule Appointment';
        break;
    
    case "edit":
        buttonLabel = 'Edit Appointment';
        break;
    
    case "complete":
        buttonLabel = 'Complete Appointment';
        break;

    default:
        break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1">
        {type === 'create' && <section className="mb-12 space-y-4">
            <h1 className="header">Hey there 👋</h1>
            <p className="text-dark-700">Request a new appointment in 10 seconds.</p>
        </section>}

        {type !== "cancel" && type !== "complete" && (
            <>
                <CustomFormField 
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="primaryPhysician"
                    label="Doctor"
                    placeholder="Select a Doctor"
                >
                    {doctors.map((doctor) => (
                        <SelectItem 
                            key={doctor.$id} 
                            value={doctor.$id}
                        >
                            <div className="flex cursor-pointer items-center gap-2">
                                <Image 
                                    src={doctor.imageUrl}
                                    width={32}
                                    height={32}
                                    alt={doctor.name}
                                    className="rounded-full border border-dark-500"
                                />
                                <p>{doctor.name}</p> {type === 'schedule' && <DoctorStatusBadge status={doctor.status} />}
                            </div>
                        </SelectItem>
                    ))}
                </CustomFormField>

                <CustomFormField 
                    fieldType={FormFieldType.DATE_PICKER}
                    control={form.control}
                    name="schedule"
                    label="Appointment Date and Time"
                    showTimeSelect
                    dateFormat="dd/MM/yyyy - h:mm a"
                />

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField 
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="reason"
                        label="Reason for Appointment"
                        placeholder="ex: Monthly check-up"
                    />

                    <CustomFormField 
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="note"
                        label="Notes"
                        placeholder="ex: Prefer afternoon appointments, if possible"
                    />
                </div>

            </>
        )}

        {type === "cancel" && (
            <CustomFormField 
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="cancellationReason"
                label="Reason for Cancellation"
                placeholder="Enter reason for cancellation"
            />
        )}

        {type === "complete" && (
            <CustomFormField 
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="completionReason"
                label="Notes from Doctor"
                placeholder="Enter if there are any notes from doctor"
            />
        )}

        <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>
            {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  )
}

export default AppointmentForm