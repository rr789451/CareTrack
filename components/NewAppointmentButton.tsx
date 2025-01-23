'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const NewAppointmentButton = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleNewAppointment = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push(`/patients/${userId}/new-appointment`);
    }, 1500);
  };

  return (
    <Button
      onClick={handleNewAppointment}
      disabled={isLoading}
      className={`bg-green-500 text-white max-w-[400px] py-4 px-12 mt-4 rounded-md transition duration-300 ${
        isLoading ? 'cursor-not-allowed opacity-70' : 'hover:bg-green-500'
      }`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-4 border-white border-t-green-500 rounded-full animate-spin"></div>
          Loading...
        </div>
      ) : (
        'New Appointment'
      )}
    </Button>
  );
};

export default NewAppointmentButton;
