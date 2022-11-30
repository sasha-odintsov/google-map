import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import useDataEntry from "../../../../services/hooks/useDataEntry";
import Modal from "../../../../ui/Modal";
import classNames from "classnames";
import { getModal, closeModal } from "../../../../store/features/tempSlice";
import Button from "../../../../ui/Button";
import SelectInput from "../../../../ui/form/SelectInput";
import LabelText from "../../../../ui/form/LabelText";
import {
  toOptions,
  getSelectedValue,
} from "../../../../services/constants/dropdown";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Geocode from "react-geocode";
// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY);
// set response language. Defaults to english.
Geocode.setLanguage("en");

const MapDirections = ({ center, zoom, origin, destination, travelMode }) => {
  const refMap = useRef(null);
  // const refPanel = useRef(null);

  useEffect(() => {
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    const directionsService = new window.google.maps.DirectionsService();
    const trafficLayer = new window.google.maps.TrafficLayer();
    const infoWindow = new window.google.maps.InfoWindow();

    const map = new window.google.maps.Map(refMap.current, {
      center,
      zoom,
      disableDefaultUI: true,
      disableDoubleClickZoom: true,
    });

    directionsRenderer.setMap(map);
    directionsRenderer.setOptions({
      polylineOptions: {
        strokeColor: "#E44262",
      },
    });
    // directionsRenderer.setPanel(refPanel.current);
    directionsService
      .route({
        origin,
        destination,
        travelMode,
        drivingOptions: {
          departureTime: new Date(Date.now()),
          trafficModel: 'pessimistic'
        },
        unitSystem: window.google.maps.UnitSystem.IMPERIAL
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
      .catch((err) => console.error(err));
  });

  return (
    <>
      <div ref={refMap} id="map" className="h-500px" />
      {/* <div ref={refPanel} id="map-panel" /> */}
    </>
  );
};

const MapDirectionsModal = (props) => {
  const dispatch = useDispatch();
  const { patientsExt, locationsExt } = useDataEntry();
  const { isOpen, data } = useSelector((state) =>
    getModal(state, "mapDirections")
  );
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [travelMode, setTravelMode] = useState("DRIVING");

  const travelModes = {
    DRIVING: "Car",
    TRANSIT: "Bus/Metro",
    BICYCLING: "Bicycle",
    WALKING: "Walk",
  };

  const onClose = () => dispatch(closeModal("mapDirections"));

  const getPatientAddress = (patientId) =>
    patientsExt[patientId]?.address || "";
  const getLocationAddress = (locationId) =>
    Object.values(locationsExt[locationId]?.address || {}).join(" ");

  const getLatLngFromAddress = async (address) => {
    let Lat;
    let Lng;

    await Geocode.fromAddress(address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;

        Lat = lat;
        Lng = lng;
      },
      (error) => console.error(error)
    );

    return { lat: Lat, lng: Lng };
  };

  const initLatLng = () => {
    Promise.allSettled([
      getLatLngFromAddress(getPatientAddress(data.patientId)),
      getLatLngFromAddress(getLocationAddress(data.locationId)),
    ]).then((results) => {
      console.log(results);

      setOrigin(results[0].value);
      setDestination(results[1].value);
      // setOrigin('киев каховская 60');
      // setDestination('левобережная');
    });
  };

  useEffect(() => {
    if (isOpen && data) {
      initLatLng();
    }
  }, [isOpen, data]);

  if (!isOpen) return "";

  return (
    <Modal
      title="Directions"
      variant="primary"
      isOpen={isOpen}
      onClose={onClose}
      width={1000}
    >
      <div className="m-n3">
        <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}>
          {origin && destination && (
            <MapDirections
              origin={origin}
              destination={destination}
              travelMode={travelMode}
              center={origin}
              zoom={14}
            />
          )}
        </Wrapper>
        <div className="d-flex align-items-center justify-content-end border-top border-primary p-3">
          <LabelText text="Travel Mode" paddingbottom={0} />
          <SelectInput
            options={toOptions(travelModes)}
            onChange={({ value }) => setTravelMode(value)}
            value={getSelectedValue(travelModes, travelMode)}
            className="me-auto ms-2"
          />
          <Button
            text="Close"
            iconName="x"
            className="w-125px"
            onClick={onClose}
          />
        </div>
      </div>
    </Modal>
  );
};

export default MapDirectionsModal;
