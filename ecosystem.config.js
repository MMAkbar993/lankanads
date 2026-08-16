// PM2 process manager config for the VPS.
// Run from this folder: pm2 start ecosystem.config.js
//
// Layout expected (same as this local checkout):
//   <this folder>/backend
//   <this folder>/frontend
//   <this folder>/admin
//
// Before starting: `npm install` in each of the three folders, and
// `npm run build` in frontend/ and admin/ (Next.js needs a production
// build before `next start` will work).

module.exports = {
    apps: [
        {
            name: "lankanads-backend",
            cwd: "./backend",
            script: "index.js",
            env: {
                NODE_ENV: "production",
            },
        },
        {
            name: "lankanads-frontend",
            cwd: "./frontend",
            script: "npm",
            args: "run start -- -p 3000",
            env: {
                NODE_ENV: "production",
            },
        },
        {
            name: "lankanads-admin",
            cwd: "./admin",
            script: "npm",
            args: "run start -- -p 3001",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
