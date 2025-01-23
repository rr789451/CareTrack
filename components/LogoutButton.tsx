"use client"

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useState } from 'react'

export const LogoutButton = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    setIsLoggingOut(true);
    Cookies.remove('userSession');

    setTimeout(() => {
      router.push('/');
    }, 1500);
  }

  return (
    <Button 
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`bg-green-500 text-white max-w-[400px] py-4 px-12 rounded-md transition duration-300 ${
        isLoggingOut ? 'cursor-not-allowed opacity-70' : 'hover:bg-green-500'
      }`}
    >
      {isLoggingOut ? (
        <div className="flex justify-center items-center">
          <div className="w-5 h-5 border-4 border-white border-t-green-500 rounded-full animate-spin mr-2"></div>
          Logging out...
        </div>
        ) : ('Logout')}
    </Button>
  )
}