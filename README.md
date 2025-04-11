# RoomSync – CS4750 Full Stack Application

**Live Website**: [https://cs4750.netlify.app/](https://cs4750.netlify.app/)  
**GitHub Repositories**:
- **Frontend** (latest code in `master`): [https://github.com/yingchenxing/cs4750_frontend](https://github.com/yingchenxing/cs4750_frontend)
- **Backend** (latest code in `backend`): [https://github.com/yingchenxing/cs4750_frontend/tree/backend](https://github.com/yingchenxing/cs4750_frontend/tree/backend)


## About RoomSync

RoomSync is a full stack web application developed for the CS4750 course. It helps users find roommates and manage house listings for shared living arrangements. The application uses a modern frontend built with Next.js and a Spring Boot backend connected to a PostgreSQL database hosted by UVA.

### Current Features (MVP)

- Authentication – Email and password login/signup
- Write – Users can create new house listings
- Read – Users can view all existing listings

Planned features include listing updates, deletions, filters, and messaging.

## Tech Stack

**Frontend**
- Framework: Next.js (App Router with TypeScript)
- Deployment: Netlify

**Backend**
- Framework: Spring Boot (Java, Maven)
- Deployment: Render
- Database: PostgreSQL (hosted on `bastion.cs.virginia.edu`)

## API Documentation

Basic backend API documentation is available in the `backend` branch of the repository.

## Running the Application Locally

### Frontend Setup

```bash
git clone https://github.com/yingchenxing/cs4750_frontend.git
cd cs4750_frontend
npm install
npm run dev
```

Then open your browser and go to: [http://localhost:3000](http://localhost:3000)

---

### Backend Setup

The backend connects to a PostgreSQL database hosted at `bastion.cs.virginia.edu`. You’ll need to provide credentials as environment variables before starting the server.

```bash
git clone https://github.com/yingchenxing/cs4750_frontend.git
cd cs4750_frontend
git checkout backend
```

Backend will run at: [http://localhost:8080](http://localhost:8080)

> You should replace the environment variable values (e.g. SPRING_DATASOURCE_URL) with your actual JDBC URL if preferred, but be sure **not to commit** the real credentials or `application.properties` to GitHub.



[//]: # (This is a [Next.js]&#40;https://nextjs.org&#41; project bootstrapped with [`create-next-app`]&#40;https://nextjs.org/docs/app/api-reference/cli/create-next-app&#41;.)

[//]: # ()
[//]: # (## Getting Started)

[//]: # ()
[//]: # (First, run the development server:)

[//]: # ()
[//]: # (```bash)

[//]: # (npm run dev)

[//]: # (# or)

[//]: # (yarn dev)

[//]: # (# or)

[//]: # (pnpm dev)

[//]: # (# or)

[//]: # (bun dev)

[//]: # (```)

[//]: # ()
[//]: # (Open [http://localhost:3000]&#40;http://localhost:3000&#41; with your browser to see the result.)

[//]: # ()
[//]: # (You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.)

[//]: # ()
[//]: # (This project uses [`next/font`]&#40;https://nextjs.org/docs/app/building-your-application/optimizing/fonts&#41; to automatically optimize and load [Geist]&#40;https://vercel.com/font&#41;, a new font family for Vercel.)

[//]: # ()
[//]: # (## Learn More)

[//]: # ()
[//]: # (To learn more about Next.js, take a look at the following resources:)

[//]: # ()
[//]: # (- [Next.js Documentation]&#40;https://nextjs.org/docs&#41; - learn about Next.js features and API.)

[//]: # (- [Learn Next.js]&#40;https://nextjs.org/learn&#41; - an interactive Next.js tutorial.)

[//]: # ()
[//]: # (You can check out [the Next.js GitHub repository]&#40;https://github.com/vercel/next.js&#41; - your feedback and contributions are welcome!)

[//]: # ()
[//]: # (## Deploy on Vercel)

[//]: # ()
[//]: # (The easiest way to deploy your Next.js app is to use the [Vercel Platform]&#40;https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme&#41; from the creators of Next.js.)

[//]: # ()
[//]: # (Check out our [Next.js deployment documentation]&#40;https://nextjs.org/docs/app/building-your-application/deploying&#41; for more details.)
