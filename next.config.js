module.exports = {
  images: {
    domains: ["s3.us-west-1.amazonaws.com", "source.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.us-west-1.amazonaws.com",
        port: "",
      },
    ],
  },
};
