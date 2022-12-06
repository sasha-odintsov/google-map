import { useEffect, useRef} from 'react';

export const MapDirections = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    const infoWindow = new window.google.maps.InfoWindow();

    const map = new window.google.maps.Map(
      mapRef.current,
      {
        zoom: 7,
        center: { lat: 41.85, lng: -87.65 },
      }
    );
  
    directionsRenderer.setMap(map);

    directionsService
    .route({
      origin: {
        lat: 50.463454856826836, lng: 30.591131254879016
      },
      destination: {
        lat: 50.45945864721699, lng: 30.51797107159085
      },
      travelMode: window.google.maps.TravelMode.DRIVING,
    })
    .then((response) => {
      console.log(response)
      const steps = Math.floor(response.routes[0].legs[0].steps.length / 3)
      infoWindow.setContent(
        "<span class='fw-bold fs-6'>" 
        + response.routes[0].legs[0].duration.text + 
        "</span>" + "<br>" + 
        "<span class='fs-lg'>" 
        + response.routes[0].legs[0].distance.text + 
        "</span>"
      );
      infoWindow.setPosition(response.routes[0].legs[0].steps[steps].end_location);
      infoWindow.open(map);

      directionsRenderer.setDirections(response);
    })
    .catch((e) => console.log(e));
  })

  return (
    <div ref={mapRef} id='map' style={{width: 800, height: 600}}></div>
  );
}