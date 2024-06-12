import axios from 'axios';
import { useState, useEffect } from 'react';
import Link from 'next/link'
import styles from '../../../styles/Home.module.css';

function Collections() {

	const [collections, setCollections] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const getCollections = async () => {
			try {
				const res = await axios.get('/api/collections');
				console.log("response object: ", res);
				setCollections(res.data);
				console.log('collections: ', collections)
			} catch (err) {
				setError("Error getting collections")
				console.error("Error getting collections: ", err);
			} finally {
				setLoading(false);
			}
		}

		getCollections()
	}, [])

	if (loading) {
		return <div>loading...</div>
	}

	if (error) {
		return <div>{error}</div>
	}

	return (
		<>
			<h1 className={styles.title}>Collections</h1>
			<ul className={styles.listText}>
				{ collections.map((collection) => {
						return (
							<li className={styles.pointer} key={collection.id}>
								<Link href={`/dashboard/${collection.name}`}>{collection.name}</Link>
							</li>
						)	
					})
				}
			</ul>
		</>
	)
}

export default Collections;
