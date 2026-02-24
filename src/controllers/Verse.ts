import axios from 'axios';
import { Request, Response } from 'express';
import { VERSE_REFERENCES } from '../config/verseReference';
import { CreateResponse } from '../util/response';

export const getRandomVerse = async (req: Request, res: Response): Promise<any> => {
    try {
        // 1. Pick random reference
        const randomIndex = Math.floor(Math.random() * VERSE_REFERENCES.length);
        const reference = VERSE_REFERENCES[randomIndex];


        console.log("Pinged: ",` https://bible-api.com/${encodeURIComponent(reference)}`);

        // 2. Call Bible API
        const response = await axios.get(
            `https://bible-api.com/${encodeURIComponent(reference)}`
        );

        console.log("Response: ", response);

        const verseData = response.data;

        // 3. Clean response
        const body = {
            reference: verseData.reference,
            text: verseData.verses.map((v: any) => v.text).join(" ").trim(),
            translation: verseData.translation_name
        };

        return res.json(CreateResponse(true, body));

    } catch (error: any) {
        console.error("Bible API error:", error.message);
        return res.status(500).json(CreateResponse(false, null, "Unable to fetch verse at this time"));
    }
};
