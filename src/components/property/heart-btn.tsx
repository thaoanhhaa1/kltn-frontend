import { Button } from 'antd';
import { Heart } from 'lucide-react';

// TODO: Implement heart button
const HeartBtn = () => {
    return <Button type="text" danger icon={<Heart className="w-5 h-5" />} />;
};

export default HeartBtn;
