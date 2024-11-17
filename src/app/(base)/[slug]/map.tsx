'use client';

import GoongMap from '@/components/goong-map';
import { convertToDMS } from '@/lib/utils';
import { useEffect, useState } from 'react';

const Map = ({ latitude, longitude }: { latitude: number; longitude: number }) => {
    const [viewport, setViewport] = useState({
        latitude,
        longitude,
        zoom: 15,
    });
    const dms = convertToDMS(latitude, longitude);

    useEffect(() => {
        setViewport({
            latitude,
            longitude,
            zoom: 15,
        });
    }, [latitude, longitude]);

    return (
        <div className="relative w-full aspect-video mb-10">
            <GoongMap setViewport={setViewport} viewport={viewport} marker={[longitude, latitude]} />
            <div className="absolute top-0 left-0 p-4 bg-white bg-opacity-80">
                <div className="flex items-center">
                    <span className="text-lg font-semibold">{dms.latitude}</span>
                    <span className="mx-2">-</span>
                    <span className="text-lg font-semibold">{dms.longitude}</span>
                </div>
                <a
                    target="_blank"
                    className="text-antd-primary"
                    href={`https://www.google.com/maps/place/${dms.latitude}+${dms.longitude}`}
                >
                    Xem trên bản đồ lớn
                </a>
            </div>
        </div>
    );
};

export default Map;
