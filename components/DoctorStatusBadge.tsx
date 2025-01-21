import clsx from "clsx";
import Image from "next/image";
import { StatusIcon } from "@/constants";

export const DoctorStatusBadge = ({ status }: { status: DoctorStatus }) => {
  return (
    <div
      className={clsx("status-badge", {
        "bg-green-600": status === "available",
        "bg-blue-600": status === "leave",
      })}
    >
      <Image
        src={StatusIcon[status]}
        alt="doctor"
        width={24}
        height={24}
        className="h-fit w-3"
      />
      <p
        className={clsx("text-12-semibold capitalize", {
          "text-green-500": status === "available",
          "text-blue-500": status === "leave",
        })}
      >
        {status}
      </p>
    </div>
  );
};