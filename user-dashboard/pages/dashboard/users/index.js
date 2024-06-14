import { useState } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../../../lib/withAuth';
import styles from '../../../styles/Home.module.css';

const Users = () => {
	const [users] = useState([
		{ id: 1, name: 'User One' },
		{ id: 2, name: 'User Two' },
		{ id: 3, name: 'User Three' },
	]);

	const router = useRouter();

	const handleUserClick = (id) => {
		router.push(`/dashboard/users/${id}`);
	};

	return (
		<div>
			<h1 className={styles.title}>Users</h1>
			<ul className={styles.listText}>
				{users.map((user) => (
					<li className={styles.pointer} key={user.id} onClick={() => handleUserClick(user.id)}>
						{user.name}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Users;