export default function handler(req, res) {
  const collections = [
    { id: 1, name: 'posts' },
    { id: 2, name: 'users' },
    { id: 3, name: 'comments' },
  ];

  res.status(200).json(collections);
}