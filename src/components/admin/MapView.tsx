import React, { useEffect, useRef } from 'react';

type MapViewProps = {
    addressName: string;
    latitude: number;
    longitude: number;
};

let isScriptLoaded = false; // <-- флаг

const MapView: React.FC<MapViewProps> = ({ addressName, latitude, longitude }) => {
    const mapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const initMap = () => {
            if (!mapRef.current) return;

            // @ts-ignore
            const map = new window.ymaps.Map(mapRef.current, {
                center: [latitude, longitude],
                zoom: 13,
            });

            // @ts-ignore
            const placemark = new window.ymaps.Placemark([latitude, longitude], {
                balloonContent: addressName,
            });

            map.geoObjects.add(placemark);
        };

        if (!isScriptLoaded) {
            const script = document.createElement('script');
            script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
            script.type = 'text/javascript';
            script.onload = () => {
                // @ts-ignore
                window.ymaps.ready(() => {
                    initMap();
                });
            };
            document.body.appendChild(script);
            isScriptLoaded = true;
        } else {
            // @ts-ignore
            if (window.ymaps) {
                // @ts-ignore
                window.ymaps.ready(() => {
                    initMap();
                });
            }
        }
    }, [latitude, longitude, addressName]);

    return <div ref={mapRef} style={{ width: '100%', height: '220px' }} />;
};

export default MapView;
