# PDF to LaTeX Converter

A web application that converts PDF documents to LaTeX format.

## Features

- Clean, intuitive UI built with React and TypeScript
- PDF to LaTeX conversion backend
- Responsive design with TailwindCSS
- Component-based architecture using shadcn/ui

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Python
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Python 3.7+

### Installation

```bash
# Install dependencies
pnpm install

# Install Python dependencies (if needed)
pip install -r requirements.txt
```

### Development

```bash
# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

- `app/` - Next.js app directory with layout and pages
- `components/` - Reusable UI components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions
- `scripts/` - Backend scripts (Python)
- `public/` - Static assets

## License

MIT
