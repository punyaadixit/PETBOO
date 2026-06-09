# FRONTEND ARCHITECTURE

This document captures the current PetSphere MVP-1 frontend structure and maps each folder/file to its responsibility and PRD module alignment.

```text
petsphere-frontend/                                # Frontend application root (React + Tailwind) | Supports all modules
+-- src/                                           # Main source folder for UI, routing, state, mock data, and shared logic | Cross-module
|   +-- App.jsx                                   # Central routing composition with BrowserRouter + nested routes + CartProvider wrapper | Cross-module routing shell (A/B/C/D + B6 + 2.5)
|   +-- App.css                                   # Legacy CRA stylesheet (currently not used by routed UI) | Legacy/Scaffold
|   +-- App.test.js                               # Basic app render smoke test for route shell stability | Cross-module QA
|   +-- index.css                                 # Tailwind directives + base body styles used app-wide | Cross-module styling foundation
|   +-- index.js                                  # React entrypoint; mounts App into DOM and loads global CSS | Cross-module bootstrap
|   +-- logo.svg                                  # Default CRA asset retained in project | Legacy/Scaffold asset
|   +-- reportWebVitals.js                        # Optional performance metrics helper from CRA template | Legacy/Scaffold utility
|   +-- setupTests.js                             # Jest testing setup from CRA template | Cross-module test setup
|   |
|   +-- components/                               # Reusable UI components shared by pages/layouts | Cross-module
|   |   +-- Navbar.jsx                            # Persistent top navigation; route links + mobile menu + cart count badge | Cross-module navigation (A/B/C/D/B6/2.5)
|   |   +-- VetCard.jsx                           # Vet listing card with Schedule + On-Demand CTA buttons | Module A: Tele-Vet
|   |   +-- PreConsultationForm.jsx               # Booking form revealed after consult CTA; includes symptoms/description/upload/mock success state | Module A: Tele-Vet
|   |   +-- PetProfile.jsx                        # Community pet profile panel with stats and activity badges (Foodie, etc.) | Module D: Community
|   |
|   +-- context/                                  # Global state management via React Context | Module B: Fresh Food + Checkout
|   |   +-- CartContext.jsx                       # Global cart store: items, add/remove/updateQuantity, totals, clearCart | Module B + Section 2.5 Dashboard integrations
|   |
|   +-- data/                                     # Mock datasets used to simulate backend/API responses | Modules A/B/D
|   |   +-- foodData.js                           # 8 mock food catalog items (diet tags, portion, vet recommendation, pricing) | Module B: Fresh Food Delivery
|   |   +-- socialPosts.js                        # Pet-centric social feed post data with paw/woof interaction counters | Module D: Community
|   |   +-- vetData.js                            # 5 mock veterinarian profiles with specialty/experience/rating/availability | Module A: Tele-Vet
|   |
|   +-- layouts/                                  # Page chrome/layout shells for routed content | Cross-module
|   |   +-- AppLayout.jsx                         # Shared app layout: Navbar + Outlet container for all main routes | Cross-module layout shell
|   |
|   +-- pages/                                    # Route-level pages/screens | Modules A/B/C/D + B6 + 2.5
|       +-- UserDashboard.jsx                     # User dashboard with pet switcher, summary KPI cards, and order history list | Section 2.5: User Dashboard
|       +-- VetDirectory.jsx                      # Search/filterable vet directory and booking flow trigger surface | Module A: Tele-Vet
|       +-- FoodCatalog.jsx                       # Fresh food product grid with Add to Cart and checkout CTA | Module B: Fresh Food Delivery
|       +-- Checkout.jsx                          # Checkout view with cart line items, totals, delivery rule banner, and slot selection | Module B: Ordering/Delivery rules
|       +-- CuddlesChat.jsx                       # Full-height AI chat UI with disclaimer, local message state, simulated bot reply | Module C: Cuddles AI
|       +-- SocialFeed.jsx                        # Community feed cards with Paw/Woof actions and per-post toggle state | Module D: Community
|       +-- SellerPanel.jsx                       # Kitchen partner admin dashboard with revenue metrics and incoming order status controls | Module B6: Seller/Kitchen Panel
|       +-- DashboardPage.js                      # Legacy placeholder dashboard page (replaced by UserDashboard route) | Legacy placeholder
|       +-- TeleVetPage.js                        # Legacy placeholder tele-vet page (replaced by VetDirectory route) | Legacy placeholder
|       +-- FreshFoodPage.js                      # Legacy placeholder fresh-food page (replaced by FoodCatalog route) | Legacy placeholder
|       +-- CuddlesAIPage.js                      # Legacy placeholder Cuddles page (replaced by CuddlesChat route) | Legacy placeholder
|       +-- CommunityPage.js                      # Legacy placeholder community page (replaced by SocialFeed route) | Legacy placeholder
|       +-- SellerPanelPage.jsx                   # Legacy placeholder seller panel page (replaced by SellerPanel route) | Legacy placeholder
```

## Global State Management

- `src/context/CartContext.jsx` is the single global state layer currently in use.
- `CartProvider` wraps the entire router tree in `src/App.jsx`, making cart state available across all pages.
- `useCart()` is consumed by:
  - `src/pages/FoodCatalog.jsx` (add items)
  - `src/pages/Checkout.jsx` (read/update/remove items and totals)
  - `src/components/Navbar.jsx` (global cart counter display)

## Routing Connection

- Routing root is defined in `src/App.jsx` using `BrowserRouter`, `Routes`, and nested `Route` with shared `AppLayout`.
- `AppLayout` (`src/layouts/AppLayout.jsx`) provides persistent navbar and renders page content through `<Outlet />`.
- Active route map:
  - `/` -> `UserDashboard`
  - `/tele-vet` -> `VetDirectory`
  - `/fresh-food` -> `FoodCatalog`
  - `/checkout` -> `Checkout`
  - `/cuddles-ai` -> `CuddlesChat`
  - `/community` -> `SocialFeed`
  - `/seller-panel` -> `SellerPanel`
