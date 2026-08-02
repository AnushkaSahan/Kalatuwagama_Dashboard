# Kalatuwagama Dashboard (Admin)

Administrative dashboard for managing Kalatuwagama Temple data and operations.

## Overview

This application is the frontend admin panel used to manage:

- Temple history
- Monks
- Events
- Gallery
- Donation information
- Contact messages
- Announcements
- Daham Pasala teachers and students
- Foundation projects
- User management and roles

The app uses JWT-based authentication against the backend API.

## Tech Stack

- React 19
- Vite 8
- React Router 7
- Tailwind CSS
- Axios
- React Hot Toast
- Lucide React

## Prerequisites

- Node.js 20+ (or Node.js 18.18+)
- npm 9+
- Running backend API (default: `http://localhost:8080`)

## Environment Configuration

Create a `.env` file in this folder:

```env
VITE_API_URL=http://localhost:8080
```

If `VITE_API_URL` is not provided, the app defaults to `http://localhost:8080`.

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Default Vite URL: `http://localhost:5173`

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Authentication Flow

- Login request: `POST /api/auth/login`
- Token is stored in local storage key: `token`
- User data is stored in local storage key: `user`
- Axios interceptor automatically sends `Authorization: Bearer <token>`
- On `401`, the app clears auth state and redirects to `/login`

## Main Route Groups

- `/dashboard`
- `/temple-history`, `/monks`, `/events`, `/gallery`, `/donations`, `/messages`, `/announcements`
- `/teachers`, `/students`
- `/foundation-projects`
- `/users`, `/roles`
- `/settings`, `/profile`

## Project Structure

```text
src/
	api/            # Axios client + feature API modules
	components/     # Shared UI, layout, route guards
	context/        # Auth context/provider
	pages/          # Feature pages grouped by domain
	assets/         # Static frontend assets
```

## Backend Integration Notes

- Ensure backend CORS allows `http://localhost:5173`
- Ensure backend is running before logging in
- Swagger docs for backend are available at `/swagger-ui.html`

## Deployment Notes

- Set `VITE_API_URL` to your production API base URL
- Build with `npm run build`
- Serve the `dist` folder using your preferred web server
