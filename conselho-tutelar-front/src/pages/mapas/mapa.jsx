// src/components/Mapa.jsx

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// CSS da Leaflet
import 'leaflet/dist/leaflet.css'; 

// Nosso CSS customizado para o layout de página inteira
import './mapacss.css';

// Fix para ícones do Marker no Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Mapa = () => {
    // As coordenadas de Panambi continuam no centro
    const position = [-28.2916, -53.5014];

    useEffect(() => {
        // Garantir que os ícones estejam configurados
        L.Marker.prototype.options.icon = DefaultIcon;
    }, []);

    return (
        // Este div é o nosso contêiner de página inteira
        <div className="map-wrapper"> 
            <MapContainer 
                center={position} 
                zoom={13} 
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                    <Popup>
                        Estamos aqui! <br /> Panambi, RS.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default Mapa;