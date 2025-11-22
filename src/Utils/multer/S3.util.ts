// src/Utils/Storage/s3-upload.util.ts

import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuid } from 'uuid'; 

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId:process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});

export const s3Uploader = async (file: Express.Multer.File, folder: string) => {
    const fileName = `${folder}/${uuid()}-${file.originalname}`;
    
    const parallelUploads3 = new Upload({
        client: s3Client,
        params: {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer, 
            ContentType: file.mimetype,
        },
    });

    const result = await parallelUploads3.done();

    
    return {
        secure_url: (result as any).Location, 
        public_id: (result as any).Key,      
    };
};