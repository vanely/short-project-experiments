export default function handler(req, res) {
	const collections = [
		{ id: 1, name: 'Collection One' },
		{ id: 2, name: 'Collection Two' },
		{ id: 3, name: 'Collection Three' },
	];

	res.status(200).json(collections);
}