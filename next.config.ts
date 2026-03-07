/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/music/:file*.mp3',
        headers: [{ key: 'Content-Type', value: 'audio/mpeg' }],
      },
      {
        source: '/music/:file*.mp4',
        headers: [{ key: 'Content-Type', value: 'video/mp4' }],
      },
    ];
  },
};

export default nextConfig;