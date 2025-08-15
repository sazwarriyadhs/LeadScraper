# Monorepo Layout

This project follows a standard Next.js project structure, which helps in organizing the different parts of the application.

## Directory Structure

- **`/src/app`**: Contains the main application routes and pages, following the Next.js App Router structure.
  - **`/(app)`**: This is a route group for all authenticated application pages. This helps in organizing files without affecting the URL path.
    - **`/dashboard/page.tsx`**: The main dashboard page component.
    - **`/leads/page.tsx`**: The page component for managing and viewing leads.
    - **`layout.tsx`**: A shared layout for the authenticated parts of the app, including the sidebar and header.
    - **`loading.tsx`**: A loading UI that is displayed while page content is loading.
  - **`api`**: Although not present yet, this is where your server-side API routes would go.
  - **`globals.css`**: Global stylesheet, including Tailwind CSS directives and theme variables.
  - **`layout.tsx`**: The root layout for the entire application.
  - **`page.tsx`**: The entry page of the application, which currently redirects to the dashboard.

- **`/src/components`**: Contains all the reusable React components.
  - **`/ui`**: Core UI components, mostly from `shadcn/ui`. These are general-purpose components like `Button`, `Card`, `Input`, etc.
  - **`/dashboard`**: Components that are specifically used on the dashboard page (e.g., charts, stat cards).
  - **`/leads`**: Components that are specifically used on the leads page (e.g., the lead scoring dialog).
  - **`app-sidebar.tsx`**: The main navigation sidebar component for the application.
  - **`header.tsx`**: The header component displayed at the top of the app pages.

- **`/src/lib`**: Contains utility functions, type definitions, client configurations, and data.
  - **`mock-data.ts`**: Contains the mock data used for the leads.
  - **`supabase.ts`**: Configuration for the Supabase client.
  - **`types.ts`**: TypeScript type definitions used across the application.
  - **`utils.ts`**: General utility functions, like `cn` for combining CSS classes.

- **`/src/ai`**: Contains all the Genkit AI-related code.
  - **`/flows`**: This directory holds the Genkit flows.
    - **`score-lead.ts`**: The flow responsible for analyzing and scoring a lead based on its properties.
  - **`dev.ts`**: A development server entry point for Genkit.
  - **`genkit.ts`**: The central Genkit configuration file where plugins and models are initialized.

- **`/public`**: For static assets that are served directly, such as images or fonts.

- **Configuration Files**:
  - **`next.config.ts`**: Configuration for the Next.js framework.
  - **`tailwind.config.ts`**: Configuration for Tailwind CSS.
  - **`tsconfig.json`**: TypeScript compiler options.
  - **`package.json`**: Lists project dependencies and scripts.
  - **`.env`**: For storing environment variables (not checked into version control).
  - **`feature.md`**: A markdown file describing the application features.
