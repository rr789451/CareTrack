import {DataTable} from '@/components/table/DataTable'
import StatCard from '@/components/StatCard'
import { getRecentAppointmentList } from '@/lib/actions/appointment.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {columns, doctorColumns} from '@/components/table/Columns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
//import { Button } from '@/components/ui/button'
import { getRecentDoctorList } from '@/lib/actions/doctor.actions'
import DoctorModal from '@/components/DoctorModal'

const Admin = async () => {

  const appointments = await getRecentAppointmentList();
  const doctors = await getRecentDoctorList();

  return (
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
            <p className='text-16-semibold'>Admin Dashboard</p>
        </header>

        <Tabs defaultValue="appointment">
            <TabsList className='grid max-w-[800px] grid-cols-2 mx-auto gap-4 mb-8 bg-dark-200 text-white-500'>
                <TabsTrigger value="appointment" className='data-[state=active]:text-white data-[state=active]:bg-green-500'>Appointment</TabsTrigger>
                <TabsTrigger value="doctor" className='data-[state=active]:text-white data-[state=active]:bg-green-500'>Doctors</TabsTrigger>
            </TabsList>
            <TabsContent value="appointment">
                <main className='admin-main'>
                    <section className='w-full space-y-4'>
                        <h1 className='header'>Welcome 👋</h1>
                        <p className='text-dark-700'>Time to manage appointments! Edit or delete them with a flick of your wand.</p>
                    </section>

                    <section className='admin-stat'>
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

                    <DataTable columns={columns} data={appointments.documents} />
                </main>
            </TabsContent>
            <TabsContent value="doctor">
            <main className='admin-main'>
                    <section className='w-full space-y-4'>
                        <h1 className='header'>Welcome 👋</h1>
                        <p className='text-dark-700'>Time to play doctor! Edit or delete their info with a flick of your wand.</p>
                        {/* <Button className='bg-green-500 text-white max-w-[400px] py-4 px-12 rounded-md hover:bg-green-500'>
                            Add Doctor
                        </Button> */}
                        <DoctorModal type="create" />
                    </section>

                    <section className='admin-stat'>
                        <StatCard 
                            type='available'
                            count={doctors.availableCount}
                            label='Available Doctors'
                            icon='/assets/icons/available.svg'
                        />

                        
                        <StatCard 
                            type='leave'
                            count={doctors.leaveCount}
                            label='Doctors on Leave'
                            icon='/assets/icons/leave.svg'
                        />
                    </section>

                    <DataTable columns={doctorColumns} data={doctors.documents} />
                </main>
            </TabsContent>
        </Tabs>

    </div>
  )
}

export default Admin