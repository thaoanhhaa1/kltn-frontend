'use client';

import { isImage } from '@/lib/utils';
import { Flex, Image } from 'antd';
import ReactPlayer from 'react-player';

const MediaView = ({ evidences }: { evidences: string[] }) => {
    return (
        <Flex gap={8}>
            {evidences.map((evidence) => (
                <div key={evidence} className="w-[100px] h-[100px] rounded overflow-hidden">
                    {isImage(evidence.split('?')[0]) ? (
                        <Image
                            rootClassName="w-full h-full"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                            src={evidence}
                            alt={evidence}
                        />
                    ) : (
                        <ReactPlayer
                            width="100%"
                            height="100%"
                            style={{
                                aspectRatio: '1/1',
                            }}
                            url={evidence}
                            controls
                        />
                    )}
                </div>
            ))}
        </Flex>
    );
};

export default MediaView;
