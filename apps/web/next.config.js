/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@resumate-ai/ui', '@resumate-ai/config', '@resumate-ai/types'],
  experimental: {
    appDir: true,
    outputFileTracingIgnores: ['**@aws-sdk/client-s3**'] // Ignore if AWS SDK is not directly used in Next.js build
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'resumate-pdfs-bucket.s3.amazonaws.com', // Example S3 bucket for templates/generated PDFs
        port: '',
        pathname: '/**', 
      },
      {
        protocol: 'http',
        hostname: 'localhost', // For local MinIO during development
        port: '9000',
        pathname: '/**', 
      },
    ],
  },
};

module.exports = nextConfig;
