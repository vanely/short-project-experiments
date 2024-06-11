import { useEffect } from 'react';
import { useRouter } from 'next/router';

// NOTE: come back and fix these any types when I have the context
const WithAuth = (WrappedComponent: any) => {
    return (props: any) => {
        const router = useRouter();

        useEffect(() => {
            const isAuthenticated = true; // NOTE: Replace with actual authentication logic

            if (!isAuthenticated) {
                router.push('/login');
            }
        }, []);

        return <WrappedComponent {...props} />;
    };
};

export default WithAuth;