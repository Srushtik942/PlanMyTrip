# PlanMyTrip

**PlanMyTrip** is a fullstack web application that helps users plan their trips with AI-powered travel itineraries and catchy tourism taglines. The backend uses Node.js, Express, and OpenRouter AI, while the frontend can be built with any framework (React recommended).

---

## Features

- **AI Travel Plans:** Generates detailed travel itineraries for a given country following a structured JSON schema.
- **Catchy Taglines:** Creates 3 creative tourism taglines for any country.
- **Health Check Endpoint:** `/health` to verify the backend server is running.
- **JSON-only Responses:** Ensures all AI responses are valid JSON for easy parsing and integration.

---

## Tech Stack

- **Backend:** Node.js, Express, Axios, CORS, dotenv
- **AI Integration:** OpenRouter AI (`nvidia/nemotron-nano-12b-v2-vl`)
- **Frontend:** React (optional), can be deployed separately (Netlify, Render, Cloudflare Pages, etc.)

---

## Getting Started

### Prerequisites

- Node.js v18+
- NPM v9+
- OpenRouter AI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Srushtik942/PlanMyTrip.git
cd PlanMyTrip
