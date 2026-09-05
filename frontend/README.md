# Nimisham — Frontend Application

React.js single-page application built with Vite and Tailwind CSS for the Nimisham platform.

## Features & Pages Implemented

- **Authentication (`/login`, `/register`, `/forgot-password`, `/reset-password`)**: User registration, login, and password reset flows powered by JWT.
- **User & Creator Profiles (`/profile`, `/profile/edit`)**: Profile viewing and editing, avatar URL updates, creator bio, and social links.
- **Dashboard (`/dashboard`)**: Role-aware personalized dashboard for Users, Creators, and Admins.
- **Home (`/`)**: Landing page showcasing featured artworks, platform highlights, and quick access.

## Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom Design System (`STYLE.md`)
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Scripts

```bash
# Start development server
npm run dev

# Build production bundle
npm run build

# Preview build
npm run preview
```
