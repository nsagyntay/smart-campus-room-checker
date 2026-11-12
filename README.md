# Smart Campus Room Availability Checker

A web application that lets students and staff check whether a campus room is available for a desired time slot. Users enter a start time, end time, and current time (all in minutes after midnight), select a room, and the tool reports whether the room is available or explains why it is not.

The application uses **fictional sample data only**. No login, payments, external APIs, or databases are involved. No booking is ever saved or confirmed — the tool only checks availability.

## Features

- **Five fictional rooms** with IDs, names, buildings, capacities, equipment lists, blocked status, and existing bookings.
- **Capacity filter** — rooms must have a capacity greater than or equal to the requested number of attendees.
- **Equipment filter** — rooms must contain all selected equipment items.
- **Blocked-room handling** — blocked rooms are never reported as available, regardless of booking times.
- **Time validation** — times must be between 0 and 1440 minutes, start must be after the current time, and bookings cannot exceed 120 minutes.
- **Overlap detection** — the tool checks the candidate interval against existing bookings. Touching endpoints (e.g. a booking ending at 600 and another starting at 600) are allowed.
- **Visual timeline** — each room shows a daily timeline with existing bookings, the candidate interval, and the current time marker.
- **Empty state** — when no rooms match the filters, a clear message is shown and the check button is disabled.
- **Responsive design** — the layout adapts from a single column on mobile to a two-column grid on desktop.

## Technology Stack

- **React 18** with TypeScript
- **Vite 5** as the build tool and dev server
- **Tailwind CSS 3** for styling
- **Lucide React** for icons
- **Vitest 2** for automated testing
- **React Testing Library 16** for component integration tests

## Installation

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Steps

1. Clone or download the project folder.
2. Open a terminal in the project root directory.
3. Install dependencies:

```bash
npm install
```

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available in your browser at the URL shown in the terminal (typically `http://localhost:5173`).

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Running Tests

To execute the full test suite:

```bash
npm test
```

This runs all 43 tests across 4 test files using Vitest. The tests cover:

- **19 original boundary tests** (T01–T19) for time validation, overlap rules, and blocked-room handling.
- **9 filter unit tests** for capacity (F1) and equipment (F2) filtering.
- **9 extra boundary and blocked-room tests** (F3) for the 120-minute limit, touching intervals, and overlapping intervals.
- **6 React integration tests** (F4, F5) for the empty-state message, room switching, and reset behavior.

To check TypeScript types without emitting files:

```bash
npm run typecheck
```

To run the linter:

```bash
npm run lint
```

## Project Structure

```
src/
├── App.tsx                          # Main component — state and layout
├── App.test.tsx                     # Integration tests (F4, F5)
├── test-setup.ts                    # Vitest setup (jest-dom matchers)
├── components/
│   ├── AvailabilityForm.tsx         # Time input form with TimeField sub-component
│   ├── AvailabilityResult.tsx       # Available/unavailable result banner
│   ├── RoomFilters.tsx              # Capacity and equipment filter controls
│   ├── RoomInfo.tsx                 # Room detail card with bookings list
│   ├── RoomSelector.tsx             # Room dropdown with empty-state message
│   └── Timeline.tsx                 # Visual daily timeline
├── lib/
│   ├── availability.ts              # Core availability logic and time formatting
│   ├── availability.test.ts         # Original 19 boundary tests (T01–T19)
│   ├── availability.extra.test.ts   # Extra boundary and blocked-room tests
│   ├── constants.ts                 # Shared equipment labels and time constants
│   ├── filterRooms.ts               # Room filtering by capacity and equipment
│   ├── filterRooms.test.ts          # Filter unit tests (F1, F2)
│   ├── sampleData.ts               # Five fictional rooms with bookings
│   └── types.ts                     # TypeScript interfaces (Room, Booking, etc.)
```

## Rooms

| ID   | Name        | Building         | Capacity | Equipment                          | Blocked |
|------|-------------|------------------|----------|------------------------------------|---------|
| A101 | Room A101   | Engineering Block| 40       | Projector, Whiteboard              | No      |
| B220 | Room B220   | Science Wing     | 25       | Projector, Lab Bench               | Yes     |
| C305 | Room C305   | Library Annex    | 15       | Whiteboard                         | No      |
| D410 | Room D410   | Business Tower   | 60       | Projector, Video Conferencing, Whiteboard | No |
| E112 | Room E112   | Arts Centre      | 20       | Projector, Video Conferencing      | No      |

## How to Use

1. Optionally set a **minimum capacity** in the filter panel to narrow the room list.
2. Optionally toggle **equipment buttons** to require specific items.
3. Select a **room** from the dropdown.
4. Enter the **current time**, **start time**, and **end time** in minutes after midnight (0–1440). For example, 540 = 9:00 AM, 1020 = 5:00 PM.
5. Click **Check Availability** to see whether the room is available.
6. The result banner and the timeline will update to show the outcome.
