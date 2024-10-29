import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export const GET = async () => {
    const bucketName = 'datasight-landing';

    try {
        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            MaxKeys: 1,
        });
        
        const result = await s3Client.send(command);
        const isEmpty = !result.Contents || result.Contents.length === 0;

        return NextResponse.json({ isEmpty });
    } catch (error) {
        console.error('Error in S3 request:', error);
        return NextResponse.json({ error: 'Error checking bucket' }, { status: 500 });
    }
};
