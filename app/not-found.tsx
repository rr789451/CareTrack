'use client';

import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
    const [redirectPath, setRedirectPath] = useState('/');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const sessionData = Cookies.get('userSession');
        if (sessionData) {
            const { userId } = JSON.parse(sessionData);
            setRedirectPath(`/patients/${userId}/history`);
        } else {
            setRedirectPath('/');
        }
    }, []);

    const handleRedirect = () => {
        setIsLoading(true);
        router.push(redirectPath);
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-900">
            <Image 
                src="/assets/images/404.png" 
                alt="Lost"
                layout="fixed"
                width={1920}
                height={1080}
                className="absolute inset-0 w-full h-full z-0"
            />

            <div className="absolute inset-0 bg-black bg-opacity-70 z-10"></div>

            <div className="relative z-20 text-center text-white">
            <h1 className="text-9xl font-bold text-green-500 mb-4">404</h1>
            <p className="text-2xl font-medium text-black-600 mb-6">
                Oops! Looks like you took a wrong turn.
            </p>
            <p className="text-lg text-black-500 mb-8">
                Don&apos;t worry, even the best explorers get lost sometimes.
            </p>
            {isLoading ? (
                    <div className="flex justify-center items-center">
                        <div className="w-12 h-12 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <Button
                        onClick={handleRedirect}
                        className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
                    >
                        {redirectPath === '/' ? 'Take Me to Login' : 'Go Back to My History'}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default NotFoundPage;