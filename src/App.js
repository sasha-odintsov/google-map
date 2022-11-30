import './App.css';
import { Wrapper } from "@googlemaps/react-wrapper";
import { useState, useEffect, useRef} from 'react';
import { MapDirections } from './MapDirections'; 

function App() {


//AIzaSyAcCoCgENhpjHTn9A6j2fuQoRgfr2lVRHQ
  return (
    <div>
      <Wrapper apiKey={""}>
        <MapDirections />
      </Wrapper>
      <p>Map</p>
    </div>
  );
}

export default App;
