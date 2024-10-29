// src/app/api/createBucket/route.ts
import { NextResponse } from 'next/server';
import { S3Client, CreateBucketCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    endpoint: `https://s3.${process.env.AWS_REGION}.amazonaws.com`, // explicitly set the endpoint
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export const POST = async () => {
    try {
        // Combine user number and timestamp to create a unique bucket name
        const bucketName = 'datasight-landing';

        const command = new CreateBucketCommand({
            Bucket: bucketName,
        });

        // Send the command to create the bucket
        await s3Client.send(command);

        // Return the bucket name for further actions
        return NextResponse.json({ message: `Bucket "${bucketName}" created successfully`, bucketName });
    } catch (error: any) {
        console.error('Error creating bucket:', error);
        return NextResponse.json({ error: error.message || 'Error creating bucket' }, { status: 500 });
    }
};
