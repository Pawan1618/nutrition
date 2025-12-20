# Nutrition Tracker

A modern, full-stack application for tracking nutrition, logging meals, and monitoring health progress. Built with Next.js 16, Supabase, and TailwindCSS v4.

## Features

-   **User Authentication**: Secure signup and login using Supabase Auth.
-   **Dashboard**: Overview of daily nutrition metrics (Calories, Carbs, Protein, Fat).
-   **Nutrition Logging**: Easy-to-use interface for logging meals and snacks.
-   **Progress Tracking**: Visual charts to monitor your nutritional intake over time.
-   **Profile Management**: Manage user details and tracking preferences.
-   **Responsive Design**: Fully responsive UI built with TailwindCSS for mobile and desktop.
-   **Dark/Light Mode**: Seamless theme switching support.

## Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
-   **Database & Auth**: [Supabase](https://supabase.com/)
-   **State Management & Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
-   **UI Components**: [Shadcn/ui](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/)
-   **Charts**: [Recharts](https://recharts.org/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Visual Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
-   **Testing**: [Vitest](https://vitest.dev/), React Testing Library

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

-   Node.js (v20 or newer recommended)
-   npm, yarn, pnpm, or bun

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/nutrition-tracker.git
    cd nutrition_tracker
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

-   `app/`: Next.js App Router pages and layouts.
-   `components/`: Reusable UI components.
-   `utils/`: Utility functions and Supabase client configuration.
-   `lib/`: Shared library code (e.g., utils).
-   `__tests__/`: Unit and integration tests.
-   `public/`: Static assets.

## Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the application for production.
-   `npm start`: Runs the built application in production mode.
-   `npm run lint`: Runs ESLint to check for code quality issues.
-   `npm test`: Runs the test suite using Vitest.
-   `npm run type-check`: Checks for TypeScript errors without emitting files.

## Deployment

This project is configured for deployment on Vercel or GitHub Pages.

For detailed instructions on deploying to **GitHub Pages**, please refer to [DEPLOYMENT.md](./DEPLOYMENT.md).

## License

This project is licensed under the MIT License.
