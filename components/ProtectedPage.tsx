'use client'

import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const ProtectedPage = ( {children }: Readonly<{ children: React.ReactNode; }>) => {
    const [userSession, setUserSession] = useState<{ userId: string; } | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const sessionData = Cookies.get('userSession');
        if(sessionData){
        try {
            const parsedSession = JSON.parse(sessionData);
            setUserSession(parsedSession);

            const match = pathname.match(/^\/patients\/([^/]+)/);
            const urlUserId = match ? match[1] : null;

            if (urlUserId && urlUserId !== parsedSession.userId) {
                router.replace(`/patients/${parsedSession.userId}${pathname.replace(`/patients/${urlUserId}`, '')}`);
            } else if (!urlUserId) {
                router.push(`/patients/${parsedSession.userId}/history`);
            }
        } catch (error) {
            console.error('Session parsing error:', error);
            Cookies.remove('userSession');
            router.push('/404');
        }
    } else {
        router.push('/404');
    }
    }, [pathname, router]);    

    if (!userSession) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    if (userSession === undefined) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
            </div>
        )
    }
    
    return (
        <div>
            {userSession ? <>{children}</> : <p>Loading...</p>}
        </div>
    );
};

export default ProtectedPage;