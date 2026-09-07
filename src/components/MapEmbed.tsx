'use client';

import { MapContainer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@maplibre/maplibre-gl-leaflet';
import { setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

setWorkerUrl(workerUrl);

// Fix default marker icons broken by Vite/webpack bundling
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Available map styles to try
export const MAP_STYLES = {
    // Bright, clean style similar to Carto's voyager
    positron: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    // Dark style
    voyager: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
    // Light alternative
    light: 'https://demotiles.maplibre.org/style.json',
    // Dark alternative
    dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
} as const;

type MapStyleKey = keyof typeof MAP_STYLES;

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x.src ?? markerIcon2x,
    iconUrl: markerIcon.src ?? markerIcon,
    shadowUrl: markerShadow.src ?? markerShadow,
});

// MapLibre GL vector tiles layer
function VectorTileLayer({ style = 'voyager' }: { style?: MapStyleKey }) {
    const map = useMap();
    useEffect(() => {
        const styleUrl = MAP_STYLES[style];
        const glLayer = L.maplibreGL({
            style: styleUrl,
        });
        glLayer.addTo(map);
        return () => {
            map.removeLayer(glLayer);
        };
    }, [map, style]);
    return null;
}

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
                <VectorTileLayer />
                <Marker position={position}>
                    <Popup>{destination}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
