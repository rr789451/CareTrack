import AppointmentForm from "@/components/forms/AppointmentForm";
import ProtectedPage from "@/components/ProtectedPage";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

export default async function NewAppointment({ params }: SearchParamProps) {

  const {userId} = await params;

  const patient = await getPatient(userId);

  if (!patient) {
    notFound();
  }

  return (
    <ProtectedPage>
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image 
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="Logo"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm 
            type="create"
            userId={userId}
            patientId={patient.$id}
          />

          <p className="copyright py-12">
            © 2024 CarePulse
          </p>
        </div>
      </section>
      <Image 
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
    </ProtectedPage>
  );
}