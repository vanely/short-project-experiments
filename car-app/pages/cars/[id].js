import { useRouter } from 'next/router';
import Head from 'next/head';

export async function getStaticProps({ params }) {
	try {
		console.log(`Fetching data for car with id: ${params.id}`);
		const res = await fetch(`http://localhost:3000/${params.id}.json`);
		if (!res.ok) {
			throw new Error(`Failed to fetch data for car with id ${params.id}`);
		}
		const data = await res.json();
		console.log('Data fetched for car:', data);
		return {
			props: { car: data },
		};
	} catch (error) {
		console.error('Failed to fetch car data:', error);
		return {
			props: { car: null }, // Return null car if fetch fails
		};
	}
}

export async function getStaticPaths() {
	try {
		console.log('Fetching car paths');
		const res = await fetch('http://localhost:3000/cars.json');
		if (!res.ok) {
			throw new Error('Failed to fetch cars list');
		}
		const data = await res.json();
		console.log('Car paths fetched:', data);

		const paths = data.map((car) => ({ params: { id: car.id } }));

		return {
			paths,
			fallback: false,
		};
	} catch (error) {
		console.error('Failed to fetch paths:', error);
		return {
			paths: [],
			fallback: false,
		};
	}
}

function Car({ car }) {
	const router = useRouter();
	const { id } = router.query;

	if (!car) {
		return <h1>Car data is not available</h1>;
	}

	return (
		<>
			<Head>
				<title>{car.color} {car.id}</title>
			</Head>
			<h1>The car you've chosen is {id}</h1>
			<img src={car.image} alt={`${car.color} ${car.id}`} />
		</>
	);
}

export default Car;