import { useEffect } from 'react';
import { useRouter } from 'next/router';


const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    
    // could use something like JWT, or Auth2.0 to assert user session
    useEffect(() => {
      // const verifyToken = async () => {
      //   try {
      //     const token = sessionStorage.getItem('token'); // Retrieve token from sessionStorage
      //     if (token) {
      //       const { data } = await axios.post('/api/auth/verify-token', { token });
      //       if (data.valid) {
      //         const userResponse = await axios.get('/api/auth/user', {
      //           headers: { Authorization: `Bearer ${token}` }
      //         });
      //         setUser(userResponse.data);
      //       }
      //     }
      //   } catch (error) {
      //     console.error('Token verification failed:', error);
      //   } finally {
      //     setLoading(false);
      //   }
      // };

      // verifyToken();
      const isAuthenticated = false;
      if (!isAuthenticated) {
        router.push('/auth/login')
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;