/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import DashboardButton from '@/components/DashboardButton';
import ProtectedPage from '@/components/ProtectedPage';
import { getAppointment } from '@/lib/actions/appointment.actions';
import { getRecentDoctorList } from '@/lib/actions/doctor.actions';
import { formatDateTime } from '@/lib/utils';
import { Doctor } from '@/types/appwrite.types';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Success = async ({ params: { userId }, searchParams }: SearchParamProps) => {

  const appointmentId = (searchParams?.appointmentId as string) || '';
  const appointment = await getAppointment(appointmentId);
  const Doctors = await getRecentDoctorList();
  const doctor = Doctors.documents.find((doc:Doctor) => doc.$id === appointment.doctor.$id)
  return (
    <ProtectedPage>
    <div className='flex h-screen max-h-screen px-[5%]'>
        <div className='success-img'>
            <Link href='/'>
                <Image 
                    src="/assets/icons/logo-full.svg"
                    width={1000}
                    height={1000}
                    alt='logo'
                    className='h-10 w-fit'
                />
            </Link>

            <section className='flex flex-col items-center'>
                <Image 
                    src="/assets/gifs/success.gif"
                    height={300}
                    width={280}
                    alt='success'
                />

                <h2 className='header mb-6 max-w-[600px] text-center'>
                    Your <span className='text-green-500'>appointment request</span> has been successfully submitted!
                </h2>

                <p>We will be in touch shortly to confirm.</p>
            </section>

            <section className='request-details'>
                <p>Requested appointment details:</p>
                <div className='flex items-center gap-3'>
                    <Image 
                        src={doctor?.imageUrl!}
                        width={100}
                        height={100}
                        alt='doctor'
                        className='size-8 rounded-md'
                    />
                    <p className='whitespace-nowrap'>Dr. {doctor?.name}</p>
                </div>
                <div className='flex gap-2'>
                    <Image 
                        src='/assets/icons/calendar.svg'
                        width={24}
                        height={24}
                        alt='calendar'
                    />
                    <p>{formatDateTime(appointment.schedule).dateTime}</p>
                </div>
            </section>

            <DashboardButton userId={userId} />

            <p className='copyright'>© 2024 CarePulse</p>
        </div>
    </div>
    </ProtectedPage>
  )
}

export default Success