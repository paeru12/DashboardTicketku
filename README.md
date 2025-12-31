# Tiket.ku - Event Ticketing Platform

A modern React-based event ticketing and management platform built with **React JavaScript** (migrated from TypeScript for easier development).

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Build](#build)
- [Migration Notes](#migration-notes)

## 🎯 Overview

Tiket.ku is a comprehensive super admin dashboard for managing:
- **Events** - Create, publish, and manage events
- **Event Admins** - Manage event administrators with add/edit/delete functionality
- **Users** - Manage platform users with role-based filtering
- **Settings** - Configure platform-wide settings
- **Dashboard** - View platform statistics and analytics

### TypeScript to JavaScript Migration

This project was originally built with **React + TypeScript** but has been converted to **React + JavaScript** for the following reasons:
- **Easier development** - Faster iteration without compilation overhead
- **Simpler debugging** - Direct JavaScript execution without type transpilation
- **Lighter build** - Reduced bundle size and faster build times
- **More accessible** - Easier onboarding for developers less familiar with TypeScript

## 🛠 Technology Stack

### Core Framework
- **React** 19.0.0 - UI library
- **React Router** 6.30.1 - Client-side routing
- **Vite** 5.4.19 - Fast build tool and dev server
- **@vitejs/plugin-react-swc** 3.14.0 - Lightning-fast SWC compiler for React

### State Management & Data Fetching
- **TanStack React Query** 5.83.0 - Server state management and data fetching
- **React Context API** - Local state management (built-in)

### Styling & UI Components
- **Tailwind CSS** 3.4.17 - Utility-first CSS framework
- **shadcn/ui** - Pre-built, customizable React components
- **Lucide React** 0.462.0 - Beautiful icon library

### Form Handling & Validation
- **React Hook Form** 7.61.1 - Performant, flexible form validation
- **Zod** 3.25.76 - TypeScript-first schema validation

### Notifications
- **Sonner** 1.7.0 - Elegant toast notifications

### Development Tools
- **ESLint** 9.16.0 - Code linting
- **PostCSS** 8.4.47 - CSS processing
- **date-fns** 3.6.0 - Date manipulation utility

## ✨ Features

### Dashboard
- 📊 Real-time statistics and KPIs
- 📈 Revenue tracking and growth metrics
- 🎫 Latest events overview
- 👥 User management metrics

### Event Management
- ✅ Create and publish events
- 🔄 Edit event details (status, dates, pricing)
- 📅 Event scheduling with date/time selection
- 🎫 Ticket inventory management
- 🔍 Event filtering by status (draft, published, ongoing, completed, cancelled)

### Event Admin Management
- ➕ Add new event administrators
- ✏️ Edit admin details (name, email, phone, status)
- 🗑️ Delete event admins
- 🔍 Search and filter admins
- 📢 Toast notifications for all actions (add/edit/delete success/error)
- ✅ Form validation with error messages

### User Management
- 👥 View all platform users
- 🔍 Search users by name or email
- 🏷️ Filter users by role (Super Admin, Event Admin, Scan Staff, Customer)
- 📊 Display user status and roles with icons

### Settings
- ⚙️ Configure platform name
- 📧 Set support email
- 🌍 Timezone selection
- 💱 Currency configuration
- 💾 Save and persist settings

### UI/UX Features
- 🌓 Dark-themed sidebar navigation (slate-900 background)
- 📱 Responsive design (mobile, tablet, desktop)
- ⌨️ Keyboard navigation (Escape to close modals)
- 🎨 Consistent color scheme and typography
- ⚡ Smooth transitions and animations
- 🔔 Toast notifications for user feedback
- 💬 Modal dialogs for forms and confirmations

## 📁 Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── DataTable.jsx          # Reusable data table component
│   │   ├── LoadingSpinner.jsx     # Loading indicator
│   │   ├── PageHeader.jsx         # Page header with title & actions
│   │   ├── StatusBadge.jsx        # Status badge display
│   │   └── Toast.jsx              # Toast notification context & provider
│   ├── superadmin/
│   │   ├── AddEventAdminDialog.jsx      # Add admin form dialog
│   │   ├── EditEventAdminDialog.jsx     # Edit admin form dialog
│   │   ├── EventAdminModal.jsx
│   │   └── StatCard.jsx           # Statistics card component
│   └── ui/                        # shadcn/ui components
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.jsx      # Context-based dropdown with state
│       ├── input.tsx
│       ├── select.jsx             # Context-based select with state
│       └── ... (30+ UI components)
├── hooks/
│   ├── use-mobile.tsx             # Mobile breakpoint detection
│   └── use-toast.ts               # Toast notification hook
├── layouts/
│   └── AppLayout.jsx              # Main layout with sidebar & header
├── pages/
│   ├── Index.jsx                  # Home page
│   ├── NotFound.jsx               # 404 page
│   └── superadmin/
│       ├── Dashboard.jsx          # Super admin dashboard
│       ├── Events.jsx             # Events management page
│       ├── EventAdmins.jsx        # Event admins management page
│       ├── Users.jsx              # Users management page
│       └── Settings.jsx           # Platform settings page
├── services/
│   └── superadminApi.js           # Mock API and data fetching
├── types/
│   └── index.js                   # Shared type definitions
├── lib/
│   └── utils.js                   # Utility functions (cn for class merging)
├── App.jsx                        # Root component with routing
├── main.jsx                       # Entry point
├── vite-env.d.ts                  # Vite environment types
└── index.css                      # Global styles with Tailwind imports
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 16.x or higher
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ticket
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:8081/`

4. **Open in browser**
   Navigate to http://localhost:8081 and login to the super admin dashboard

## 💻 Development

### Available Scripts

**Start development server**
```bash
npm run dev
```
- Runs on http://localhost:8081 (or next available port)
- Hot Module Replacement (HMR) enabled for instant updates
- Development mode with source maps

**Build for production**
```bash
npm run build
```
- Optimizes and minifies code
- Generates production-ready bundle in `dist/` directory
- Build time: ~6-9 seconds

**Preview production build**
```bash
npm run preview
```
- Serves the production build locally
- Useful for testing optimized version before deployment

**Lint code**
```bash
npm run lint
```
- Checks code quality with ESLint
- Applies JavaScript best practices

### Environment Setup
- **Dev Server Port**: 8081 (default, falls back to next available)
- **Build Output**: `dist/` directory
- **API**: Mock data in `src/services/superadminApi.js` (can be replaced with real API)

## 🔨 Build

### Production Build
```bash
npm run build
```

**Build Output:**
- `dist/index.html` - HTML entry point (1.40 KB)
- `dist/assets/index-*.css` - Compiled CSS (18.32 KB, gzipped: 4.38 KB)
- `dist/assets/index-*.js` - Bundled JavaScript (310 KB, gzipped: 94 KB)
- **Total modules**: 1957

### Performance Metrics
- **Build Time**: ~6-9 seconds
- **Uncompressed CSS**: 18.32 KB
- **Gzip CSS**: 4.38 KB
- **Uncompressed JS**: 310 KB
- **Gzip JS**: 94 KB

## 📝 Key Implementation Details

### State Management Pattern
The application uses a combination of:
- **React Hooks** (useState, useEffect) for component state
- **React Context** for global state (ToastProvider, dropdowns)
- **React Query** for server state and caching

### Form Handling
- **React Hook Form** manages form state efficiently
- **Zod** validates form inputs with clear error messages
- Custom validation for email and phone formats
- Toast notifications provide immediate user feedback

### Dropdown & Select Components
- Custom context-based implementation for better control
- Click-outside detection closes dropdowns automatically
- Escape key handler for keyboard navigation
- Smooth state transitions

### Toast Notifications
- Context-based `ToastProvider` wraps the application
- `useToast()` hook for simple notification triggering
- Auto-dismiss functionality with customizable duration
- Support for success, error, warning, and info types
- Floating position with stacking support

### Dialog/Modal Forms
- `AddEventAdminDialog` - New admin creation with validation
- `EditEventAdminDialog` - Admin details update with pre-filled data
- Both integrated with Toast for user feedback
- Auto-refresh list after successful submission
- Auto-close dialog on success

## 🔄 Migration Notes

### TypeScript → JavaScript Changes

#### File Extensions
- `.ts` → `.js`
- `.tsx` → `.jsx`

#### Type Definitions
- Removed type annotations from function signatures
- Removed interface and type definitions
- Added JSDoc comments for documentation (optional)
- Runtime validation with Zod instead of TypeScript types

#### Configuration Updates
- **vite.config.js** - Updated from TypeScript config
- **jsconfig.json** - Created with path alias configuration
- **tailwind.config.js** - Updated from TypeScript config with content glob fixes
- **eslint.config.js** - Updated for JavaScript linting

#### Key Fixes Applied
1. **Tailwind CSS Content Globs** - Updated to scan `.js/.jsx` files instead of only `.ts/.tsx`
2. **Dropdown Components** - Refactored to use React Context for proper state management
3. **Select Components** - Fixed auto-close behavior and click-outside handling
4. **Settings Page** - Fixed undefined component reference

#### Benefits Realized
✅ Faster iteration during development
✅ Simpler debugging workflow
✅ Reduced build times
✅ Smaller final bundle size
✅ Better HMR performance

## 📦 Dependencies Summary

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.3.1 | UI library |
| react-router-dom | 6.30.1 | Routing |
| vite | 5.4.19 | Build tool |
| @tanstack/react-query | 5.83.0 | Data fetching |
| tailwindcss | 3.4.17 | Styling |
| react-hook-form | 7.61.1 | Form handling |
| zod | 3.25.76 | Validation |
| lucide-react | 0.462.0 | Icons |
| sonner | 1.7.0 | Notifications |
| date-fns | 3.6.0 | Date utilities |

## 🎨 Design System

### Color Palette
- **Primary**: Blue (for active states, accents)
- **Success**: Green (for positive actions)
- **Destructive**: Red (for delete, error states)
- **Muted**: Gray (for secondary text)
- **Background**: White (light mode), with dark sidebar (slate-900)

### Spacing Scale
- Uses Tailwind's default spacing scale (0, 1, 2, 4, 6, 8, etc.)
- Consistent 4px base unit

### Typography
- **Heading**: 24px, bold (page titles)
- **Body**: 14px, regular (content)
- **Small**: 12px, regular (labels, hints)
- Font: System default (sans-serif)

## 📱 Responsive Design

- **Mobile**: < 768px (full-width layout, collapsible sidebar)
- **Tablet**: 768px - 1024px (adapted layout)
- **Desktop**: > 1024px (full sidebar visible)

Mobile menu toggle available on screens < 1024px

## 🔐 API Integration

The application uses mock data in `src/services/superadminApi.js` for demonstration. To integrate with a real API:

1. Replace mock data with actual API endpoints
2. Update function calls to use `fetch` or `axios`
3. Maintain the same function signatures for compatibility
4. Update error handling as needed

## 🚢 Deployment

The `dist/` folder generated by `npm run build` is ready for deployment to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## 📄 License

This project is part of the Tiket.ku platform.

## 👨‍💻 Development

This project was converted from TypeScript to JavaScript to provide a more accessible development experience while maintaining modern React practices and best-in-class tooling.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/67cdc3b3-50f7-47cb-bad8-edf34776833f) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
