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

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const bucketName = searchParams.get("bucketName");

    if (!bucketName) {
        return NextResponse.json({ error: 'Bucket name is required' }, { status: 400 });
    }

    try {
        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            MaxKeys: 1,
        });
        
        const result = await s3Client.send(command);
        const isEmpty = !result.Contents || result.Contents.length === 0;

        return NextResponse.json({ isEmpty });
    } catch (error: any) {
        console.error(`Error checking bucket "${bucketName}":`, error);
        return NextResponse.json({ error: error.message || 'Error checking bucket' }, { status: 500 });
    }
};
