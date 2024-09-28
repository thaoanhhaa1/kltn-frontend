import AvatarWithName from '@/components/avatar-with-name';
import { IBaseUserEmbed } from '@/interfaces/user';
import { Typography } from 'antd';

const Header = ({ user }: { user: IBaseUserEmbed }) => {
    return (
        <div className="p-2 flex gap-4 items-center">
            <AvatarWithName avatar={user.avatar || ''} name={user.name} border />
            <Typography.Title level={5} style={{ margin: 0 }}>
                {user?.name}
            </Typography.Title>
        </div>
    );
};

export default Header;
