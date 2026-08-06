# PROJECT.md — Nimisham Project Specification

> **This file is the single source of truth for the complete Nimisham project specification.**
>
> Whenever a future development task conflicts with the information in this document, inspect the existing architecture and identify the conflict before modifying anything. Do not silently change the project's fundamental architecture.

---

## 1. Project Identity

| Field              | Value                                                                          |
| ------------------ | ------------------------------------------------------------------------------ |
| **Project Name**   | Nimisham                                                                       |
| **Meaning**        | "Moment"                                                                       |
| **Project Type**   | MCA Mini Project                                                               |
| **Category**       | Photography + AI Art + Creative Community + Learning + Digital Marketplace      |

### Project Description

Nimisham is a comprehensive web-based creative platform for photographers and AI artists to showcase their work, document their creative process, share knowledge, conduct live learning sessions, sell digital creative resources, interact with a creative community, and receive intelligent assistance through an AI-powered chatbot.

---

## 2. Problem Statement

Photography and AI-generated art platforms primarily focus on image sharing and social engagement, while providing limited support for documenting creative processes, knowledge sharing, professional growth, digital resource selling, and interactive learning.

Nimisham addresses this gap by combining:

- Creative portfolio showcasing
- Photography and AI artwork publishing
- Creative-process documentation
- Tutorials and educational content
- Presets and AI prompt sharing
- Community interaction
- Live learning sessions
- Digital marketplace
- Secure digital product delivery
- AI-powered assistance
- Creator analytics
- Platform administration

---

## 3. Objectives

1. Develop a web-based platform that enables photographers and AI artists to professionally showcase and sell their creative works.
2. Provide facilities for sharing tutorials, editing workflows, presets, AI prompts, and conducting live interactive learning sessions.
3. Promote collaboration, knowledge sharing, and user engagement through community features, an AI-powered chatbot, and a secure digital marketplace.

---

## 4. Core Project Concept

Nimisham must be treated as an integrated creator ecosystem rather than simply an image-sharing website.

The system combines:

```
Portfolio Platform
        +
Creative Knowledge Sharing
        +
Learning Platform
        +
Digital Marketplace
        +
Creative Community
        +
AI Assistance
        +
Creator Analytics
        +
Administration
```

The platform serves both:

### Creators

- Photographers
- AI artists
- Educators
- Digital resource sellers

### Consumers

- Photography enthusiasts
- AI-art enthusiasts
- Learners
- Buyers
- Creative community members

---

## 5. Technology Stack

### Frontend

- React.js
- Tailwind CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB

### AI

- AI-powered chatbot
- AI integration isolated behind a backend service/API layer

### Authentication

- JWT
- bcrypt / password hashing

### File & Image Storage

- Cloudinary

### Payments

- Razorpay and/or Stripe
- Use sandbox/test mode during development

### Real-Time Communication

- Socket.IO
- WebRTC may be used where appropriate

### Development Tools

- VS Code
- Git
- GitHub
- Postman

> Do not introduce unnecessary technologies without first checking whether they are required.

---

## 6. The 20 Official Modules

The following 20 modules are the official functional decomposition of Nimisham.

- Do NOT merge them casually.
- Do NOT create random additional modules simply to increase the module count.
- Do NOT remove a module without explicitly identifying the architectural reason.

---

### MODULE 01 — User Registration & Authentication

**Responsibilities:**

- User registration
- Login / Logout
- Password management & reset
- Email verification (where implemented)
- JWT authentication
- Password hashing
- Authentication middleware

**Primary Entities:**

```
User
Authentication
```

---

### MODULE 02 — User Profile & Creator Identity

**Responsibilities:**

- User profile & creator profile
- Profile picture
- Bio, skills, social links
- Creator information
- Public profile

The module should support the identity of photographers and AI artists.

---

### MODULE 03 — Role & Access Management

**Responsibilities:**

- User roles (User, Creator, Admin)
- Creator permissions
- Administrator permissions
- Route protection
- Authorization middleware
- Role-based access control

> Authentication and authorization must remain conceptually separate.

---

### MODULE 04 — Artwork & Photography Upload

**Responsibilities:**

- Upload photographs & AI-generated artwork
- Artwork metadata, categories, tags, descriptions
- Visibility & pricing information

**Photography metadata may include:**

```
Camera, Lens, ISO, Shutter Speed, Aperture, Focal Length
```

**AI artwork metadata may include:**

```
AI Tool, Model, Prompt, Negative Prompt, Generation Settings
```

Use Cloudinary for image/media storage.

---

### MODULE 05 — Creative Process Documentation

One of the distinguishing features of Nimisham.

Allow creators to document:

- Inspiration & concept
- Creative process & editing workflow
- Tools used & camera settings
- AI prompts & techniques
- Production notes

The platform should allow users to understand **how the final artwork was created**, rather than only seeing the final image.

---

### MODULE 06 — Portfolio Management

**Responsibilities:**

- Create / edit portfolio
- Add / remove / organize projects
- Featured works
- Portfolio categories
- Public portfolio page

A creator's uploaded work should be reusable inside their portfolio.

---

### MODULE 07 — Tutorial & Educational Content

**Responsibilities:**

- Create / edit / publish / draft tutorials
- Photography tips & editing guides
- AI-art tutorials
- Learning resources

Support appropriate CRUD operations and publishing states.

---

### MODULE 08 — Preset & AI Prompt Resource Sharing

**Responsibilities:**

- Upload presets & LUTs/resources (where supported)
- Share AI prompts & prompt collections
- Resource descriptions
- Free and paid resources

Integrates with the marketplace when a resource is monetized.

---

### MODULE 09 — Community Interaction

**Responsibilities:**

- Likes, comments, bookmarks
- Follow / unfollow creators
- Sharing & engagement

Community interaction should work across appropriate content types.

---

### MODULE 10 — Search, Discovery & Categories

**Responsibilities:**

- Search creators, artworks, tutorials, resources, marketplace products
- Categories, tags, filters, sorting

**Possible categories:**

```
Photography, AI Art, Tutorial, Preset, Prompt, Digital Resource
```

The system should be designed so AI-powered discovery can be added later.

---

### MODULE 11 — Digital Marketplace

**Responsibilities:**

- Product listing, details, pricing, categories
- Seller information
- Digital product publishing & management

**Supported product types:**

```
Photographs, AI Artwork, Presets, LUTs, AI Prompt Packs, Digital Creative Resources
```

---

### MODULE 12 — Shopping Cart & Order Management

**Responsibilities:**

- Add/remove from cart, cart management
- Checkout preparation
- Order creation, history, status
- Purchased product records

**Logical flow:**

```
Cart → Checkout → Order → Payment → Digital Delivery
```

---

### MODULE 13 — Payment & Transaction Management

**Responsibilities:**

- Payment creation & verification
- Payment success/failure handling
- Transaction records
- Order-payment relationship
- Seller revenue records
- Refund handling (where implemented)

**Supported gateway:** Razorpay and/or Stripe (test/sandbox during development).

> Never store raw card information.

---

### MODULE 14 — Digital Asset Delivery

**Responsibilities:**

- Verify successful purchase
- Grant buyer access
- Secure digital downloads
- Track downloads (where appropriate)
- Prevent unauthorized direct exposure of protected assets

**Logical flow:**

```
Successful Payment → Order Verification → Purchase Record → Secure Asset Access → Download
```

---

### MODULE 15 — Live Sessions & Workshops

**Responsibilities:**

- Create / edit / publish live sessions
- Session description, date, time, duration, category
- Participant registration & joining

**Possible session types:**

```
Photography Workshop, Editing Demonstration, AI Art Demonstration,
Portfolio Review, Creative Discussion
```

---

### MODULE 16 — Real-Time Communication

**Responsibilities:**

- Live session chat
- Real-time participant interaction
- Participant presence & session status
- Real-time events

**Primary technology:** Socket.IO

WebRTC may be integrated for direct real-time audio/video. Do not unnecessarily recreate an entire video-conferencing platform.

---

### MODULE 17 — Notification System

**Responsibilities:**

- Notifications for: likes, comments, followers, purchases, payments, live sessions, system events
- Read / unread status
- Notification history

---

### MODULE 18 — AI-Powered Chatbot

The chatbot must be designed specifically for Nimisham.

**Capabilities:**

| Area                    | Example                                          |
| ----------------------- | ------------------------------------------------ |
| Platform assistance     | "How do I upload an artwork?"                    |
| Creative assistance     | "What aperture is suitable for portrait photography?" |
| Resource discovery      | "Show me photography tutorials."                 |
| Platform navigation     | "Where can I sell my presets?"                   |
| Educational assistance  | "Explain RAW versus JPEG."                       |

**Architecture:**

```
User → Chatbot UI → Backend API → AI Service → Relevant Nimisham Context → AI Response
```

> AI credentials must never be exposed in frontend code.

---

### MODULE 19 — Admin & Platform Management

**Responsibilities:**

- **User management:** View, manage, suspend users; manage roles
- **Content moderation:** Review content, remove inappropriate content, handle reports
- **Marketplace management:** Review products, manage listings, monitor transactions
- **Community moderation:** Review reported comments/content
- **Live sessions:** Monitor sessions where necessary

> The admin module must have protected administrative routes.

---

### MODULE 20 — Analytics, Recommendations & Reporting

**Responsibilities:**

#### Creator Analytics

- Profile views, artwork views, likes, comments, bookmarks, followers
- Product sales, revenue, tutorial views

#### Platform Analytics

- Total users, creators, artworks, products, orders, revenue, active sessions

#### Recommendations

Initial recommendation logic may use:

```
User interests + Categories + Search activity + Liked content + Bookmarked content + Popularity
```

Advanced AI recommendation functionality may be implemented later.

---

## 7. Module Dependency Order

```
PHASE 1:  01 → 02 → 03
PHASE 2:  04 → 05 → 06 → 07 → 08
PHASE 3:  09 → 10
PHASE 4:  11 → 12 → 13 → 14
PHASE 5:  15 → 16 → 17
PHASE 6:  18 → 20
PHASE 7:  19
```

Do not implement dependent functionality before its underlying foundation unless there is a deliberate architectural reason.

---

## 8. Project Architecture Principles

### Separation of Concerns

Frontend, backend, database, AI services, file storage, payment services, and real-time services must have clear responsibilities.

### Modular Architecture

Each major feature should have logical separation between:

```
Routes → Controllers → Services → Models → Middleware → Validation → Utilities
```

### Security

Never expose:

- Database credentials
- JWT secrets
- AI API keys
- Payment secrets
- Cloudinary private credentials

Frontend code must never contain server-side secrets.

### Validation

Validate user input on both appropriate frontend and backend boundaries.

### Error Handling

Use consistent API responses and centralized backend error handling.

### Scalability

Avoid architecture that makes future modules difficult to add.

---

## 9. Database Principles

Use **MongoDB**.

Create collections/models based on actual requirements rather than automatically creating one collection for every UI component.

**Potential entities:**

```
User, Profile, Artwork, Portfolio, Tutorial, Resource,
Comment, Like, Bookmark, Follow, Product, Cart, Order,
Payment, DigitalAsset, LiveSession, SessionParticipant,
Notification, ChatMessage, Report, Analytics
```

Do not create all of these blindly. Determine the correct schema relationships during implementation.

---

## 10. Rules for Future AI Agents

Whenever you work on Nimisham:

1. Read `PROJECT.md` first.
2. Read `WORKPLAN.md`.
3. Read the relevant existing source code.
4. Identify the module being modified.
5. Check module dependencies.
6. Avoid breaking completed modules.
7. Do not duplicate existing functionality.
8. Do not introduce unnecessary dependencies.
9. Update documentation when architecture changes.
10. Update progress after meaningful implementation.
11. Test the changed functionality.
12. Never mark a feature complete if it is only a placeholder.

**File responsibilities:**

| File           | Purpose                                    |
| -------------- | ------------------------------------------ |
| `PROJECT.md`   | Authoritative functional specification     |
| `WORKPLAN.md`  | Authoritative development-progress document |
| `README.md`    | Public repository documentation            |
