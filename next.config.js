/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverComponentsExternalPackages: ['openai']
    },
    api: {
      bodyParser: {
        sizeLimit: '50mb',
      },
    },
    serverRuntimeConfig: {
      maxDuration: 300, // 5 minutes for long audio processing
    }
  }
  
  module.exports = nextConfig