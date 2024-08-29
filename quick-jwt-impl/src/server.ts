import app from './app';

const PORT = process.env.PORT || 3333;

// start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
