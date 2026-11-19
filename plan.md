# PIZZORA — Complete Full-Stack Pizza Ordering & Delivery Platform

## 1. Project Overview

Act as a Senior Full-Stack Software Engineer, UI/UX Designer, Backend Architect, Database Designer, and Security Engineer.

Build a complete, professional, production-ready pizza ordering and delivery platform named **Pizzora**.

Pizzora is a multi-vendor pizza marketplace where customers can discover restaurants, browse pizza menus, view product details, and place orders. Restaurant owners (vendors) can manage their restaurants, publish menu items, and manage customer orders. Administrators can manage users, approve menu items, and monitor platform transactions.

This must be a fully functional full-stack web application, NOT just a static frontend or UI prototype.

Every button, form, navigation link, dashboard action, filter, search, and API integration must work correctly.

### Main Objectives

- Build a premium pizza marketplace.
- Implement three role-based user experiences.
- Implement secure authentication and authorization.
- Build a complete menu management system.
- Implement customer order management.
- Implement vendor subscription management.
- Integrate Stripe Checkout and Webhooks.
- Build secure Express.js APIs.
- Use MongoDB for data storage.
- Create professional, responsive dashboards.
- Deploy the application successfully.

---

# 2. Brand Identity & Design Direction

## Brand Name
Pizzora

## Tagline
"Freshly Baked. Perfectly Delivered."

## Brand Personality

- Premium
- Modern
- Delicious
- Friendly
- Professional
- Trustworthy

## Color Palette

Use a consistent pizza-inspired color system.

- Primary: Tomato Red (#D9362B)
- Secondary: Warm Orange (#F28C28)
- Accent: Golden Yellow (#FFC857)
- Background: Warm Cream (#FFF7ED)
- Surface: White (#FFFFFF)
- Text: Deep Charcoal (#252525)
- Muted: Warm Gray (#777777)
- Success: Green
- Error: Red

Use CSS variables or Tailwind theme variables for consistent colors.

## Visual Design Requirements

Create a premium restaurant marketplace experience inspired by modern food delivery platforms, but do not directly copy their layouts.

Use:

- Large appetizing pizza photography.
- Premium food product cards.
- Clean typography.
- Beautiful whitespace.
- Rounded corners.
- Soft shadows.
- Elegant hover effects.
- Consistent button styles.
- Modern navigation.
- Smooth transitions.
- Professional dashboard layouts.

Avoid:
- Generic AI-generated dashboard appearance.
- Excessive gradients.
- Too many animations.
- Unnecessary decorative elements.
- Inconsistent spacing.
- Different card sizes.
- Cluttered layouts.

Use high-quality pizza images and restaurant imagery. Use ImgBB for uploaded vendor menu images.

Make the website visually distinctive and professionally designed.

---

# 3. Technology Stack

Use the following technologies.

## Frontend

- Next.js with App Router
- TypeScript
- Tailwind CSS
- ShadCN UI
- Lucide React
- Framer Motion
- React Toastify
- React Hook Form where appropriate
- Zod for validation where appropriate

## Backend

- Node.js
- Express.js
- TypeScript or JavaScript
- MongoDB
- MongoDB Native Driver
- JWT verification middleware

## Authentication

- Better Auth
- MongoDB adapter
- Google OAuth
- Email and password authentication
- Role-based authorization

## Payment

- Stripe Checkout
- Stripe Webhooks

## Image Hosting

- ImgBB API

## Deployment

- Frontend: Vercel
- Backend: Render or another suitable Node.js hosting service
- Database: MongoDB Atlas

Keep the frontend and backend in separate GitHub repositories.

Do not use Mongoose. Use the MongoDB Native Driver.

---

# 4. User Roles and Permissions

The application must support three roles.

## A. Customer

Customers can:

- Register and log in.
- Browse all approved and active menu items.
- Search pizzas by name.
- Filter by category and location.
- Sort by price.
- View detailed menu item information.
- View restaurant information.
- Place orders.
- View their own orders.
- Track order statuses.
- Cancel pending orders.
- Update their profile.

Customers cannot:

- Access vendor dashboards.
- Access admin dashboards.
- Manage menu items.
- Change their own role.
- Change their subscription status.
- Cancel accepted, rejected, or already cancelled orders.
- Order their own menu items if they also have vendor privileges.

## B. Vendor

Vendors can:

- Register as restaurant owners.
- Create and manage restaurant profiles.
- Add menu items.
- Update their own menu items.
- Delete their own menu items.
- Manage item availability.
- View menu approval status.
- View customer orders belonging to their restaurant.
- Accept pending orders.
- Reject pending orders.
- View dashboard statistics.
- Manage subscriptions.
- Upgrade to Premium.
- Update their profiles.

Vendors cannot:

- Manage another vendor's menu items.
- Access admin functionality.
- Accept or reject another vendor's orders.
- Change their own role.
- Manually activate Premium.
- Modify transaction records.

## C. Admin

Admin has complete platform management permissions.

Admin can:

- View dashboard statistics.
- View all registered users.
- Search users by name and email.
- Filter users by role.
- Block and unblock users.
- View all submitted menu items.
- Approve pending menu items.
- Reject menu items.
- Change published item status.
- Delete inappropriate menu items.
- View all platform transactions.
- Monitor platform activity.

Admin cannot:

- Change payment records to manually mark failed payments as successful.
- Bypass Stripe payment verification.

Important: Admin accounts must never be created through public registration. Seed or assign admin access securely through a protected server-side process.

---

# 5. Authentication System — Better Auth

Implement Better Auth with MongoDB.

## Registration Page

Fields:

- Full Name
- Email
- Password
- Profile Image (Optional)
- Account Role (Customer / Vendor)

Password requirements:

- Minimum 6 characters.
- At least one uppercase letter.
- At least one lowercase letter.

Features:

- Email and password registration.
- Google authentication.
- Form validation.
- Loading states.
- Success and error notifications.
- Redirect users based on their roles.

## Login Page

Fields:

- Email
- Password

Features:

- Email/password login.
- Google login.
- Error handling.
- Loading indicators.
- Toast notifications.
- Role-based redirection.

## Authentication Security

- Use Better Auth for authentication.
- Secure all authentication secrets using environment variables.
- Never store plaintext passwords.
- Ensure session persistence.
- Update the navbar immediately when authentication state changes.
- Properly handle expired sessions.
- Protect private routes.
- Prevent blocked users from accessing protected functionality.

## JWT Integration

The Express backend must verify JWT tokens for protected API requests.

Implement a secure, compatible token strategy between Better Auth and Express.

Do not assume a Better Auth session cookie is automatically a JWT.

Configure an appropriate supported JWT issuance mechanism, such as the Better Auth JWT plugin or another documented compatible strategy.

The frontend must send the required bearer token when calling protected backend APIs.

Backend must:

- Verify token signatures.
- Validate expiration.
- Reject invalid tokens.
- Identify the authenticated user.
- Retrieve authoritative role information from the database.
- Never trust client-provided roles or user IDs.

Return:
- 401 for unauthenticated or invalid authentication.
- 403 for authenticated users without sufficient permissions.

---

# 6. Website Navigation

## Public Navbar

Display:

- Pizzora Logo
- Home
- Browse Menu
- Sign In
- Sign Up

## Authenticated Navbar

Display:

- Home
- Browse Menu
- Role-specific dashboard link
- User profile dropdown
- Profile Settings
- Dashboard
- Logout

The navbar must react immediately to authentication changes.

## Footer

Include:

- Pizzora Logo
- Short brand description
- Important links
- Browse Menu
- About Us
- Contact
- Social media links
- Facebook, Instagram, YouTube and X logos
- Copyright information

---

# 7. Homepage Design

Create a premium, visually attractive homepage.

## Section 1: Hero Banner

Create an impressive hero section.

Headline:

"Freshly Baked Pizza, Delivered to Your Door."

Description:

"Discover delicious pizzas from your favorite local restaurants. Explore amazing flavors and enjoy freshly prepared meals delivered right to you."

Buttons:

- Explore Pizza Menu
- Become a Restaurant Partner

Design:
- Large food photography.
- Attractive pizza image.
- Premium background.
- Clear CTA buttons.
- Responsive layout.
- Smooth entrance animation.

## Section 2: Featured Menu Items

Display at least six menu items fetched dynamically from MongoDB.

Only show:
- Approved items.
- Active items.
- Items belonging to non-blocked vendors.

Each card must include:

- Pizza image.
- Pizza name.
- Category.
- Price.
- Restaurant location.
- Vendor or restaurant name.
- View Details button.

Cards must have equal dimensions and consistent spacing.

Premium vendors' menu items should receive featured placement.

## Section 3: Pizza Categories

Display six categories:

1. Classic Pizzas
2. Vegetarian Pizzas
3. Meat Lovers
4. Specialty / Gourmet Pizzas
5. Sides & Appetizers
6. Beverages & Desserts

Each category should have:
- Attractive image or icon.
- Category name.
- Clickable navigation to Browse Menu with the category filter applied.

## Section 4: Why Choose Pizzora?

Create a custom section explaining platform benefits.

Include:

- Fresh Ingredients.
- Trusted Local Restaurants.
- Easy Ordering.
- Quality Food.
- Restaurant Variety.
- Convenient Delivery Requests.

## Section 5: Additional Homepage Section

Choose and implement one:

- How Pizzora Works.
- Popular Pizza Combos.
- Customer Testimonials.
- Pizza Lovers' Tips.

## Section 6: Call to Action

Create an attractive section encouraging restaurants to join Pizzora.

CTA:
"Grow Your Restaurant with Pizzora."

Button:
"Become a Partner"

## Section 7: Footer

Implement the complete footer.

## Homepage Animations

Use Framer Motion for appropriate animations.

Use:
- Fade-in.
- Slide-up.
- Staggered card animations.
- Subtle hover effects.

Animations must remain smooth and must not affect performance or accessibility.

---

# 8. Browse Menu Page

Create a public Browse Menu page.

Anyone should be able to browse menu items without logging in.

## Menu Cards

Display:

- Image.
- Name.
- Category.
- Price.
- Restaurant location.
- Vendor information.
- View Details button.

## Advanced Search

Implement real backend-supported search.

Users can search by:
- Pizza name.
- Menu item name.

## Filters

Implement:

- Category filter.
- Location filter.

## Sorting

Implement:
- Price: Low to High.
- Price: High to Low.

## Additional Features

- Pagination or load more.
- Loading skeleton.
- Empty state.
- Error state.
- Responsive grid.
- Reset filters.
- Search query preservation where appropriate.

All filtering and sorting must work with actual database results, not hardcoded arrays.

Use backend query parameters such as:

GET /api/menu-items?search=pizza&category=classic&location=dhaka&sort=price_asc&page=1&limit=12

Validate and sanitize all query parameters on the backend.

Only approved and active menu items from eligible vendors should be returned.

---

# 9. Menu Item Details Page

Route:

/menu/[id]

Display:

- Pizza name.
- Multiple images if available.
- Category.
- Description.
- Price.
- Restaurant location.
- Restaurant information.
- Vendor information.
- Order button.

Rules:

- Anyone can browse the public menu.
- Unauthenticated users clicking View Details should be redirected to Sign In, as required by the project specification.
- Only authenticated customers can place orders.
- Vendors cannot order their own menu items.
- Admins cannot place customer orders.
- Only approved and active menu items can be ordered.
- Invalid IDs must show a proper error state.
- Blocked users cannot place orders.

---

# 10. Vendor Dashboard

Create a separate, professional Vendor Dashboard.

Use:
- Sidebar navigation.
- Responsive layout.
- Statistics cards.
- Charts.
- Recent orders.
- Profile information.

## Vendor Overview

Display:

- Total menu items.
- Active menu items.
- Pending customer orders.
- Accepted orders.
- Current subscription plan.

Use real database data.

## Add Menu Item

Create an item form with:

- Item Name.
- Category.
- Description.
- Price.
- Location (Area / City).
- Item Image.

Image upload must use ImgBB.

Requirements:

- Validate required fields.
- Validate image upload.
- Validate price.
- Save the menu item to MongoDB.
- Assign the authenticated vendor's ID on the server.
- Default status: Pending.
- Show success/error toast.

## Free Plan Limitation

Free vendors can have a maximum of three active menu items.

Premium vendors can publish unlimited active menu items.

Enforce this limitation on the backend.

Never rely only on frontend button disabling.

If a vendor reaches the Free plan limit, show an attractive upgrade prompt.

## My Menu Items

Display only the authenticated vendor's own items.

Show:

- Image.
- Item name.
- Category.
- Price.
- Approval status.
- Availability.

Actions:

- View.
- Edit.
- Delete.
- Manage availability.

Rejected items must never appear in the public Browse Menu.

## Customer Orders

Display:

- Customer information.
- Customer name.
- Menu item information.
- Delivery date.
- Delivery address.
- Customer message.
- Order status.
- Order creation date.

Actions:

- Accept.
- Reject.

Rules:

- Only pending orders can be accepted or rejected.
- An order can only be processed once.
- Vendors can only manage their own orders.
- Backend must verify vendor ownership.

## Subscription Page

Display subscription plans.

### Free Plan

- Maximum 3 active menu items.
- Basic vendor dashboard.
- Order management.

### Premium Plan

- Unlimited active menu items.
- Premium vendor badge.
- Featured homepage placement.
- All Free features.

Add an Upgrade to Premium button.

---

# 11. Customer Dashboard

Create a responsive Customer Dashboard.

## Overview

Show statistics:

- Total Orders.
- Pending Orders.
- Accepted Orders.
- Rejected Orders.

## My Orders

Display:

- Pizza image.
- Pizza name.
- Vendor information.
- Delivery date.
- Delivery address.
- Order status.
- Request date.

Actions:

- View Order Details.
- Cancel Pending Order.

Rules:

- Customers can only access their own orders.
- Customers cannot modify other customers' orders.
- Only Pending orders can be cancelled.
- Accepted, Rejected, and Cancelled orders cannot be cancelled again.

Show loading, empty, and error states.

---

# 12. Admin Dashboard

Create a premium administrative dashboard.

Use a sidebar, statistics cards, charts, tables, and responsive layouts.

## Admin Overview

Display:

- Total registered users.
- Total vendors.
- Total customers.
- Total menu items.
- Pending menu items.
- Total transactions.

Use real database data.

## Manage Users

Display all users.

Features:

- Search by name.
- Search by email.
- Filter by role.
- View user details.
- Block users.
- Unblock users.

Blocked users must not be able to use protected platform features.

Never allow users to block or modify their own admin privileges through public APIs.

## Manage Menu Items

Display all submitted menu items.

Features:

- Search.
- Filter by category.
- Filter by vendor.
- Filter by approval status.
- View item details.
- Approve.
- Reject.
- Change status.
- Delete inappropriate items.

Only approved and active items should appear on the public Browse Menu.

## Transactions

Display:

- Vendor information.
- Subscription plan.
- Payment amount.
- Currency.
- Payment status.
- Stripe transaction/session reference.
- Transaction date.

Transactions must be read-only for admins.

Never expose Stripe secret keys or sensitive payment details.

---

# 13. Order Management System

When a customer clicks Order, display an order form.

Fields:

- Delivery Date.
- Delivery Address.
- Additional Message / Special Instructions.

Automatically detect:

- Customer ID.
- Selected menu item ID.
- Vendor ID.

Save the order to MongoDB.

Default status:

Pending

Available statuses:

- Pending.
- Accepted.
- Rejected.
- Cancelled.

## Business Rules

- Customer must be authenticated.
- Only customers can place orders.
- Customer cannot order their own item.
- Menu item must be approved and active.
- Vendor must not be blocked.
- Prevent duplicate active orders for the same item and delivery date.
- Validate delivery date.
- Validate address.
- Assign customer and vendor IDs from trusted server-side data.
- Show success/error notifications.

Use appropriate database checks and atomic operations to prevent race conditions.

---

# 14. Stripe Subscription Integration

Stripe is required ONLY for vendor Premium subscriptions.

Do not integrate Stripe Checkout for customer pizza orders.

## Payment Flow

1. Vendor clicks Upgrade to Premium.
2. Frontend requests a subscription checkout session from Express.
3. Backend verifies authentication and vendor role.
4. Backend creates Stripe Checkout Session.
5. Vendor is redirected to Stripe Checkout.
6. Successful payment redirects to Payment Success page.
7. Cancelled payment redirects to Payment Cancel page.
8. Stripe sends an event to the backend webhook.
9. Backend verifies the webhook signature.
10. Backend updates the subscription only after verified payment confirmation.
11. Backend saves the transaction to MongoDB.

## Security Requirements

- Stripe secret key must remain on the server.
- Webhook signing secret must remain on the server.
- Never trust frontend redirects for payment confirmation.
- Verify webhook signatures using the raw request body.
- Prevent duplicate webhook processing.
- Use Stripe event IDs for idempotency.
- Prevent vendors from creating sessions for other vendors.
- Do not let frontend requests directly set Premium status.
- Handle failed payments.
- Handle subscription cancellation and expiration.
- Keep subscription status synchronized with verified Stripe events.

A payment success page must never independently activate Premium.

---

# 15. Profile Management

Customers and Vendors can update:

- Full Name.
- Profile Image.
- Other permitted editable information.

Requirements:

- Image upload can use ImgBB.
- Validate profile information.
- Show loading states.
- Show success/error toast notifications.

Important:

Users must never be able to change their own:
- Role.
- Block status.
- Subscription plan.
- Subscription expiration.
- Payment status.

These fields must only be managed by trusted backend processes.

---

# 16. MongoDB Database Architecture

Use MongoDB Native Driver.

Do not use Mongoose.

Better Auth manages its own authentication collections.

Create only these four business collections:

## A. users

Better Auth user records with additional application fields:

- _id
- name
- email
- image
- role: vendor / customer / admin
- isBlocked
- businessName (vendor only)
- subscriptionPlan: free / premium
- subscriptionExpiresAt
- createdAt
- updatedAt

Do not duplicate Better Auth's user storage unnecessarily.

## B. menuItems

Fields:

- _id
- vendorId
- itemName
- category
- description
- price
- location
- images
- status: pending / approved / rejected / inactive
- availability
- createdAt
- updatedAt

## C. orders

Fields:

- _id
- itemId
- vendorId
- customerId
- deliveryDate
- deliveryAddress
- message
- status: pending / accepted / rejected / cancelled
- createdAt
- updatedAt

## D. transactions

Fields:

- _id
- vendorId
- plan
- amount
- currency
- stripeSessionId
- stripeSubscriptionId (if applicable)
- status
- createdAt

Create appropriate MongoDB indexes for:

- User email.
- Menu item vendor ID.
- Menu item status.
- Menu item category.
- Menu item location.
- Menu item price.
- Order customer ID.
- Order vendor ID.
- Order status.
- Transaction vendor ID.
- Stripe session ID.
- Stripe event idempotency.

Use proper ObjectId validation and reference consistency.

---

# 17. Express.js API Architecture

Build a clean REST API structure.

Example routes:

## Authentication / User

GET /api/users/me
GET /api/users
GET /api/users/:id
PATCH /api/users/profile
PATCH /api/users/:id/block
PATCH /api/users/:id/unblock

## Menu Items

GET /api/menu-items
GET /api/menu-items/featured
GET /api/menu-items/:id
POST /api/menu-items
PATCH /api/menu-items/:id
DELETE /api/menu-items/:id
PATCH /api/menu-items/:id/availability

## Admin Menu Management

GET /api/admin/menu-items
PATCH /api/admin/menu-items/:id/approve
PATCH /api/admin/menu-items/:id/reject
PATCH /api/admin/menu-items/:id/status
DELETE /api/admin/menu-items/:id

## Orders

POST /api/orders
GET /api/orders/my-orders
GET /api/vendor/orders
PATCH /api/orders/:id/accept
PATCH /api/orders/:id/reject
PATCH /api/orders/:id/cancel

## Dashboard

GET /api/dashboard/customer
GET /api/dashboard/vendor
GET /api/dashboard/admin

## Subscription

POST /api/subscriptions/checkout
GET /api/subscriptions/current
POST /api/subscriptions/cancel

## Transactions

GET /api/admin/transactions

## Stripe Webhook

POST /api/webhooks/stripe

Implement:

- Authentication middleware.
- JWT verification middleware.
- Admin middleware.
- Vendor middleware.
- Customer middleware.
- Resource ownership middleware where appropriate.
- Request validation.
- Centralized error handling.
- Consistent API response structure.

Never trust user IDs, roles, vendor IDs, prices, or subscription information sent by the frontend.

---

# 18. Frontend and Backend Folder Structure

Maintain separate repositories.

## Frontend Structure

Use a clean Next.js App Router architecture.

Example:

src/
  app/
    (public)/
      page.tsx
      menu/
        page.tsx
        [id]/
          page.tsx
      about/
        page.tsx
      contact/
        page.tsx

    (auth)/
      login/
        page.tsx
      register/
        page.tsx

    dashboard/
      customer/
        page.tsx
        orders/
          page.tsx

      vendor/
        page.tsx
        menu/
          page.tsx
          add/
            page.tsx
        orders/
          page.tsx
        subscription/
          page.tsx

      admin/
        page.tsx
        users/
          page.tsx
        menu-items/
          page.tsx
        transactions/
          page.tsx

    payment/
      success/
        page.tsx
      cancel/
        page.tsx

    profile/
      page.tsx

  components/
    layout/
    navbar/
    footer/
    homepage/
    menu/
    dashboard/
    forms/
    shared/
    ui/

  lib/
    auth/
    api/
    utils/
    validations/

  hooks/
  types/
  constants/

## Backend Structure

src/
  config/
    db.ts
    env.ts
    stripe.ts

  middleware/
    authenticate.ts
    verifyJWT.ts
    authorizeRole.ts
    errorHandler.ts
    validateRequest.ts

  modules/
    users/
    menuItems/
    orders/
    subscriptions/
    transactions/
    dashboards/

  routes/
    index.ts

  services/
    imgbb.service.ts
    stripe.service.ts

  utils/
    apiResponse.ts
    errors.ts

  types/

  app.ts
  server.ts

Keep controllers, services, routes, validations, and database operations properly separated.

You may improve this structure when necessary, but keep the architecture clean and maintainable.

---

# 19. UI/UX Requirements

Every page must be professionally designed.

## General Design

- Fully responsive.
- Mobile-first layout.
- Consistent typography.
- Consistent color palette.
- Reusable components.
- Equal card heights.
- Consistent image aspect ratios.
- Accessible form labels.
- Proper focus states.
- Clear visual hierarchy.

## Dashboard Design

- Responsive sidebar.
- Mobile sidebar drawer.
- Dashboard header.
- User profile section.
- Statistics cards.
- Charts and graphs.
- Data tables.
- Search and filters.
- Empty states.
- Loading skeletons.

## Components

Create reusable components for:

- Navbar.
- Footer.
- Buttons.
- Menu cards.
- Category cards.
- Statistics cards.
- Dashboard sidebar.
- Data tables.
- Search bar.
- Filter dropdowns.
- Pagination.
- Forms.
- Loading skeletons.
- Confirmation dialogs.
- Toast notifications.

Use ShadCN UI appropriately.

Use React Toastify for success and error notifications.

Never use browser alert().

---

# 20. Loading, Error and Empty States

Implement meaningful UI states for:

- Homepage data fetching.
- Menu loading.
- Dashboard loading.
- Form submission.
- Image upload.
- Order creation.
- Order updates.
- Stripe checkout.
- API errors.
- Empty search results.
- Empty order lists.
- Empty dashboards.

Implement:

- Custom 404 page.
- Error boundaries.
- Not-found handling.
- Server API error handling.
- Proper form validation messages.
- Unauthorized access handling.

All buttons and navigation links must have real functionality.

---

# 21. Security Requirements

Security is a critical part of this project.

Implement:

1. JWT signature verification.
2. Token expiration validation.
3. Server-side role verification.
4. Resource ownership verification.
5. Server-side input validation.
6. Environment variable protection.
7. Stripe webhook signature verification.
8. Secure authentication session handling.
9. MongoDB query validation.
10. Protection against unauthorized data updates.
11. Blocked-user access prevention.
12. Subscription verification.
13. CORS configuration for production.
14. Rate limiting on sensitive endpoints.
15. Safe error responses without exposing secrets.

Never trust frontend role checks.

Never allow frontend users to update privileged database fields.

Never expose:
- MongoDB passwords.
- Stripe secret keys.
- Stripe webhook secrets.
- Google OAuth client secrets.
- Better Auth secrets.
- Private API credentials.

---

# 22. Environment Variables

Create separate .env.example files.

## Frontend .env.example

NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_IMGBB_API_KEY=

Add other public configuration only when required.

## Backend .env.example

PORT=
NODE_ENV=
CLIENT_URL=
BACKEND_URL=

MONGODB_URI=
DB_NAME=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=

IMGBB_API_KEY=

JWT_SECRET=

Important:

- Never commit real .env files.
- Never expose server-only variables using NEXT_PUBLIC_.
- Keep all secrets on the appropriate server.
- Document every environment variable in README.

Use the actual supported environment variable names required by the installed Better Auth and Stripe configurations.

---

# 23. Deployment Requirements

Deploy the frontend and backend separately.

Frontend:
- Vercel.

Backend:
- Render or another appropriate hosting provider.

Database:
- MongoDB Atlas.

Verify:

- Production API URL.
- Production frontend URL.
- CORS configuration.
- Authentication callbacks.
- Google OAuth redirect URLs.
- Better Auth production URL.
- MongoDB Atlas access.
- ImgBB uploads.
- Stripe Checkout.
- Stripe Webhooks.
- Protected API routes.
- Dashboard access.
- Route refresh behavior.

Critical:

- No CORS errors.
- No 404 API errors.
- No 504 errors.
- No broken production routes.
- Reloading private routes must preserve authenticated sessions.
- Logged-in users must not unexpectedly be redirected to Login after refreshing.
- Payment flow must work in production.

Test every important route after deployment.

---

# 24. GitHub Requirements

Maintain two separate repositories:

1. Pizzora Client
2. Pizzora Server

Commit requirements:

- At least 20 meaningful client-side commits.
- At least 12 meaningful server-side commits.

Use descriptive commit messages.

Examples:

Client:
- feat: create responsive homepage hero section
- feat: implement menu browsing and filtering
- feat: add customer dashboard
- feat: create vendor menu management
- feat: implement admin dashboard

Server:
- feat: configure MongoDB connection
- feat: implement JWT verification middleware
- feat: add menu item CRUD APIs
- feat: implement order management APIs
- feat: integrate Stripe webhooks

Do not create fake commits or meaningless commits just to increase the count.

---

# 25. README Requirements

Create a complete README for both repositories.

Include:

- Project name.
- Project description.
- Project overview.
- Important features.
- Technology stack.
- Packages used.
- Installation instructions.
- Local development instructions.
- Environment variable names.
- API overview.
- Database architecture.
- Authentication details.
- Payment integration details.
- Advanced search implementation.
- JWT middleware explanation.
- Deployment information.
- Live website link.
- Client repository link.
- Server repository link.
- Screenshots.

Document how advanced search and sorting work using API query parameters.

Explain how JWT verification middleware protects the Express backend.

Never publish real credentials.

---

# 26. Development Workflow

Follow this development sequence.

## Phase 1 — Project Initialization

- Set up Next.js frontend.
- Set up Express backend.
- Configure TypeScript.
- Configure Tailwind CSS.
- Install ShadCN UI.
- Configure MongoDB.
- Set up environment files.
- Create GitHub repositories.

## Phase 2 — Design System

- Create Pizzora color palette.
- Configure typography.
- Create reusable UI components.
- Build Navbar.
- Build Footer.
- Build Homepage.
- Build Browse Menu.
- Build responsive layouts.

## Phase 3 — Authentication

- Configure Better Auth.
- Connect MongoDB adapter.
- Implement Google OAuth.
- Implement Registration.
- Implement Login.
- Implement sessions.
- Implement JWT strategy.
- Implement role-based navigation.

## Phase 4 — Backend Architecture

- Create Express routes.
- Create controllers.
- Create services.
- Create middleware.
- Implement JWT verification.
- Implement role verification.
- Implement API validation.
- Configure centralized errors.

## Phase 5 — Vendor Features

- Vendor Dashboard.
- Restaurant profile.
- Add menu item.
- ImgBB upload.
- Update menu item.
- Delete menu item.
- Menu approval status.
- Free plan limit.

## Phase 6 — Admin Features

- Admin Dashboard.
- Manage users.
- Block/unblock users.
- Manage menu items.
- Approve/reject items.
- Transaction management.

## Phase 7 — Customer Features

- Browse menu.
- Advanced search.
- Category filtering.
- Location filtering.
- Price sorting.
- Menu details.
- Place orders.
- My orders.
- Cancel pending orders.

## Phase 8 — Subscription

- Create Stripe Checkout Session.
- Configure Premium subscription.
- Implement webhook verification.
- Save transaction records.
- Activate Premium after verified events.
- Handle cancellation and expiration.

## Phase 9 — Testing and Optimization

- Test all roles.
- Test authentication.
- Test API permissions.
- Test resource ownership.
- Test order rules.
- Test payment flow.
- Test responsive design.
- Fix errors.
- Optimize performance.

## Phase 10 — Deployment

- Deploy frontend.
- Deploy backend.
- Connect MongoDB Atlas.
- Configure production environment variables.
- Configure Google OAuth.
- Configure Stripe webhook.
- Test production routes.
- Finalize README.

---

# 27. Important Coding Instructions

Follow these rules throughout development:

1. Write clean, maintainable, reusable code.
2. Use proper TypeScript types.
3. Avoid unnecessary any types.
4. Do not duplicate components.
5. Do not use hardcoded mock data as the final application data source.
6. Connect all features to real backend APIs.
7. Never leave nonfunctional buttons.
8. Never use placeholder API responses as completed features.
9. Validate important inputs on both frontend and backend.
10. Verify user permissions on the backend.
11. Handle loading and error states.
12. Use meaningful variable and function names.
13. Keep frontend and backend responsibilities separate.
14. Do not skip any required functionality.
15. Do not silently remove requirements to simplify development.
16. Use official documentation for Better Auth, Stripe, Next.js and MongoDB when implementation details are uncertain.
17. Make sure the project runs locally before deployment.
18. Do not claim a feature is complete until it has been implemented and tested.

---

# 28. Final Acceptance Criteria

The project is considered complete only when:

- Customer registration and login work.
- Vendor registration and login work.
- Google authentication works.
- Admin access is secure.
- Role-based dashboard access works.
- Menu items can be created, edited and deleted.
- Admin approval works.
- Public menu displays only approved active items.
- Advanced search works.
- Category and location filtering work.
- Price sorting works.
- Customers can place orders.
- Vendors can accept and reject orders.
- Customers can cancel pending orders.
- Free vendors are limited to 3 active menu items.
- Premium vendors can publish unlimited active items.
- Stripe Checkout works.
- Stripe webhooks verify payments.
- Premium activates only after verified payment.
- Transaction records are saved.
- JWT-protected APIs reject invalid tokens.
- Resource ownership is enforced.
- Blocked users cannot access protected features.
- Dashboards show actual database statistics.
- All pages are responsive.
- Loading and error states work.
- Production routes survive browser refresh.
- Both GitHub repositories have complete README files.
- Production deployment works without critical errors.

---

# 29. How to Work With This Prompt

Before writing code:

1. Analyze the entire project specification.
2. Inspect the existing project files if a codebase already exists.
3. Identify missing requirements.
4. Propose the architecture and development plan.
5. Identify security risks and implementation dependencies.
6. Create a clear task checklist.

Then implement the project phase by phase.

Do not attempt to generate the entire application in one uncontrolled response.

For each phase:

- Explain what will be implemented.
- Create the required files.
- Write complete working code.
- Explain important implementation decisions.
- Test the functionality.
- Fix errors before moving to the next phase.
- Update the task checklist.

If a feature depends on an unfinished backend API, identify the dependency instead of pretending the feature works.

Do not overwrite existing working code without inspecting it first.

**FINAL GOAL:**

Deliver a complete, secure, visually premium, responsive, production-ready full-stack application called **Pizzora — Freshly Baked. Perfectly Delivered.**

It must work as a real multi-vendor pizza marketplace, not merely look like one.

---

# 30. Project Summary

## Overview
Pizzora is a complete full-stack pizza ordering and delivery platform that functions as a multi-vendor marketplace. Customers can discover restaurants, browse pizza menus, place orders, and track their orders. Restaurant owners (vendors) can manage their restaurants, publish menu items, and handle customer orders. Administrators can manage users, approve menu items, and monitor platform transactions.

## Key Features
- **Three role-based experiences**: Customer, Vendor, and Admin
- **Authentication**: Better Auth with email/password and Google OAuth, stored in MongoDB
- **Menu browsing**: Advanced search, category/location filtering, price sorting
- **Order management**: Place orders, accept/reject/cancel orders, order tracking
- **Vendor subscription**: Free plan (max 3 active items) and Premium plan (unlimited items, featured placement)
- **Payments**: Stripe Checkout for vendor Premium subscriptions, webhook verification
- **Database**: MongoDB Native Driver with four business collections (users, menuItems, orders, transactions)

## Technology Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, ShadCN UI
- **Backend**: Express.js, Node.js, MongoDB Native Driver
- **Authentication**: Better Auth with MongoDB adapter
- **Payments**: Stripe Checkout and Webhooks
- **Deployment**: Frontend on Vercel, Backend on Render, Database on MongoDB Atlas

## Development Phases
The project follows a 10-phase development workflow from initialization through deployment, covering design system, authentication, backend architecture, vendor features, admin features, customer features, subscriptions, testing, and deployment.

## Acceptance Criteria
The project is complete when all customer and vendor authentication works, role-based dashboards function, menu CRUD operations work, advanced search and filtering work, order management works, Stripe payments process correctly, JWT protection enforces permissions, and both repositories have complete README files.