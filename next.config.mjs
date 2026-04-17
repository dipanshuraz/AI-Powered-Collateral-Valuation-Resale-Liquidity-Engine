/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * react-leaflet initializes L.map() in a ref callback; React 18 Strict Mode (dev)
   * double-mounts and can hit "Map container is already initialized" before cleanup runs.
   * Production builds already behave like Strict Mode off for this; disabling avoids dev-only crashes.
   */
  reactStrictMode: false,
};

export default nextConfig;
