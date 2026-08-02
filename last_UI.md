You are a Senior Frontend React Engineer.

I already have a working React + Vite + TypeScript + TailwindCSS project.

DO NOT recreate the project.
DO NOT change the current architecture.
DO NOT rewrite existing components unless necessary.

Your task is to improve the existing application by implementing a complete responsive mobile navigation system while preserving the current desktop experience.

==========================================================
PROJECT STACK
==========================================================

- React
- Vite
- TypeScript
- TailwindCSS
- React Router
- Zustand
- Lucide React
- Framer Motion

Maintain the existing code style and architecture.

==========================================================
GOAL
==========================================================

The current application has:

✓ Desktop Sidebar
✓ Top Navigation
✓ Mobile Bottom Navigation

However, on mobile:

- The Sidebar cannot be opened.
- There is no Hamburger menu.
- The Bottom Navigation only exposes a few pages.
- Many important pages are inaccessible.

Implement a professional mobile navigation experience similar to modern SaaS applications such as Notion, Linear, Slack, ChatGPT, and GitHub Mobile.

==========================================================
1. GLOBAL STATE
==========================================================

Update:

stores/useAppStore.ts

Add the following state:

- isMobileSidebarOpen
- openMobileSidebar()
- closeMobileSidebar()
- toggleMobileSidebar()

Do not break any existing state.

==========================================================
2. SHARED NAVIGATION CONFIG
==========================================================

Create:

src/config/navigation.ts

Move every navigation item into one shared configuration.

Example structure:

export const navigationItems = [
{
title,
icon,
href,
badge,
section,
permission,
...
}
]

Desktop Sidebar and Mobile Sidebar MUST both consume this file.

Never duplicate navigation arrays.

==========================================================
3. MOBILE SIDEBAR
==========================================================

Create:

components/layout/MobileSidebar.tsx

Requirements:

• Only visible on mobile

md:hidden

• RTL support

Slide from the RIGHT.

• Width:

w-[80vw]
max-w-[320px]

Never full screen.

• Animated with Framer Motion.

Use smooth:

- Slide animation
- Fade backdrop

• Backdrop

Dark transparent overlay.

Clicking backdrop closes sidebar.

• Close sidebar when:

- clicking a navigation item
- clicking backdrop
- pressing Escape
- changing route

• Prevent body scrolling while open

document.body.style.overflow="hidden"

Restore overflow when closed.

==========================================================
4. TOP NAVIGATION
==========================================================

Update:

TopNav.tsx

Add Hamburger button.

Requirements:

Visible only on mobile:

md:hidden

Click:

toggleMobileSidebar()

Desktop must remain unchanged.

==========================================================
5. APP LAYOUT
==========================================================

Update:

AppLayout.tsx

Mount

<MobileSidebar />

without affecting Desktop Sidebar.

Desktop layout must stay exactly the same.

==========================================================
6. MOBILE BOTTOM NAVIGATION
==========================================================

Keep Mobile Bottom Navigation.

It should ONLY include the most frequently used pages:

- Home
- Documents
- Chat
- Tasks
- Settings

Everything else should be accessible from Mobile Sidebar.

==========================================================
7. SIDEBAR CONTENT
==========================================================

The Mobile Sidebar should contain ALL application pages.

Example:

🏠 Home

📚 Learning

- Documents
- Chat
- Quiz
- Favorites
- History

📋 Productivity

- Tasks
- Goals
- Habits
- Health

👤 Account

- Profile
- Settings
- Notifications

🚪 Logout

Support expandable groups if needed.

==========================================================
8. ACTIVE ROUTES
==========================================================

Current active page must be highlighted.

Use exactly the same active styling as Desktop Sidebar.

==========================================================
9. BADGES
==========================================================

If Desktop Sidebar has badges

Example:

Chat (5)

Notifications (2)

Tasks (12)

show the same badges inside Mobile Sidebar.

==========================================================
10. ACCESSIBILITY
==========================================================

Support:

ESC closes drawer.

Focus trap while drawer is open.

Focus returns to Hamburger button after close.

ARIA labels.

Keyboard navigation.

==========================================================
11. RESPONSIVE BEHAVIOR
==========================================================

Desktop

>= md

Desktop Sidebar only.

No Mobile Sidebar.

No Hamburger.

----------------------------------------------------------

Mobile

< md

Hamburger visible.

Desktop Sidebar hidden.

Bottom Navigation visible.

Mobile Sidebar available.

==========================================================
12. ANIMATIONS
==========================================================

Use Framer Motion.

Animations:

Sidebar:

Slide from right.

Backdrop:

Fade.

Menu Items:

Small stagger animation.

Buttons:

Hover

Tap

Scale

Transitions should feel premium.

==========================================================
13. DESIGN
==========================================================

Maintain existing design language.

RTL.

Rounded corners.

Soft shadows.

Modern SaaS.

Spacing consistent.

Do not redesign UI.

Only improve mobile experience.

==========================================================
14. CODE QUALITY
==========================================================

Use reusable components.

No duplicated logic.

No duplicated navigation.

Strong TypeScript types.

Clean architecture.

Readable code.

==========================================================
15. TESTING
==========================================================

After implementation:

Run:

npm run build

Fix every:

TypeScript error

ESLint warning

Import issue

Unused variables

Ensure production build succeeds.

==========================================================
EXPECTED RESULT
==========================================================

The application should behave like a professional SaaS platform:

✓ Responsive
✓ Mobile friendly
✓ Modern drawer navigation
✓ Shared navigation configuration
✓ Smooth animations
✓ Accessible
✓ RTL compatible
✓ Production ready
✓ No duplicated code
✓ Clean architecture
✓ Build passes successfully

Do not stop until every requirement above has been completed.