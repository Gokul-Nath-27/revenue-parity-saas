# Revenue Parity: Dynamic Pricing & Revenue Scaling Platform

## 1. Project Overview

Revenue Parity is a dynamic pricing platform designed for digital businesses to optimize global revenue by adjusting prices based on users' geographic locations and purchasing power. It enables businesses to configure and manage dynamic pricing for their "Products" (e.g., digital goods, services, or subscriptions), each potentially with unique pricing strategies for different markets, custom domain associations for targeted offers, and promotional capabilities like geo-targeted flash deals or PPP discounts. The target audience includes online businesses of all sizes, from SaaS providers and e-commerce stores to individual creators, looking for a flexible and performant tool to implement sophisticated geo-pricing strategies and enhance global sales accessibility.

Core functionalities include:
*   User authentication (credentials & OAuth) and management.
*   Configuration and management of "Products" for which dynamic pricing strategies will be applied.
*   Definition of geo-pricing rules, PPP discounts, and promotional parameters for these "Products".
*   Subscription management for Revenue Parity's different feature tiers.
*   (Advanced) Optional promotional banner generation for "Products" to display dynamic pricing and deals.

## 2. High-Level Architecture

Revenue Parity is built as a full-stack application leveraging Next.js 15.3, utilizing its App Router paradigm for both frontend rendering and backend API development.

**Text-Based Diagram:**

```
[User via Browser/Mobile]
       |
       v
[Next.js Frontend (App Router, React Server Components, Client Components)]  <-- (Static Assets, ISR, PPR) --> [Vercel Edge Network]
       |  ^
       |  | (API Calls: Webhooks via Route Handlers / Server Actions)
       v  |
[Next.js Backend (Route Handlers on Node.js & Edge Runtimes)]
       |
       +----------------------+----------------------+---------------------+
       |                      |                      |                     |
       v                      v                      v                     v
[PostgreSQL Database]  [Upstash Redis]     [Stripe API]      [OAuth Providers]
(NeonDB via Drizzle ORM) (Caching, Sessions) (Payments, Subs)  (Manual implementation with CSRF and PKCE protection)
```

**Key Architectural Decisions & Next.js 15.3 Leveraging:**

*   **Full-Stack with Next.js App Router**: The App Router serves as the backbone, enabling a unified developer experience for both UI (React Server Components, Client Components) and API logic (Route Handlers, Server Actions). This simplifies the stack and improves data colocation.
*   **React Server Components (RSCs)**: Extensively used for data fetching and rendering on the server, minimizing client-side JavaScript and improving initial page load times. Client Components are used for interactive UI elements.
*   **Partial Prerendering (PPR)**: Enabled (`ppr: true` in `next.config.js`) to deliver static shells quickly with dynamic content streamed in, enhancing perceived performance for complex pages.
*   **Static and Dynamic Rendering**:
    *   **Static Site Generation (SSG)**: Used for marketing pages, documentation, and other content that rarely changes.
    *   **Incremental Static Regeneration (ISR)**: Applied to frequently accessed but not real-time critical project views, balancing static benefits with data freshness. The `staleTimes` configuration in `next.config.js` is set to 0 for dynamic and static, indicating a preference for fresh data, possibly with efficient revalidation strategies.
    *   **Dynamic Rendering**: Employed for user-specific dashboards, project settings, and real-time interactive views.
*   **Edge Functions**: Critical API endpoints, like the promotional banner generation (`src/app/api/products/[productId]/banner/route.ts`), are deployed as Vercel Edge Functions (`runtime = 'edge'`). This ensures low latency responses globally by running code closer to the user.
*   **Scalability & Reliability**:
    *   Leveraging Vercel's global Edge Network for caching static assets, ISR pages, and Edge Function execution.
    *   Serverless functions for backend API routes scale automatically with demand.
    *   Upstash Redis for distributed caching and session management, offloading database load.

## 3. Technical Stack

*   **Core Framework**: Next.js 15.3 (using 15.4.0-canary.14)
    *   React 19.1.0
    *   TypeScript

*   **Backend**:
    *   Next.js API Routes (Route Handlers & Server Actions) running on Node.js and Vercel Edge Runtimes.
    *   Route Handlers --> for ***webhooks***
    *   Server Actions --> for form actions.

*   **Database**:
    *   PostgreSQL (hosted on Neon - `@neondatabase/serverless`)
    *   Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
   
*   **Caching**:
    *   Upstash Redis (`@upstash/redis`)
    *   **Justification**: Used for session management, caching frequently accessed data, and reducing database load, enhancing overall application responsiveness.
*   **Styling**:
    *   Tailwind CSS (`tailwindcss`)
    *   Radix UI Primitives (`@radix-ui/*`) for accessible component building blocks.
    *   `clsx`, `tailwind-merge` for utility class management.

*   **Authentication**:
    *   **Custom Implementation**: Revenue Parity employs a robust custom authentication system.
        *   **Credentials-based**: Secure sign-up and sign-in using email and password. Passwords are hashed using `crypto` (via custom wrappers in `src/lib/auth.ts` for `generateSalt`, `gethashedPassword`, and `checkCredential`).
        *   **OAuth 2.0**: Supports sign-in via Google and GitHub. Implemented with PKCE flow for enhanced security. OAuth provider logic is managed in `src/app/api/oauth/_providers/` and callback handling in `src/app/api/oauth/[provider]/route.ts`.
        *   **Session Management**: Custom session management (`src/lib/session.ts`) utilizing Redis (Upstash) for storing session data and secure HTTPOnly cookies (`session-key`) for session IDs. Sessions have defined expiration and are updated on activity.
    *   **Justification**: A custom solution provides fine-grained control over authentication flows, session storage (leveraging Redis for scalability), and direct integration with the application's specific needs (e.g., user schema, permissions). This approach allows for tailored security measures like PKCE for OAuth and robust credential handling.
*   **Payments**:
    *   Stripe (`stripe`)

*   **Deployment & Hosting**:
    *   Vercel

*   **Other Key Libraries**:
    *   Zod (`zod`): For data validation.
    *   Nodemailer (`nodemailer`): For transactional emails.



## 4. Database Schema and Architecture

*   **Type**: Relational (PostgreSQL, managed by Neon).
*   **ORM**: Drizzle ORM.
*   **High-Level Schema Overview**:
    *   `users`: Stores user information (ID, name, email, hashed password, salt, role, password reset tokens). Manages relationships to OAuth accounts, user-created "Products", and subscriptions.
    *   `products`: Represents the user's digital goods, services, or subscriptions for which dynamic pricing strategies are configured. Includes `user_id` (owner), `name`, unique `domain` (for specific offers/landing pages), `description`. Has relations for pricing customizations, analytics (views/conversions), and country-specific discount rules.
    *   `subscriptions`: Manages user subscription status, likely linked to Stripe plans.
    *   `oauth_accounts`: Stores OAuth provider information linked to users.
    *   `product_customizations`: Details for customizing the appearance or behavior of a "Product".
    *   `product_views` / `visits`: Tracks engagement with "Products".
    *   `country_discounts`: Manages discounts applicable based on country, linked to "Products".
    *   Schema files are modularly organized under `src/drizzle/schemas/`.
*   **Integration with Next.js**:
    *   Drizzle ORM is used within Server Components, Server Actions, and API Route Handlers for type-safe database queries.
    *   Queries are optimized for performance, especially in data-fetching functions called by Server Components to ensure fast server-side rendering.
    *   Indexing is applied to frequently queried columns (e.g., `products.user_id`, `products.domain`).

    https://github.com/user-attachments/assets/77a171f1-ea37-4928-81c6-850c52584a57

## 5. API Design

*   **Structure**: Primarily Next.js API Route Handlers located within the `src/app/api/` directory, following the App Router conventions. Server Actions may also be used for form submissions and mutations directly from Server Components.
*   **Examples**:
    *   `/api/oauth/[provider]/route.ts`: Handles OAuth authentication callbacks for providers like Google and GitHub.
    *   `/api/products/*`: CRUD operations and other actions related to "Products".
        *   e.g., `GET /api/products/[productId]/banner`: An Edge Function that generates dynamic JavaScript banners based on product ID and geo-location.
    *   `/api/webhook/stripe`: Handles incoming webhooks from Stripe for events like payment success or subscription updates.
*   **Authentication/Authorization**:
    *   **Authentication Scheme**: Utilizes a custom session-based authentication system.
        *   **Session Tokens**: Secure, HTTPOnly cookies (`session-key`) store session IDs, with session data persisted in Redis (Upstash).
        *   **Credentials Flow**: Server Actions (e.g., `signIn`, `signUp` in `src/features/account/actions.ts`) handle email/password authentication, with password hashing performed by `crypto`.
        *   **OAuth 2.0 Flow**: Initiated by Server Actions (`oAuthSignIn`), with dedicated API Route Handlers (`/api/oauth/[provider]/route.ts`) managing provider callbacks and user provisioning. ***PKCE*** is implemented for security.
    *   **Authorization Logic**:
        *   **Route Protection**: `src/middleware.ts` protects routes based on authentication status (public vs. private paths defined in `src/lib/routeConfig.ts`), redirecting unauthenticated users from private paths.
        *   **Role-Based Access Control (RBAC)**: The `User` schema includes a `role` field, and session data (`UserSession`) contains user `id`, `role`, and `tier`. This information is used for fine-grained access control.
        *   **Protected Actions/Functions**: The `withAuthUserId` higher-order function (`src/lib/with-auth.tsx`) provides a pattern for ensuring functions are executed only by authenticated users, passing the `userId` for further processing.
    *   A permissions system (`@/permissions`) is in place to control access to resources and features based on user roles or subscription status (e.g., `canShowDiscountBanner`, `canRemoveBranding`).
*   **Security Practices**:
    *   CSRF protection for OAuth
    *   Input validation using Zod on API inputs and Server Action arguments.
    *   `poweredByHeader: false` in `next.config.js`.


## 6. Deployment and Infrastructure

*   **Deployment Platform**: Vercel.
*   **CI/CD**: Managed via Vercel's seamless Git integration (e.g., deploying on push to main/production branches), which streamlines the development workflow and accelerates iteration cycles.
*   **Code Quality & Maintainability**: Pre-commit hooks managed by Husky and lint-staged (`lint-staged` configuration in `package.json`) enforce code style and quality checks before commits, contributing to long-term maintainability and a consistent codebase.
*   **Infrastructure Highlights**:
    *   **Edge Network**: Serves static assets, caches pages (SSG/ISR), and runs Edge Functions.
    *   **Serverless Functions**: Next.js API routes and Server Components are deployed as serverless functions, which scale automatically.

    *   **Upstash Redis**: Provides scalable caching and session store.
*   **Supporting Scalability & Operations**:

    *   **Edge Functions**: For globally distributed, low-latency API endpoints.
    *   **Partial Prerendering (PPR)**: Improves TTFB and LCP for dynamic pages.
    *   **Vercel Speed Insights** (`@vercel/speed-insights`): Integrated for monitoring Core Web Vitals and application performance.
    *   **Logging** (`logging.fetches.fullUrl: true` in `next.config.js`) provides detailed information for debugging fetch requests.
*   **Fault Tolerance & Monitoring**:
    *   Vercel provides infrastructure resilience and monitoring.
    *   Application-level error handling (`catchError` utility) and logging.

## 7. Key Features and Technical Challenges

**Key Features Enabled:**

1.  **Dynamic, Geo-Targeted Promotional Banners**:
    *   Implemented via an Edge Function (`src/app/api/products/[productId]/banner/route.ts`).
    *   Leverages `request.geo` for country detection and Drizzle ORM for fetching product/discount info.

2.  **Highly Performant "Product Pricing" Dashboards with Parital Pre-rendering**:
    *   User-specific dashboards for managing "Product" pricing strategies and analytics.
    *   Partial Prerendering (`ppr: true`) is set to true to delivers a fast initial static shell for these potentially complex pages, with user-specific or dynamic data streamed in, significantly improving perceived performance and LCP. Server Components fetch data efficiently on the server.
3.  **Custom Domains for User-Configured "Products" (for targeted offers/pricing pages)**:
    *   Users can map custom domains to their "Products" (as defined in `src/drizzle/schemas/product.ts` via the `domain` field).
    
4.  **SEO-Optimized Public "Product" Offer Pages (if applicable)**:
    *   If "Products" can be public, their pages can be statically generated (SSG) or server-rendered with proper metadata for SEO.
    *   **Next.js Benefit**: Flexible rendering options (SSG, SSR, ISR) and built-in metadata API make it easier to create SEO-friendly pages.

**Technical Challenges Overcome:**

1.  **Optimizing Data Fetching for Server Components**:
    *   **Challenge**: Ensuring efficient data fetching patterns within Server Components to avoid performance bottlenecks, especially with complex relational data from Drizzle ORM.
    *   **Solution**: Carefully structuring data queries, utilizing Drizzle's features for selecting only necessary fields, and parallelizing data fetches where possible. Leveraging Server Component composition to isolate data dependencies.
2.  **Managing State Across Server and Client Components**:
    *   **Challenge**: Effectively managing state and interactivity when mixing RSCs (server-rendered, non-interactive by default) with Client Components.
    *   **Solution**: Strategically placing 'use client' boundaries, using props to pass data from RSCs to Client Components, and leveraging React context or Zustand/Jotai (if used, not explicitly seen but common) for complex client-side state shared across multiple interactive islands. Passing Server Actions as props to Client Components for mutations.
3.  **Implementing Robust Geo-IP Logic on the Edge**:
    *   **Challenge**: Reliably determining user location for features like geo-targeted banners while handling cases where IP geolocation might be unavailable or inaccurate, all within the constraints of Edge Functions.
    *   **Solution**: Using `request.geo` on Vercel, implementing fallbacks (e.g., `process.env.TEST_COUNTRY_CODE`), and designing the API to gracefully handle missing geo-information, ensuring the banner logic is resilient.

## 8. Future Improvements


1.  **Advanced Caching Strategies with Granular Invalidation**:
    *   Implement more sophisticated caching layers using Upstash Redis for computed data or aggregated query results.
    *   Develop fine-grained cache invalidation logic (e.g., tag-based or path-based revalidation triggered by data changes) to improve data freshness while maximizing cache hits, especially given `staleTimes: 0`. This will further enhance perceived performance and reduce database load.
2.  **Real-time Collaboration Features**:
    *   Integrate WebSockets (e.g., using a service like Ably or self-hosted solution) for real-time updates or collaborative features related to "Product" pricing configurations. This would significantly enhance team productivity and user engagement by enabling simultaneous work and instant updates.

## 9. Getting Started

To facilitate a smooth onboarding experience for developers and enable local contributions, the following setup steps are provided:

**Prerequisites**:
*   Node.js (version compatible with Next.js 15.3, e.g., v18.17+ or v20.x)
*   pnpm (package manager, based on `pnpm-lock.yaml`)
*   Access to a PostgreSQL database (e.g., local instance or Neon free tier)
*   Access to Upstash Redis (optional for local dev, or free tier)
*   Stripe account and API keys (for payment features)

**Installation**:
1.  Clone the repository:
    ```bash
    git clone https://github.com/Gokul-Nath-27/revenue-parity-saas
    cd revenue-parity-saas
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Set up environment variables:
    *   Copy `.env.example` (if available) to `.env.local` (create `.env.local` if no example exists):
        ```bash
        cp .env.example .env.local # If .env.example exists
        # Otherwise, create an empty .env.local
        touch .env.local
        ```
    *   Fill in the required variables in `.env.local`. Below are the key variables used by the application. Ensure you provide your own secure values:
        *   **Database (Neon PostgreSQL):**
            *   `NEON_DATABASE_URL`: Your Neon PostgreSQL connection string.
        *   **Redis (Upstash):**
            *   `UPSTASH_REDIS_REST_URL`: Your Upstash Redis REST URL.
            *   `UPSTASH_REDIS_REST_TOKEN`: Your Upstash Redis REST Token.
        *   **Stripe (Payments):**
            *   `STRIPE_SECRET_KEY`: Your Stripe secret key.
            *   `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret for handling events.
            *   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key.
            *   `NEXT_PUBLIC_STRIPE_STANDARD_PLAN_STRIPE_PRICE_ID`: Stripe Price ID for the standard plan.
            *   `NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_STRIPE_PRICE_ID`: Stripe Price ID for the premium plan.
        *   **Authentication & Application URLs:**
            *   `BASE_URL_DEV`: The base URL for local development (e.g., `http://localhost:3000`). Used for constructing OAuth redirect URIs and other absolute URLs.
            *   `BASE_URL`: The base URL for the production deployment (e.g., `https://your-deployed-app.com`). Used similarly for production.
            *   `GITHUB_CLIENT_ID`: Your GitHub OAuth App Client ID.
            *   `GITHUB_CLIENT_SECRET`: Your GitHub OAuth App Client Secret.
            *   `GITHUB_CLIENT_ID_DEV`: Your GitHub OAuth App Client ID for development.
            *   `GITHUB_CLIENT_SECRET_DEV`: Your GitHub OAuth App Client Secret for development.
            *   `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
            *   `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret.
        *   **Email (Gmail/Nodemailer):**
            *   `GMAIL_USER`: The Gmail account used for sending emails.
            *   `GMAIL_APP_PASSWORD`: The Gmail App Password for Nodemailer.
        *   **Other/Testing:**
            *   `TEST_COUNTRY_CODE`: A default country code for testing geo-specific features (e.g., `IN`).
4.  Apply database migrations using Drizzle Kit:
    ```bash
    pnpm run migrate
    # or pnpm run push (depending on Drizzle Kit workflow preferred)
    ```
5.  Seed initial database data (e.g., country groups, countries for pricing parity):
    ```bash
    pnpm run updateCountryGroups
    ```
6.  Set up OAuth providers (for social login):
    * **GitHub OAuth:**
      1. Go to GitHub Developer Settings > OAuth Apps > New OAuth App
      2. Set Homepage URL to `http://localhost:3000`
      3. Set Authorization callback URL to `http://localhost:3000/api/oauth/github`
      4. Copy the Client ID and generate a Client Secret
      5. Add to your `.env.local`:
         ```
         GITHUB_CLIENT_ID_DEV=your_github_client_id
         GITHUB_CLIENT_SECRET_DEV=your_github_client_secret
         ```

    * **Google OAuth:**
      1. Go to Google Cloud Console > Create Project > APIs & Services > OAuth consent screen
      2. Set up the consent screen, then go to Credentials > Create OAuth client ID
      3. Set Application type to "Web application"
      4. Add `http://localhost:3000/api/oauth/google` as an authorized redirect URI
      5. Copy the Client ID and Client Secret
      6. Add to your `.env.local`:
         ```
         GOOGLE_CLIENT_ID=your_google_client_id
         GOOGLE_CLIENT_SECRET=your_google_client_secret
         ```

7.  Set up email sending (optional, for password resets and notifications):
    * For Gmail:
      1. Enable 2-Factor Authentication on your Gmail account
      2. Generate an App Password: Google Account > Security > App Passwords
      3. Add to your `.env.local`:
         ```
         GMAIL_USER=your_gmail_address
         GMAIL_APP_PASSWORD=your_app_password
         ```

8.  (Optional) Create a demo guest user for testing:
    ```bash
    pnpm run seed:guest
    ```
    This creates a guest account you can use to explore the application without registration.

9.  Run the development server:
    ```bash
    pnpm run dev
    ```
    The application should now be running on `http://localhost:3000`.
7.  Set up Stripe for local development:
    ```bash
    # Install Stripe CLI from https://stripe.com/docs/stripe-cli
    # Then authenticate with your Stripe account
    stripe login
    
    # In a separate terminal, run the Stripe webhook listener
    pnpm run stripe
    ```
    This will forward Stripe webhook events to your local server, enabling testing of payment flows and subscription events during development.

    **Stripe Product & Price Configuration:**
    1. In your Stripe Dashboard, create two Products:
       - A "Standard" subscription product
       - A "Premium" subscription product
    2. For each product, create a recurring Price:
       - Standard: $20/month
       - Premium: $49/month
    3. Copy the Price IDs from Stripe and add them to your `.env.local`:
       ```
       NEXT_PUBLIC_STRIPE_STANDARD_PLAN_STRIPE_PRICE_ID=price_xxx...
       NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_STRIPE_PRICE_ID=price_yyy...
       ```
    4. These price IDs are used in `src/data/subscriptionTiers.ts` to link the application's subscription tiers to the Stripe payment system.

8.  (Optional) Inspect the local database using Drizzle Studio:
    ```bash
    pnpm run studio
    ```
