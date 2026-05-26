'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { LatLngExpression, Map as LeafletMap } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons broken by Vite/webpack bundling
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x.src ?? markerIcon2x,
    iconUrl: markerIcon.src ?? markerIcon,
    shadowUrl: markerShadow.src ?? markerShadow,
});

// A custom red pin icon to differentiate from the per-post map pins
function createPinIcon() {
    return L.divIcon({
        className: '',
        html: 
            `<div style="
                width: 28px;
                height: 28px;
                background: hsl(0 84% 60%);
                border: 3px solid white;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 2px 8px rgba(0,0,0,0.35);
            "></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -32],
    });
}

export interface TravelPin {
    lat: number;
    lng: number;
    destination: string;
    postTitle: string;
    postSlug: string;
    heroImage?: string;
}

interface TravelMapProps {
    pins: TravelPin[];
}

// Fits the map to show all markers with padding
function FitBounds({ pins }: { pins: TravelPin[] }) {
    const map = useMap();
    useEffect(() => {
        if (pins.length === 0) return;
        if (pins.length === 1) {
            map.setView([pins[0]!.lat, pins[0]!.lng], 5);
            return;
        }
        const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng]));
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 6 });
    }, [map, pins]);
    return null;
}

export default function TravelMap({ pins }: TravelMapProps) {
    const pinIcon = useRef<L.DivIcon | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        pinIcon.current = createPinIcon();
        setReady(true);
    }, []);

    if (!ready) return null;

    return (
        <MapContainer
            center={[20, 10]}
            zoom={2}
            scrollWheelZoom={false}
            style={{ height: '520px', width: '100%' }}
            worldCopyJump={true}
            minZoom={2}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            <FitBounds pins={pins} />

            {pins.map((pin) => (
                <Marker
                    key={pin.postSlug}
                    position={[pin.lat, pin.lng] as LatLngExpression}
                    icon={pinIcon.current!}
                >
                    <Popup maxWidth={220} className="travel-map-popup">
                        <div className="flex flex-col gap-2 p-0.5">
                            {pin.heroImage && (
                                <img
                                    src={pin.heroImage}
                                    alt={pin.destination}
                                    className="w-full rounded object-cover"
                                    style={{ height: '100px' }}
                                    loading="lazy"
                                />
                            )}
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-0.5">
                                    📍 {pin.destination}
                                </p>
                                <p className="font-semibold text-sm leading-snug">{pin.postTitle}</p>
                            </div>
                            <a
                                href={`/blog/${pin.postSlug}`}
                                className="mt-1 inline-block text-xs font-semibold underline underline-offset-2 text-blue-600 hover:text-blue-800"
                            >
                                Read post →
                            </a>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
