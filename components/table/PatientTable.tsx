"use client"

import { DataTable } from '@/components/table/DataTable'
import { Appointment, Doctor } from "@/types/appwrite.types"
import { ColumnDef } from "@tanstack/react-table"
import { StatusBadge } from "../StatusBadge"
import { formatDateTime } from "@/lib/utils"
import Image from "next/image"
import AppointmentModal from "../AppointmentModal"
import MapDialog from '../MapModal'

interface PatientTableProps {
  appointments: Appointment[]
  doctors: Doctor[]
}

const locationCoordinates: [number, number] = [17.399367866378135, 78.47926342216678];

const createColumns = (doctors: Doctor[]): ColumnDef<Appointment>[] => [
  {
    header: 'ID',
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => <p className="text-14-medium">{row.original.patient.name}</p>
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
        <div className="min-w-[115px]">
            <StatusBadge status={row.original.status} />
        </div>
    )
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => (
        <p className="text-14-regular min-w-[100px]">
            {formatDateTime(row.original.schedule).dateTime}
        </p>
    )
  },
  {
    accessorKey: "primaryPhysician",
    header: () => 'Doctor',
    cell: ({ row }) => {
      const doctor = doctors.find((doc) => doc.$id === row.original.doctor.$id)

      return (
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
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
        return (
            <div className="flex gap-1">
                <AppointmentModal 
                    type="edit" 
                    patientId={data.patient.$id}
                    userId={data.userId}
                    appointment={data}
                    disabled={data.status === 'scheduled' || data.status === 'completed' ? true : false}
                />
                <AppointmentModal 
                    type="cancel" 
                    patientId={data.patient.$id}
                    userId={data.userId}
                    appointment={data}
                    disabled={data.status === 'pending' || data.status === 'scheduled' ? false : true}
                />
                <MapDialog coordinates={locationCoordinates} />
            </div>
        )
    },
  }, 
]

export const PatientTable = ({ appointments, doctors }: PatientTableProps) => {
  return (
    <DataTable 
      columns={createColumns(doctors)} 
      data={appointments} 
    />
  )
}