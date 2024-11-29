import { envConfig } from '@/config/envConfig';

export interface ISpeechToText {
    status: number;
    id: string;
    hypotheses: Hypothesis[];
}

export interface Hypothesis {
    utterance: string;
    confidence: number;
}

export const speechToText = async (audio: Blob): Promise<ISpeechToText> => {
    const res = await fetch(envConfig.NEXT_PUBLIC_FPT_AI_ENDPOINT, {
        method: 'POST',
        headers: {
            api_key: envConfig.NEXT_PUBLIC_FPT_AI_API_KEY,
        },
        body: audio,
    });

    return res.json();
};
