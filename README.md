# Art Gallery Platform (Dynamic Blog Website Template)

🚧 This app is a **POC** and is currently a Work-in-progress 🚧

This is a simple boilerplate template for creating a dynamic blog website using Next.js, React.js, and TypeScript. It utilizes MongoDB for data storage, Prisma for database management, NextAuth for security, SWR for data fetching, MUI for UI components, and AWS S3 for image storage.

### Demo
Visit a demo [here](https://art-gallery-app.vercel.app/).

## Features

- Showcase artwork and branding for artists on a dynamic blog platform.
- Next.js with Static Site Generation for improved SEO.
- Authentication and security provided by NextAuth.
- Efficient data fetching and caching with SWR.
- User interface components designed with MUI.
- Integration with MongoDB for data storage.
- Image storage and management with AWS S3.

## Technologies Used

- TypeScript
- MongoDB
- React.js
- Prisma
- Next.js (Static Site Generation)
- NextAuth
- SWR
- MUI
- AWS S3

# Prisma cmds

### Installing Prisma CLI

`npm install prisma --save-dev`
`npx prisma init`

### Creating tables in remote DB

`npx prisma db push`

### Updating any `schema.prisma` changes

`npx prisma generate`

### Launching Prisma Studio with your DB

`npx prisma studio`
