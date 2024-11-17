export const HeartFill = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
    </svg>
);

export const Heart = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={className}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
    </svg>
);

export const Report = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        // className="icon icon-tabler icons-tabler-outline icon-tabler-urgent"
        className={className}
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M8 16v-4a4 4 0 0 1 8 0v4" />
        <path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" />
        <path d="M6 16m0 1a1 1 0 0 1 1 -1h10a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1z" />
    </svg>
);

export const Contract = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={200} height={200} viewBox="0 0 24 24" className={className}>
        <path
            fill="currentColor"
            d="M9.385 8.385v-1h8.23v1h-8.23Zm0 2.769v-1h8.23v1h-8.23ZM11.846 20H5h6.846Zm0 1H6q-.846 0-1.423-.577Q4 19.846 4 19v-2.77h3V3h13v7.89q-.27.008-.513.057q-.243.05-.487.14V4H8v12.23h5.346l-1 1H5V19q0 .425.288.713T6 20h5.846v1Zm2.385 0v-2.21l5.332-5.307q.149-.148.308-.2q.16-.052.32-.052q.165 0 .334.064t.298.193l.925.945q.123.148.188.307q.064.16.064.32t-.062.322q-.061.162-.19.31L16.44 21h-2.21Zm6.884-5.94l-.925-.945l.925.945Zm-6 5.055h.95l3.468-3.473l-.47-.475l-.455-.488l-3.493 3.486v.95Zm3.948-3.948l-.455-.488l.925.963l-.47-.475Z"
        />
    </svg>
);

const pinStyle = {
    fill: '#d00',
    stroke: 'none',
};

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

export const Pin = ({ size = 20, className }: { size?: number; className?: string }) => (
    <svg height={size} viewBox="0 0 24 24" style={pinStyle} className={className}>
        <path d={ICON} />
    </svg>
);
