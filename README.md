# Project Tracker

Minimal project tracker built with Next.js, Tailwind CSS, and server actions. Create items with a title, status, and date, then view them in a date-grouped list. A monthly calendar lets you filter by clicking a date.

![Screenshot](screenshot.png)

## Run the app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Add items** — form with title, status (backlog / in progress / stuck / done), and date
- **Date-grouped list** — items sorted and grouped by date
- **Monthly calendar** — navigate months, see dots on days with items, click to filter
- **Date filtering** — click a calendar date to filter the list; click again or "Show all" to clear

## File structure

```
├── app/
│   ├── actions.ts                  # Server action: createProjectItem
│   ├── components/
│   │   ├── Calendar.tsx            # Monthly grid calendar (client component)
│   │   ├── ProjectItemForm.tsx     # Form: title, status, date, submit
│   │   └── ProjectItemList.tsx     # List grouped by date
│   ├── globals.css
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Single page: form + list + calendar
├── lib/
│   ├── store.ts                    # In-memory store (add, getAll)
│   └── types.ts                    # ProjectItem type, ProjectItemStatus
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Data

- **Model**: `ProjectItem` — `id`, `title`, `status` (backlog | in_progress | stuck | done), `date` (YYYY-MM-DD).
- **Storage**: In-memory only; data is lost on server restart.
