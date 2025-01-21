"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { Doctor } from "@/types/appwrite.types"
import { DoctorStatusBadge } from "../DoctorStatusBadge"
import DoctorModal from "../DoctorModal"

export const doctorColumns: ColumnDef<Doctor>[] = [
  {
    header: 'ID',
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>
  },
  {
    accessorKey: "doctor",
    header: "Doctor Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
            <Image 
                src={row.original.imageUrl || ''}
                alt={row.original.name || ''}
                width={100}
                height={100}
                className="size-8 rounded-md"
            />

            <p className="whitespace-nowrap">
                Dr. {row.original.name}
            </p>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
        <div className="min-w-[115px]">
            <DoctorStatusBadge status={row.original.status} />
        </div>
    )
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
        return (
            <div className="flex gap-1">
                <DoctorModal 
                    type="edit" 
                    doctor={data}
                />
                <DoctorModal 
                    type="delete" 
                    doctor={data}
                />
            </div>
        )
    },
    }, 
]
