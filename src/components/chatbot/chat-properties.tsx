import ChatProperty from '@/components/chatbot/chat-property';
import { IProperty } from '@/interfaces/property';

const ChatProperties = ({ properties }: { properties: Array<IProperty> }) => {
    return (
        <div className="flex flex-col gap-2 pr-3">
            {properties.map((property) => (
                <ChatProperty key={property.slug} property={property} />
            ))}
        </div>
    );
};

export default ChatProperties;
