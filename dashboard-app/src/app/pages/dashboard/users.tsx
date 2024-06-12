import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// NOTE:  find what's happening with this import(why?)
import WithAuth from '@/app/lib/withAuth';

const Users = () => {
  // NOTE: mofify this and create a type for it that reflects the mock API data model
  const [users, setUsers] = useState([
    { id: 1, name: 'User One'},
    { id: 2, name: 'User Two'},
    { id: 3, name: 'User Three'},
  ]);

  const router = useRouter();

  const handleUserClick = (id: number) => {
    router.push(`/dashboard/users/${id}`);
  };

  return (
    <div>
      <h1>Users</h1>
      <ul>
        { (users.length > 0) &&
          users.map((user) => (
            <li key={user.id} onClick={() => handleUserClick(user.id)}>
              {user.name}
            </li>
          ))
        }
      </ul>
    </div>
  );
};

export default WithAuth(Users);
