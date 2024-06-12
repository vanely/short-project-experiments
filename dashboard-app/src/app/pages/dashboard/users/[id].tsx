import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

// NOTE: figure out how to use this
// import { useAuth, useAuth0, useUser, useSession } from '@auth0/nextjs-auth0';
// import { useQuery, useQueryClient } from 'react-query';
import WithAuth from '@/app/lib/withAuth';

interface User {
  name: string;
  details: string;
}

interface UsersById {
  [key: string | number]: ReactNode;
}

const UserDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  // NOTE: figure out this type, the above UsersById is an attempt at this.
  const user: any = {
    1: { name: 'User One', details: 'Details about User One' },
    2: { name: 'User Two', details: 'Details about User Two' },
    3: { name: 'User Three', details: 'Details about User Three' },
  }
  console.log("type of User: ", typeof user);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.details}</p>
    </div>  
  );
};

export default WithAuth(UserDetails);
