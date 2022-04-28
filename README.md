# Fullstack Authentication Example with Next.js and NextAuth.js

This is the starter project for the fullstack tutorial with Next.js and Prisma. You can find the final version of this project in the [`final`](https://github.com/prisma/blogr-nextjs-prisma/tree/final) branch of this repo.

# Running app

`npm run dev`

# Configure .env file

You'll need to connect your db of choice. I'm using PostgreSQL hosted on Heroku

> DATABASE_URL="postgres://{url}"

> GITHUB_ID={id}

> GITHUB_SECRET={secret}

> NEXTAUTH_URL=http://localhost:3000/api/auth

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
