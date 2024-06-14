import { useEffect } from 'react';
import { useRouter } from 'next/router';


const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    
    // could use something like JWT, or Auth2.0 to assert user session
    useEffect(() => {
      const isAuthenticated = false;
      if (!isAuthenticated) {
        router.push('/auth/login')
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;