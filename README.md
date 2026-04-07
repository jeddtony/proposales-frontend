# Proposale Frontend

A luxury hotel sales management platform that streamlines the end-to-end process of handling event enquiries, generating AI-powered proposals, and managing client relationships — all from a single, elegant dashboard.

## What the App Does

Proposale is a digital concierge tool built for hotel sales teams. When a potential client submits an event enquiry (RFP), the platform guides the sales team through every step: reviewing the request, chatting with an AI assistant to refine the proposal, previewing and generating a polished proposal document, and tracking the client relationship over time.

### Key Features

- **Public Landing Page** — A luxury marketing page where prospective clients can browse venue spaces and submit event enquiries directly.
- **RFP Inbox** — A split-panel inbox for managing incoming proposal requests. Each request can be reviewed, responded to via AI chat, and progressed through a proposal lifecycle (Inquiry → Draft → Proposal).
- **AI Chat** — A built-in chat interface powered by a backend AI assistant. Sales staff can converse with the AI to shape and refine proposal content, then preview the generated proposal at any time.
- **Proposal Preview** — A full-screen modal that renders the AI-generated proposal with the venue's branding, background imagery, and structured content blocks. Proposals can be created or regenerated directly from the preview.
- **Content Management** — A library for managing venue content (spaces, packages, experiences) that feeds into proposal generation. Supports individual create/edit/delete and bulk upload via Excel (.xlsx).
- **Clients** — A paginated directory of all clients who have submitted enquiries, showing contact details, company, total requests, and last activity.
- **Analytics Dashboard** — An overview of key sales metrics and activity across the platform.
- **Authentication** — Session-based login with automatic redirect to the login page on session expiry.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| Markdown rendering | react-markdown + remark-gfm |
| Excel generation | SheetJS (xlsx) |
| Icons | Lucide React |

## Project Structure

```
src/
├── api/              # API client, resource classes, and TypeScript interfaces
├── components/
│   ├── content/      # Content management modals and cards
│   ├── layout/       # AppLayout, SideNav, TopBar
│   ├── proposal/     # ProposalPreviewModal, ProposalHero, content blocks
│   ├── rfp/          # RFP inbox components, chat panel, lifecycle tracker
│   └── ui/           # Shared UI (SuccessToast)
├── pages/            # Route-level page components
├── types/            # Shared TypeScript types
└── lib/              # Utility functions (cn)
images/               # Static venue photography
```

## Getting Started

### Prerequisites

- Node.js 18+
- A running instance of the Proposale backend API

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3000
```

### Install and Run

```bash
npm install
npm run dev
```

### Build for Production

```bash
npm run build
```

## Routes

| Path | Description |
|---|---|
| `/` | Public landing page |
| `/login` | Authentication |
| `/dashboard` | Analytics overview |
| `/inbox` | RFP inbox |
| `/content` | Content library |
| `/clients` | Client directory |
| `/proposal/view` | Standalone proposal viewer |
