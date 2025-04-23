# RoomSync – CS4750 Full Stack Application

**Live Website**: [https://cs4750.netlify.app/](https://cs4750.netlify.app/)  
**GitHub Repositories**:

- **Frontend** (latest code in `master`): [https://github.com/yingchenxing/cs4750_frontend](https://github.com/yingchenxing/cs4750_frontend)
- **Backend** (latest code in `node`): [https://github.com/yingchenxing/cs4750_frontend/tree/node](https://github.com/yingchenxing/cs4750_frontend/tree/node)

## About RoomSync

RoomSync is a full stack web application developed for the CS4750 course. It helps users find roommates and manage house listings for shared living arrangements. The application uses a modern frontend built with Next.js and a Spring Boot backend connected to a PostgreSQL database hosted by UVA.

<!-- ### Current Features (MVP)

- Authentication – Email and password login/signup
- Write – Users can create new house listings
- Read – Users can view all existing listings

Planned features include listing updates, deletions, filters, and messaging. -->

## Tech Stack

**Frontend**

- Framework: Next.js (App Router with TypeScript)
- Deployment: Netlify

**Backend**

- Framework: Express.js
- Deployment: Heroku
- Database: PostgreSQL (hosted on `bastion.cs.virginia.edu`)

## API Documentation

Basic backend API documentation is available in the `backend` branch of the repository.

## Running the Application Locally

### Frontend Setup

```bash
git clone https://github.com/yingchenxing/cs4750_frontend.git
npm install
npm run dev
```

Then open your browser and go to: [http://localhost:3000](http://localhost:3000)

---

### Backend Setup

The backend connects to a PostgreSQL database hosted at `bastion.cs.virginia.edu`. You’ll need to provide credentials as environment variables before starting the server.

```bash
git clone https://github.com/yingchenxing/cs4750_frontend.git
git checkout node
npm install
npm run dev
```

Backend will run at: [http://localhost:5000](http://localhost:5000)
