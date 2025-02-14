'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const putS3generatePresignedUrl = async (
  fileName: string,
  fileType: string,
) => {
  const s3 = new S3Client({
    region: process.env.AWS_S3_BUCKET_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS!,
    },
  });

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: fileName,
    ContentType: fileType,
  };

  const command = new PutObjectCommand(params);

  try {
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return presignedUrl;
  } catch (error) {
    return null;
  }
};
