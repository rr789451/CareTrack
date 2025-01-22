"use server"

import { ID, Query } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, messaging, OTP_COLLECTION_ID, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils"
import { InputFile } from "node-appwrite/file"

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(
            ID.unique(), 
            user.email, 
            user.phone, 
            undefined, 
            user.name
        )

        return parseStringify(newUser);
    } catch (error:any) {
        if(error && error?.code === 409) {
            const documents = await users.list([
                Query.equal('email', [user.email])
            ])

            return documents?.users[0]
        }
    }
}

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId);

        return parseStringify(user);
    } catch (error) {
        console.log(error);
    }
}

export const checkUser = async (email: string) => {
    try {
        const user = await users.list([Query.equal('email', email)]);

        if (user.total > 0) {
            return parseStringify(user.users[0]);
          } else {
            return null;
          }
    } catch (error) {
        console.log(error);
    }
}

export const registerPatient = async ({identificationDocument, ...patient}: RegisterUserParams) => {
    try {
        let file;

        if(identificationDocument){
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string,
            )

            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
        }

        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
                ...patient
            }
        )

        return parseStringify(newPatient);

    } catch (error) {
        console.log(error);
    }
}

export const getPatient = async (userId: string) => {
    try {
        const patients = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [Query.equal('userId', userId)]
        );

        if(patients){
            return parseStringify(patients.documents[0]);
        }

        return null;

    } catch (error) {
        console.log(error);
    }
}

export const storeOtp = async (userId:string, email:string) => {
    try {
        const existingOtps = await databases.listDocuments(
            DATABASE_ID!,
            OTP_COLLECTION_ID!,
            [Query.equal("email", email)]
        );
    
        if (existingOtps.documents.length > 0) {
        for (const doc of existingOtps.documents) {
            await databases.deleteDocument(DATABASE_ID!, OTP_COLLECTION_ID!, doc.$id);
        }
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const otp = await databases.createDocument(
            DATABASE_ID!,
            OTP_COLLECTION_ID!,
            ID.unique(),
            {
                otpCode,
                expiresAt,
                email
            }
        )

        const smsMessage = `${otpCode} is your OTP for verification on CarePulse. It will expire in 5 minutes. DO NOT share it with anyone. - CarePulse`;
        await sendSMSNotification(userId, smsMessage);

        return parseStringify(otp);
    } catch (error) {
        console.log(error);
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

export const verifyOtp = async (email: string, otp: string, userId: string) => {
    try {
        const otpList = await databases.listDocuments(
          DATABASE_ID!,
          OTP_COLLECTION_ID!,
          [
            Query.equal("email", email),
            Query.equal("otpCode", otp),
          ]
        );
  
        if (otpList.documents.length === 0) {
          throw new Error('Invalid OTP. Please try again!');
        }
  
        const otpEntry = otpList.documents[0];
        const isExpired = new Date(otpEntry.expiresAt) < new Date();
  
        if (isExpired) {
            throw new Error('OTP has expired');
        }

        await users.updatePhoneVerification(userId, true);
  
        return parseStringify(otpList);
      } catch (error) {
        console.error("OTP verification failed:", error);
        throw error;
      }
  
}

