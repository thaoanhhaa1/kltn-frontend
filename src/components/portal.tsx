import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const Portal = ({ children }: { children: React.ReactNode }) => {
    const portalRoot = useRef(document.createElement('div'));

    useEffect(() => {
        const current = portalRoot.current;
        document.body.appendChild(current);
        return () => {
            document.body.removeChild(current);
        };
    }, []);

    return ReactDOM.createPortal(children, portalRoot.current);
};

export default Portal;
