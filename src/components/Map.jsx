import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const Map = ({ address, city, state }) => {
  const markerSize = 40;
  const marker =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.817 54.719" height="100%" style="display:block;margin:0 auto"><path d="M16.953 54.72c-1.252-6.15-3.461-11.267-6.136-16.01-1.984-3.517-4.282-6.764-6.41-10.176-.71-1.139-1.322-2.342-2.004-3.524-1.364-2.363-2.47-5.103-2.4-8.657.069-3.473 1.073-6.258 2.521-8.536C4.906 4.071 8.896 1 14.25.192c4.377-.66 8.481.456 11.391 2.157 2.378 1.39 4.22 3.249 5.62 5.438 1.461 2.285 2.467 4.984 2.552 8.505a15.717 15.717 0 01-.669 4.86c-.42 1.403-1.098 2.576-1.7 3.828-1.177 2.445-2.652 4.685-4.132 6.926-4.409 6.676-8.547 13.484-10.359 22.813z"/><circle cx="16.908" cy="16.315" r="5.924"/></svg>';
  const markers = () =>
    new L.divIcon({
      html: marker,
      className: "fill-sk-19",
      iconSize: [markerSize, markerSize],
      iconAnchor: [markerSize / 2, markerSize],
    });
  const position = [34.057235, -118.241043];

  return (
    <MapContainer
      zoomControl={false}
      className="h-[250px] w-full rounded-lg"
      dragging={false}
      minZoom={17}
      maxZoom={17}
      zoom={17}
      center={position}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        className="customLayerDark"
      />
      <Marker position={position} icon={markers()}>
        <Popup>
          {address}, {city}, {state}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
