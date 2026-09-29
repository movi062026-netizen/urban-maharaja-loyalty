const { uploadBillImage, isCloudinaryConfigured } = require('../../src/integrations/storage');

describe('Cloudinary WebP Bill Upload & Anti-Fraud Unit Tests', () => {
  it('provides a valid fallback WebP response in development when credentials are not yet set', async () => {
    const dummyBuffer = Buffer.from('fake-image-bytes-for-bill');
    const result = await uploadBillImage(dummyBuffer);

    expect(result).toBeDefined();
    expect(result.format).toBe('webp');
    expect(result.secure_url).toBeDefined();
    expect(result.secure_url).toContain('webp');
  });

  it('rejects upload if buffer is invalid or missing', async () => {
    await expect(uploadBillImage(null)).rejects.toThrow('Invalid image buffer');
    await expect(uploadBillImage('not-a-buffer')).rejects.toThrow('Invalid image buffer');
  });
});
