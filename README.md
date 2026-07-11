# Diary & Notes

A personal diary and task tracker that runs in your browser. Data is stored locally on your machine — no account or server required.

## Features

- **Diary** — write dated journal entries
- **Tasks** — manage to-dos with due dates and reminder dates
- **On-open reminders** — when you open the app each day, a popup shows tasks that are due or have a reminder set for today

## Getting started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build for offline use

```bash
npm run build
npm run preview
```

Or open the files in `dist/` after building.

## Data storage

All entries and tasks are saved in your browser's local storage under the key `diary-and-notes-data`. Clearing browser data for this site will remove your entries.
