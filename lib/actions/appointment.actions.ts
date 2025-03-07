'use server'

import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases, messaging } from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment, Doctor } from "@/types/appwrite.types";
import { revalidatePath, unstable_noStore } from "next/cache";
import { getRecentDoctorList } from "./doctor.actions";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        )

        return parseStringify(newAppointment);
    } catch (error) {
        console.log(error)
    }
}

export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
        )

        return parseStringify(appointment);
    } catch (error) {
        console.log(error)
    }
}

export const getRecentAppointmentList = async () => {
    unstable_noStore();
    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')],
        );

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
            completeCount: 0,
        }

        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            switch (appointment.status) {
                case 'scheduled':
                    acc.scheduledCount += 1;
                    break;
                case 'pending':
                    acc.pendingCount += 1;
                    break;
                case 'cancelled':
                    acc.cancelledCount += 1;
                    break;
                case 'completed':
                    acc.completeCount += 1;
                    break;
            }

            return acc;
        }, initialCounts);

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        }

        return parseStringify(data);
    } catch (error) {
        console.log(error)
    }
}

export const getIndividualAppointmentList = async (userId: string) => {
    unstable_noStore();
    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.equal('userId', userId)],
        );

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
            completeCount: 0,
        }

        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            switch (appointment.status) {
                case 'scheduled':
                    acc.scheduledCount += 1;
                    break;
                case 'pending':
                    acc.pendingCount += 1;
                    break;
                case 'cancelled':
                    acc.cancelledCount += 1;
                    break;
                case 'completed':
                    acc.completeCount += 1;
                    break;
            }

            return acc;
        }, initialCounts);

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        }

        return parseStringify(data);
    } catch (error) {
        console.log(error)
    }
}

export const updateAppointment = async ({ appointmentId, userId, appointment, type }: UpdateAppointmentParams) => {
    try {
        const updatedAppointment = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment
        )

        if(!updatedAppointment){
            throw new Error('Appointment not found');
        }

          const Doctors = await getRecentDoctorList();
          const doctor = Doctors.documents.find((doc:Doctor) => doc.$id === appointment.doctor)

        const smsMessage = `
            ${type === 'schedule' 
                && `Hi, it's CarePulse. Your appointment has been scheduled for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${doctor.name}` || type === 'cancel' &&
                `Hi, it's CarePulse. We regret to inform you that your appointment has been cancelled for the following reason: ${appointment.cancellationReason}`
            }.
        `;
        if(type === 'schedule' || type === 'cancel'){
            await sendSMSNotification(userId, smsMessage);
        }

        revalidatePath('/admin');
        return parseStringify(updatedAppointment);
    } catch (error) {
        console.log(error)
    }
}

export const sendSMSNotification = async (userId: string, content: string) => {
    try {
        const message = await messaging.createSms(
            ID.unique(),
            content,
            [],
            [userId],
        )

        return parseStringify(message);
    } catch (error) {
        console.log(error)
    }
}