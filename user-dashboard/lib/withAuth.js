import { useEffect } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const isAuthenticated = false; // Replace with actual authentication logic

      if (!isAuthenticated) {
        router.push('/auth/login');
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;