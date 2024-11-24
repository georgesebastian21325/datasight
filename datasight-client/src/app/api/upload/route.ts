import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function uploadFileToS3(file: any, fileName: any) {
  const fileBuffer = file;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: `${fileName}`,
    Body: fileBuffer,
    ContentType: "application/csv",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return fileName;
}

export async function POST(request: any) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");
    console.log(files);
    if (files.length === 0) {
      return NextResponse.json(
        { error: "At least one file is required." },
        { status: 400 },
      );
    }

    const uploadPromises = files.map(async (file: any) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = await uploadFileToS3(buffer, file.name);
      return fileName;
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      uploadedFiles,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }
}


