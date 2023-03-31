import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import './twitter';
import { existsSync } from 'fs';

const app = express();

const { PORT = 80 } = process.env;

app.get('/image/:id', async (request: Request, response: Response) => {
    try {
        const { id } = request.params;
        const filePath = path.resolve(__dirname, '../images', `${id}.png`);
        if (existsSync(filePath)) {
            return response.sendFile(filePath);
        }

        let fileExists: boolean = false;

        while (!fileExists) {
            try {
                fileExists = existsSync(filePath);
                if (fileExists) {
                    break;
                }
            } catch (error) {
                break;
            }
        }
        return response.sendFile(filePath);
    } catch (error) {
        console.log('Error in handling this request', error);
        return response.send('There was some error. Please use the link after some time!')
    }
});

app.listen(PORT, () => {
    console.log('Express server started!')
})