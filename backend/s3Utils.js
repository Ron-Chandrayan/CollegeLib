const { s3, s3Config } = require('./s3Config');

// Upload file to S3
const uploadToS3 = async (file, key) => {
  const params = {
    Bucket: s3Config.bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
    // Removed ACL as the bucket doesn't support it
  };

  try {
    const result = await s3.upload(params).promise();
    return {
      success: true,
      url: result.Location,
      key: result.Key
    };
  } catch (error) {
    console.error('S3 Upload Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get signed URL for file download (valid for 1 hour)
const getSignedUrl = async (key) => {
  const params = {
    Bucket: s3Config.bucketName,
    Key: key,
    Expires: 3600 // 1 hour
  };

  try {
    const url = await s3.getSignedUrlPromise('getObject', params);
    return {
      success: true,
      url: url
    };
  } catch (error) {
    console.error('S3 Signed URL Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// List all files in S3 bucket
const listS3Files = async () => {
  const params = {
    Bucket: s3Config.bucketName,
    Prefix: 'qps/' // Only list files in the qps folder
  };

  try {
    const result = await s3.listObjectsV2(params).promise();
    const files = result.Contents || [];
    
    // Parse file keys to extract sem, subject, year, filename
    const parsedFiles = files
      .filter(file => file.Key !== 'qps/') // Exclude the folder itself
      .map(file => {
        const keyParts = file.Key.split('/');
        if (keyParts.length >= 5) {
          return {
            sem: keyParts[1],
            subject: keyParts[2],
            year: keyParts[3],
            filename: keyParts[4],
            key: file.Key,
            size: file.Size,
            lastModified: file.LastModified
          };
        }
        return null;
      })
      .filter(file => file !== null);

    return {
      success: true,
      files: parsedFiles
    };
  } catch (error) {
    console.error('S3 List Error:', error);
    return {
      success: false,
      error: error.message,
      files: []
    };
  }
};

// Delete file from S3
const deleteFromS3 = async (key) => {
  const params = {
    Bucket: s3Config.bucketName,
    Key: key
  };

  try {
    await s3.deleteObject(params).promise();
    return {
      success: true
    };
  } catch (error) {
    console.error('S3 Delete Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  uploadToS3,
  getSignedUrl,
  listS3Files,
  deleteFromS3
}; 