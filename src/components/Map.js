import React from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import "./Map.css";
import { showDataOnMap } from "./util";

const Map = (props) => {
    console.log(props.countries);
    return (
    <div className="map">
      <LeafletMap center={props.center} zoom={props.zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showDataOnMap(props.countries, props.casesType)}
      </LeafletMap>
    </div>
  );
}

export default Map;
