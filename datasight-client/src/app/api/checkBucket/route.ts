// src/app/api/checkBucket/route.ts
import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    endpoint: `https://s3.${process.env.AWS_REGION}.amazonaws.com`, // explicitly set the endpoint
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export const GET = async () => {
    try {
        const bucketName = 'datasight-landing';

        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            MaxKeys: 1, // We only need to check if there's at least one object
        });

        const response = await s3Client.send(command);

        const isEmpty = !response.Contents || response.Contents.length === 0;

        console.log('Bucket check successful:', { bucketName, isEmpty });

        return NextResponse.json({ isEmpty });
    } catch (error: any) {
        console.error('Error checking bucket contents:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
        });
        return NextResponse.json(
            { error: error.message || 'Error checking bucket contents' },
            { status: 500 }
        );
    }
};
