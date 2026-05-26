'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons broken by Vite/webpack bundling
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x.src ?? markerIcon2x,
    iconUrl: markerIcon.src ?? markerIcon,
    shadowUrl: markerShadow.src ?? markerShadow,
});

interface MapEmbedProps {
    lat: number;
    lng: number;
    destination: string;
    zoom?: number;
}

export default function MapEmbed({ lat, lng, destination, zoom = 10 }: MapEmbedProps) {
    const position: LatLngExpression = [lat, lng];

    return (
        <div className="rounded-xl overflow-hidden border border-border shadow-sm my-8">
            <div className="bg-muted/50 px-4 py-2 border-b border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                    📍 {destination}
                </p>
            </div>
            <MapContainer
                center={position}
                zoom={zoom}
                scrollWheelZoom={false}
                style={{ height: '380px', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <Marker position={position}>
                    <Popup>{destination}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
