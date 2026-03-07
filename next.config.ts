/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  async headers() {
    return [
      {
        source: '/music/(.*).mp3',
        headers: [{ key: 'Content-Type', value: 'audio/mpeg' }],
      },
      {
        source: '/music/(.*).mp4',
        headers: [{ key: 'Content-Type', value: 'video/mp4' }],
      },
    ];
  },
};

export default nextConfig;