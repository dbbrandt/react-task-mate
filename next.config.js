/** @type {import('next').NextConfig} */
// const nextConfig = {}
//
// module.exports = nextConfig

// Need to disable webpack minimization for Apollo to work properly - mutations seemed to break.
module.exports = {
    webpack: (config) => {
        config.optimization.minimize = false;
        return config;
    },
};
