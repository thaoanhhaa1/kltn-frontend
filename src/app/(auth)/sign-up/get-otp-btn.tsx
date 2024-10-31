import { ButtonLoading } from '@/components/ui/button';
import { envConfig } from '@/config/envConfig';
import { useState } from 'react';

const GetOTPBtn = ({
    timer = envConfig.NEXT_PUBLIC_OTP_EXPIRATION,
    onClick,
}: {
    timer?: number;
    onClick: () => Promise<boolean | undefined>;
}) => {
    const [timeLeft, setTimeLeft] = useState(timer);
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);

        const res = await onClick();

        setLoading(false);
        if (!res) {
            return;
        }

        setTimeLeft(timer);

        const id = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime === 0) {
                    clearInterval(id);
                    return timer;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    return (
        <ButtonLoading
            disabled={timeLeft < timer}
            loading={loading}
            type="button"
            onClick={handleClick}
            variant="secondary"
        >
            Lấy mã OTP ({timeLeft}s)
        </ButtonLoading>
    );
};

export default GetOTPBtn;
