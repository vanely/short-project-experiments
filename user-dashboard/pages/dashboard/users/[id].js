import { useRouter } from 'next/router';
import withAuth from '../../../lib/withAuth';

const UserDetail = () => {
	const router = useRouter();
	const { id } = router.query;

	const user = {
		1: { name: 'User One', details: 'Details about User One' },
		2: { name: 'User Two', details: 'Details about User Two' },
		3: { name: 'User Three', details: 'Details about User Three' },
	}[id];

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

export default UserDetail;
