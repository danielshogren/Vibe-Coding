# Project Tracker MVP

Minimal proof-of-concept: create project items with title, status, and date; view them in a date-grouped list.

## Run the app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## File structure

```
├── app/
│   ├── actions.ts           # Server action: createProjectItem (form submit)
│   ├── components/
│   │   ├── ProjectItemForm.tsx   # Form: title, status, date, submit
│   │   └── ProjectItemList.tsx   # List grouped by date
│   ├── globals.css
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Single page: form + list
├── lib/
│   ├── store.ts             # In-memory store (add, getAll)
│   └── types.ts             # ProjectItem type, ProjectItemStatus enum
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Data

- **Model**: `ProjectItem` — `id`, `title`, `status` (backlog | in_progress | stuck | done), `date` (YYYY-MM-DD).
- **Storage**: In-memory only; data is lost on server restart. No persistence yet.

## What’s included

- One page: form at top, list below.
- Form submits via server action; list revalidates and shows new items.
- List is grouped by date; each item shows title + status.
