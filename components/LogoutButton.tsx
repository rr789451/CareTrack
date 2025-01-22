"use client"

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export const LogoutButton = () => {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('accessKey')
    router.push('/')
  }

  return (
    <Button 
      onClick={handleLogout}
      className='bg-green-500 text-white max-w-[400px] py-4 px-12 rounded-md hover:bg-green-500'
    >
      Logout
    </Button>
  )
}