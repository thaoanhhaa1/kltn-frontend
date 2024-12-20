import ForgotPasswordContent from '@/app/(auth)/forgot-password/forgot-password-content';
import { Card } from '@/components/ui/card';

const ForgotPasswordPage = () => {
    return (
        <div className="h-screen flex justify-center items-center">
            <Card className="p-4 w-full max-w-lg mx-auto">
                <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center">
                    Cập nhật mật khẩu
                </h2>
                <ForgotPasswordContent />
            </Card>
        </div>
    );
};

export default ForgotPasswordPage;
