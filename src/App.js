import { Wrapper } from "@googlemaps/react-wrapper";
import { MapDirections } from './MapDirections'; 

function App() {
  return (
    <div>
      <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}>
        <MapDirections />
      </Wrapper>
      <p>Map</p>
    </div>
  );
}

export default App;
