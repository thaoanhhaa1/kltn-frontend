import OfficeViewer from '@/components/office-viewer';
import Title from '@/components/title';
import { IMAGE, VIDEO } from '@/constants/media-type';
import useBoolean from '@/hooks/useBoolean';
import useDownloadFile from '@/hooks/useDownloadFile';
import { IMediaType } from '@/interfaces/chat';
import { getMediaType, officeCanView } from '@/lib/utils';
import { Button, Flex, Image } from 'antd';
import { Download, Eye, File } from 'lucide-react';
import ReactPlayer from 'react-player';

const ViewMediaChat = ({ media }: { media: IMediaType }) => {
    const { value, setFalse, setTrue } = useBoolean(false);
    const download = useDownloadFile({ name: media.name, src: media.url });

    if (getMediaType(media.type) === IMAGE)
        return (
            <Image
                alt=""
                src={media.url}
                key={media.url}
                width={200}
                height={200}
                className="w-[200px] object-cover"
                preview
            />
        );

    if (getMediaType(media.type) === VIDEO)
        return (
            <ReactPlayer
                width="100%"
                height="100%"
                style={{
                    aspectRatio: '16/9',
                }}
                url={media.url}
                controls
            />
        );

    const isCanView = officeCanView(media.name);

    return (
        <Flex align="center" gap={8}>
            <Flex
                style={{
                    width: '40px',
                    height: '40px',
                    flexShrink: 0,
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                }}
                justify="center"
                align="center"
            >
                <File className="w-5 h-5" />
            </Flex>
            <Flex vertical flex={1}>
                <Title level={5}>{media.name}</Title>
                <Flex gap={8}>
                    {isCanView && <Button type="text" onClick={setTrue} icon={<Eye className="w-4 h-4" />} />}
                    <Button type="text" onClick={download} icon={<Download className="w-4 h-4" />} />
                </Flex>
            </Flex>
            {isCanView && value && <OfficeViewer media={media} viewer={isCanView} onClose={setFalse} />}
        </Flex>
    );
};

export default ViewMediaChat;
