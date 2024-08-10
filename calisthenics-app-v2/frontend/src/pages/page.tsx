import { useState } from "react";
import Map from '../components/Map';
import CitySelector from '../components/CitySelector';

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  return (
    <div>
      <h1>Calisthenics Park Finder</h1>
      <CitySelector onCitySelect={setSelectedCity}/>
      {selectedCity && <Map city={selectedCity}/>}
    </div>
  );
}