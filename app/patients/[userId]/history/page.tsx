import StatCard from '@/components/StatCard'
import { getIndividualAppointmentList } from '@/lib/actions/appointment.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { getRecentDoctorList } from '@/lib/actions/doctor.actions'
import { LogoutButton } from '@/components/LogoutButton'
import { PatientTable } from '@/components/table/PatientTable'
import { getUser } from '@/lib/actions/patient.actions'
import ProtectedPage from '@/components/ProtectedPage'
import { notFound } from 'next/navigation'
import NewAppointmentButton from '@/components/NewAppointmentButton'

const History = async ({ params }: { params: { userId: string } }) => {
  const { userId } = params;
  const appointments = await getIndividualAppointmentList(userId);
  const user = await getUser(userId);
  const doctors = await getRecentDoctorList();

  if (!user) {
    notFound();
  }

  return (
    <ProtectedPage>
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
        <header className='admin-header'>
            <Link href="/" className='cursor-pointer'>
                <Image 
                    src="/assets/icons/logo-full.svg"
                    height={32}
                    width={162}
                    alt='Logo'
                    className='h-8 w-fit'
                />
            </Link>
            <p className='text-16-semibold cursor-default'>Patient Dashboard</p>
            <LogoutButton />
        </header>
        <main className='admin-main'>
            <section className='w-full space-y-4'>
                <p className='text-dark-700'>Welcome ,</p>
                <h1 className='header'>{user.name}👋</h1>
                <p className='text-dark-700'>Time to manage appointments! Edit or Cancel them with a flick of your wand.</p>
                <NewAppointmentButton userId={userId} />
            </section>

            <section className='admin-stat'>
                <StatCard 
                    type='completed'
                    count={appointments.completeCount}
                    label='Completed Appointments'
                    icon='/assets/icons/check.svg'
                />

                <StatCard 
                    type='appointments'
                    count={appointments.scheduledCount}
                    label='Scheduled Appointments'
                    icon='/assets/icons/appointments.svg'
                />

                
                <StatCard 
                    type='pending'
                    count={appointments.pendingCount}
                    label='Pending Appointments'
                    icon='/assets/icons/pending.svg'
                />

                
                <StatCard 
                    type='cancelled'
                    count={appointments.cancelledCount}
                    label='Cancelled Appointments'
                    icon='/assets/icons/cancelled.svg'
                />
            </section>

            <PatientTable appointments={appointments.documents} doctors={doctors.documents} />
        </main>
    </div>
    </ProtectedPage>
  )
}

export default History