import { cn } from '@/lib/utils';

const SkeletonRender = ({
    className = '',
    size = 3,
    vertical = false,
    controller,
}: {
    size?: number;
    className?: string;
    vertical?: boolean;
    controller: () => JSX.Element;
}) => {
    const Controller = controller;

    return (
        <div className={cn('flex', className, vertical ? 'flex-col' : '')}>
            {new Array(size).fill(0).map((_, index) => (
                <Controller key={index} />
            ))}
        </div>
    );
};

export default SkeletonRender;
