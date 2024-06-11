import axios from 'axios';
import { useEffect, useState } from 'react';

type Collection = {
  id: number;
  name: string;
}

const Collections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get('/ap/v1');
        setCollections(response.data);
      } catch (err) {
        console.error('Error fetching collections: ', err)
      }
    }
    fetchCollections();
  }, []);

  return (
    <div>
      <h1>Collections</h1>
      <ul>
        { (collections.length > 0) &&
          collections.map((collection) => {
            {/* NOTE:  make this its own item component displaying all user data*/}
            return <li key={collection.id}>{collection.name}</li>
          })
        }
      </ul>
    </div>
  );
};

export default Collections;
