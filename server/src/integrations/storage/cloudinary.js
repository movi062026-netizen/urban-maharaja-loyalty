const cloudinary = require('cloudinary').v2;
const env = require('../../config/env');
const logger = require('../../config/logger');

/**
 * Check if Cloudinary credentials are fully configured
 */
const isCloudinaryConfigured = () => {
  return Boolean(
    env.CLOUDINARY_CLOUD_NAME &&
    env.CLOUDINARY_API_KEY &&
    env.CLOUDINARY_API_SECRET
  );
};

// Initialize Cloudinary if credentials are provided
if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Upload dining bill image to Cloudinary in WebP format
 * 
 * Enforces WebP format conversion and optimization per restaurant specifications.
 * 
 * @param {Buffer} buffer - Image file buffer
 * @param {Object} [options]
 * @param {string} [options.folder] - Cloudinary destination folder
 * @param {string} [options.publicId] - Custom public ID
 * @returns {Promise<{ secure_url: string, public_id: string, format: string, bytes: number }>}
 */
const uploadBillImage = async (buffer, options = {}) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('Invalid image buffer provided for bill upload');
  }

  if (!isCloudinaryConfigured()) {
    logger.warn(
      'Cloudinary credentials missing in environment. Using fallback WebP bill preview for development.'
    );
    // Development fallback image in webp format
    const mockId = `urban_maharaja_bill_${Date.now()}`;
    return {
      secure_url: `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80&fm=webp`,
      public_id: mockId,
      format: 'webp',
      bytes: buffer.length,
      isMock: true,
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'urban-maharaja/bills',
        format: 'webp', // Transcode directly to WebP on Cloudinary
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'webp' },
          { flags: 'strip_profile' }, // Strip EXIF data for privacy & anti-metadata leakage
        ],
        public_id: options.publicId,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          logger.error('Cloudinary upload failure:', error);
          return reject(new Error(error.message || 'Failed to upload bill image to Cloudinary'));
        }

        logger.info(`Bill uploaded to Cloudinary: ${result.secure_url} (format: ${result.format})`);
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Delete image asset from Cloudinary
 */
const deleteBillImage = async (publicId) => {
  if (!isCloudinaryConfigured() || !publicId || publicId.startsWith('urban_maharaja_bill_')) {
    return { result: 'ok' };
  }

  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error(`Failed to delete Cloudinary asset ${publicId}:`, error);
    return { result: 'error', error: error.message };
  }
};

module.exports = {
  isCloudinaryConfigured,
  uploadBillImage,
  deleteBillImage,
  cloudinary,
};
