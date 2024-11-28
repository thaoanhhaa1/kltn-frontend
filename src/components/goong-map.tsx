'use client';

import { IViewPort } from '@/app/owner/properties/add/basic-info-form';
import { Pin } from '@/assets/svgs/icons';
import { envConfig } from '@/config/envConfig';
import ReactMapGL, { MapEvent, Marker } from '@goongmaps/goong-map-react';
import { InteractiveMapProps } from '@goongmaps/goong-map-react/src/components/interactive-map';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { Dispatch, SetStateAction, useCallback } from 'react';

const GoongMap = ({
    viewport,
    setViewport,
    onChangeMarker,
    marker,
    setMarker,
    ...props
}: {
    marker?: [number, number] | null;
    setMarker?: Dispatch<SetStateAction<[number, number] | null>>;
    onChangeMarker?: (marker: [number, number]) => void;
    viewport?: IViewPort;
    setViewport?: Dispatch<SetStateAction<IViewPort>>;
} & InteractiveMapProps) => {
    const handleClickMap = useCallback(
        (e: MapEvent) => {
            const [lng, lat] = e.lngLat;
            console.log('🚀 ~ handleClickMap ~ lng, lat', lng, lat);

            setMarker && setMarker([lng, lat]);
            onChangeMarker && onChangeMarker([lng, lat]);
        },
        [onChangeMarker, setMarker],
    );

    const handleChangeViewport = useCallback(
        (newViewport: IViewPort) => {
            if (JSON.stringify(newViewport) !== JSON.stringify(viewport)) {
                setViewport && setViewport(newViewport);
            }
        },
        [setViewport, viewport],
    );

    return (
        <ErrorBoundary errorComponent={() => <div>Something went wrong</div>}>
            <ReactMapGL
                {...props}
                {...viewport}
                goongApiAccessToken={envConfig.NEXT_PUBLIC_GOONG_MAP_KEY}
                width="100%"
                height="100%"
                onViewportChange={handleChangeViewport}
                onClick={handleClickMap}
                scrollZoom
                doubleClickZoom
            >
                {marker && (
                    <Marker longitude={marker[0]} latitude={marker[1]} offsetTop={-20} offsetLeft={-10}>
                        <Pin size={20} />
                    </Marker>
                )}
            </ReactMapGL>
        </ErrorBoundary>
    );
};

export default GoongMap;
