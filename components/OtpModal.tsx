'use client'

import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
  
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getPatient, verifyOtp } from '@/lib/actions/patient.actions';
import Cookies from 'js-cookie'
  
const OtpModal = ({ data }: { data: { phone: string; userId: string; email: string } }) => {

  const router = useRouter();

  const [open, setOpen] = useState(true);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const validateOtp = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
        const otpData = await verifyOtp(data.email, otp, data.userId);
        if(otpData){
            const patient = await getPatient(data.userId)

            Cookies.set('userSession', JSON.stringify({
                userId: data.userId,
                email: data.email
            }), { expires: 3 });

            if(patient){
                router.push(`/patients/${data.userId}/history`);
            } else {
                router.push(`/patients/${data.userId}/register`);
            }
        }
    } catch (error) {
        setError(String(error));
        setIsLoggingIn(false);
    }
    
  }

  const closeModal = () => {
    setOpen(false);
    router.push('/');
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className='shad-alert-dialog'>
            <AlertDialogHeader>
            <AlertDialogTitle className='flex items-start justify-between'>
                OTP Verification
                <Image 
                    src="/assets/icons/close.svg"
                    height={20}
                    width={20}
                    alt='close'
                    onClick={() => closeModal()}
                    className='cursor-pointer'
                />
            </AlertDialogTitle>
            <AlertDialogDescription>
                Please enter the OTP sent to <b>{data.phone}</b>
            </AlertDialogDescription>
            </AlertDialogHeader>
                <div>
                    <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)} >
                        <InputOTPGroup className='shad-otp'>
                            <InputOTPSlot className='shad-otp-slot' index={0} />
                            <InputOTPSlot className='shad-otp-slot' index={1} />
                            <InputOTPSlot className='shad-otp-slot' index={2} />
                            <InputOTPSlot className='shad-otp-slot' index={3} />
                            <InputOTPSlot className='shad-otp-slot' index={4} />
                            <InputOTPSlot className='shad-otp-slot' index={5} />
                        </InputOTPGroup>
                    </InputOTP>

                    {error && <p className='shad-error text-14-regular mt-4 flex justify-center'>{error}</p>}
                </div>
            <AlertDialogFooter>
            <AlertDialogAction 
                onClick={(e) => validateOtp(e)} 
                className={`shad-primary-btn w-full transition duration-300 ${isLoggingIn ? 'cursor-not-allowed opacity-70' : 'hover:bg-green-500'}`}
                disabled={isLoggingIn}
            >
                {isLoggingIn ? (
                    <div className="flex justify-center items-center">
                        <div className="w-5 h-5 border-4 border-white border-t-green-500 rounded-full animate-spin mr-2"></div>
                        Logging in...
                    </div>
                ) : (
                    'Continue'
                )}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default OtpModal