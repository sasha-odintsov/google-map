import './index.css';
import { useState } from 'react';
import { Wrapper } from "@googlemaps/react-wrapper";
import { MapDirections } from './MapDirections';
import { SelectInput } from './SelectInput'; 

function App() {
  const [travelMode, setTravelMode] = useState('Driving');
  const travelModes = ['Driving', 'Transit', 'Walking', 'Bicycling']

  return (
    <div>
      <div className='p-3'>
        <SelectInput 
          options={travelModes} 
          onChange={(e) => setTravelMode(e.target.value)} 
          value={travelMode}
        />
      </div>
      <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}>
        <MapDirections travelMode={travelMode.toUpperCase()} />
      </Wrapper>
    </div>
  );
}

export default App;
