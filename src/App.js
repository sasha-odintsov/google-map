import './App.css';
import { Wrapper } from "@googlemaps/react-wrapper";
import { useState, useEffect, useRef} from 'react';
import { MapDirections } from './MapDirections'; 

function App() {
  return (
    <div>
      <Wrapper apiKey={process.env.GOOGLE_MAP_API_KEY}>
        <MapDirections />
      </Wrapper>
      <p>Map</p>
    </div>
  );
}

export default App;
