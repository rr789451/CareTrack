'use server'

import { Client, ID, Query, Storage } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, DOCTOR_COLLECTION_ID, ENDPOINT, PROJECT_ID, storage, } from "../appwrite.config"
import { parseStringify } from "../utils"
import { InputFile } from "node-appwrite/file"
import { revalidatePath, unstable_noStore } from "next/cache"
import { Doctor } from "@/types/appwrite.types"

export const registerDoctor = async ({image, ...doctor}: RegisterDoctorParams) => {
    try {
        let file;
        if(image){
            const inputFile = InputFile.fromBuffer(
                image?.get('blobFile') as Blob,
                image?.get('fileName') as string,
            )
            
            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
            console.log(file);
        }

        const newDoctor = await databases.createDocument(
            DATABASE_ID!,
            DOCTOR_COLLECTION_ID!,
            ID.unique(),
            {
                imageId: file?.$id || null,
                imageUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
                ...doctor
            }
        )

        revalidatePath('/admin');
        return parseStringify(newDoctor);

    } catch (error) {
        console.log(error);
    }
}

export const updateDoctor = async ({ doctorId, doctor }: UpdateDoctorParams) => {
    try {
        const updatedDoctor = await databases.updateDocument(
            DATABASE_ID!,
            DOCTOR_COLLECTION_ID!,
            doctorId,
            doctor
        )

        if(!updatedDoctor){
            throw new Error('Doctor not found');
        }

        revalidatePath('/admin');
        return parseStringify(updatedDoctor);
    } catch (error) {
        console.log(error)
    }
}

export const getRecentDoctorList = async () => {
    unstable_noStore();
    try {
        const doctors = await databases.listDocuments(
            DATABASE_ID!,
            DOCTOR_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')],
        );

        const initialCounts = {
            availableCount: 0,
            leaveCount: 0,
        }

        const counts = (doctors.documents as Doctor[]).reduce((acc, doctor) => {
            switch (doctor.status) {
                case 'available':
                    acc.availableCount += 1;
                    break;
                case 'leave':
                    acc.leaveCount += 1;
                    break;
            }

            return acc;
        }, initialCounts);

        const data = {
            totalCount: doctors.total,
            ...counts,
            documents: doctors.documents
        }

        return parseStringify(data);
    } catch (error) {
        console.log(error)
    }
}

export const deleteDoctor = async ({ doctorId, doctor }: DeleteDoctorParams) => {
    try {
        const deleteDoctor = await databases.deleteDocument(
            DATABASE_ID!,
            DOCTOR_COLLECTION_ID!,
            doctorId,
        )

        const client = new Client()
            .setEndpoint(ENDPOINT!)
            .setProject(PROJECT_ID!);

        const storage = new Storage(client);

        const result = await storage.deleteFile(
            BUCKET_ID!,
            doctor.imageId
        );


        if(!deleteDoctor){
            throw new Error('Doctor not found');
        }

        if(!result){
            throw new Error('File not found');
        }

        revalidatePath('/admin');
    } catch (error) {
        console.log(error)
    }
}