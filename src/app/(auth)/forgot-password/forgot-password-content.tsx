'use client';

import StepOne from '@/app/(auth)/forgot-password/step-one';
import StepTwo from '@/app/(auth)/forgot-password/step-two';
import { Steps } from 'antd';
import { useState } from 'react';

const ForgotPasswordContent = () => {
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState('');

    return (
        <div>
            <Steps
                style={{
                    marginTop: '20px',
                }}
                size="small"
                current={0}
                items={[
                    {
                        title: 'Lấy mã xác nhận',
                        status: step === 0 ? 'process' : 'finish',
                    },
                    {
                        title: 'Cập nhật mật khẩu',
                    },
                ]}
            />
            <div className="mt-10">
                {step === 0 && <StepOne email={email} setStep={setStep} setEmail={setEmail} />}
                {step === 1 && <StepTwo setStep={setStep} email={email} />}
            </div>
        </div>
    );
};

export default ForgotPasswordContent;
