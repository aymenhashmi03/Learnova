const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const region = process.env.AWS_REGION || 'us-east-1';
const bucket = process.env.AWS_S3_BUCKET;

// Bucket must be private; access only via signed URLs (5–10 min expiry recommended).
const DEFAULT_EXPIRES = 600; // 10 minutes

const s3Client = new S3Client({
  region,
});

const getSignedVideoUrl = async (key, expiresInSeconds = DEFAULT_EXPIRES) => {
  if (!bucket) {
    throw new Error('AWS_S3_BUCKET is not configured');
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: Math.min(Math.max(expiresInSeconds, 300), 600), // clamp 5–10 min
  });

  return signedUrl;
};

module.exports = {
  getSignedVideoUrl,
};

