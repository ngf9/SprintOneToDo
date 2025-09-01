# Instant Development Instructions

You are an expert developer who writes full-stack apps in InstantDB, Next.js, and Tailwind. However InstantDB is not in your training set and you are not familiar with it.

## Important Guidelines

1. **Check for existing Next.js project**: Before generating a new next app, check to see if a next project already exists in the current directory. If it does, do not generate a new next app.

2. **Use Instant MCP tools**: If the Instant MCP is available, use the tools to create apps and manage schema.

3. **Read instant-rules.md first**: Before you write ANY code, read ALL of instant-rules.md to understand how to use InstantDB in your code.

## Key Development Stack
- InstantDB (real-time database)
- Next.js (React framework)
- Tailwind CSS (styling)

## Workflow
1. Check for existing project structure
2. Read instant-rules.md completely
3. Use Instant MCP tools for app and schema management
4. Write code following InstantDB patterns from the documentation

## SprintOne To-Do App PRD

### Purpose
Deliver a minimalist, distraction-free task management app that emphasizes focus and clarity. The app should feel modern, lightweight, and intuitive, with only essential functionality implemented at first.

### User Flow

#### Authentication
- On launch, the user is presented with a login screen (email and magic code flow via Instant DB)
- Once authenticated, the user is routed to their personal task list; data is scoped per user (no shared/global tasks)

#### Task Management (Core Screen)
- Default view is a single list of tasks
- Tasks are displayed with:
  - Title text
  - Checkbox (completion state)
  - Visual differentiation between completed vs. pending tasks
- A floating "+" action button (bottom-right) opens a modal or inline input for adding a new task
- Tasks can be:
  - Edited by tapping/clicking the task text
  - Deleted via long-press (mobile) or context menu (desktop)
- Task order is static at first; future drag-and-drop reordering is optional

#### Session Management
- A simple sign-out button is accessible in the header or settings dropdown

### Core Functionalities (3)
1. Add new tasks quickly (+ see them in simple, sophisticated list on home page)
2. Task functionality: marking tasks as complete (checkbox), dragging todos to change order, and pressing down to edit or delete the todo; count of completed versus pending
3. Authentication so only logged in user can see and edit their data

### Stretch Features (Future Iterations)
- Drag-and-drop task reordering
- Progress bar / completion metrics
- Reminders & due dates (with notifications)
- Tags, categories, or filters
- Micro-interactions (confetti, animations on completion)
- Offline mode (local cache sync)

### Look & Feel

#### Design Principles
- Calm, minimal, and functional
- Style Inspiration: Notion and Things app
- UI Guidelines: Follow Apple HIG for interaction best practices

#### Color Palette
- Primary accent: Deep navy (#0A1F44) with subtle gradients/glow
- Support dark mode as default

#### Interactions
- Smooth, satisfying checkmarks
- Clean typography with balanced white space

### Inspiration Examples
- "+" functionality in the "Things" app, which hovers in the bottom right of the screen
- Clean, minimal feel
- Reference best UX/UI practices from Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines

### Build Approach
- Frontend: Next.js + React (TypeScript)
- Backend/DB: InstantDB for real-time data persistence
  - Tutorial: https://www.instantdb.com/tutorial
  - Docs: https://www.instantdb.com/docs

### Development Workflow
1. Write code in VS Code
2. Use Claude Code in terminal for assisted development
3. Push code to GitHub
4. Deploy to Vercel

### Testing
- Jest + React Testing Library for unit/UI tests

### Success Metrics
- Performance: Tasks create/edit/delete within <100ms perceived latency
- Usability: Zero clicks wasted—task input, completion toggle, and deletion are single-interaction actions
- Retention: At least 80% of users return within a week (proxy: task persistence & ease of use)

## Implementation Summary (Current Status)

### Design Theme: Neo-Brutalist
We chose the Neo-Brutalist design (option 3) over the other proposed designs, featuring:
- **Color Scheme**: Pure black background (#000000), crisp white elements, electric blue (#0066FF) accents
- **Typography**: Bold, uppercase text throughout with monospace fonts for counters
- **Visual Elements**: Thick borders (4px), sharp corners, drop shadows, high contrast

### Implemented Features

#### 1. Core Task Management
- ✅ Add new tasks via floating '+' button (bottom-right)
- ✅ Mark tasks complete/incomplete with checkbox
- ✅ Visual differentiation (completed tasks have diagonal line pattern overlay)
- ✅ Task counters showing pending and completed counts

#### 2. Drag-and-Drop Reordering
- ✅ Implemented using @dnd-kit library
- ✅ Prominent drag handles (black squares with white grip icon)
- ✅ Visual feedback during drag (semi-transparent, blue border)
- ✅ "DRAG" tooltip appears on hover
- ✅ Smooth animations when reordering

#### 3. Edit & Delete Functionality (Command Center Approach)
- ✅ [EDIT] button - Black background, allows inline editing
- ✅ [DELETE] button - Light gray background with coral red text (updated for subtlety)
- ✅ Inline editing with [SAVE] and [CANCEL] options
- ✅ Delete confirmation modal
- ✅ Keyboard support (Enter to save, ESC to cancel)

#### 4. User Experience Enhancements
- ✅ Fixed header that stays at top when scrolling
- ✅ Confetti celebration animation when completing tasks
- ✅ Keyboard shortcuts ([N] for new task, [ESC] to cancel)
- ✅ Responsive design with proper text truncation
- ✅ Hydration-safe implementation (client-side only drag-and-drop)

### Technical Implementation Details
- **Framework**: Next.js 15.5.2 with TypeScript
- **Styling**: Tailwind CSS with custom Neo-Brutalist utilities
- **State Management**: React useState hooks
- **Drag-and-Drop**: @dnd-kit/core and @dnd-kit/sortable
- **Build Tool**: Turbopack

### Current Branch
Working on `feature/new-features` branch (not yet merged to main)