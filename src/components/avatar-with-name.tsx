import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, getNameAvatar } from '@/lib/utils';

const AvatarWithName = ({ avatar, name, border }: { avatar: string; name: string; border?: boolean }) => {
    return (
        <Avatar className={cn(border && 'border border-white')}>
            <AvatarImage src={avatar} className="object-cover" />
            <AvatarFallback>{getNameAvatar(name)}</AvatarFallback>
        </Avatar>
    );
};

export default AvatarWithName;
