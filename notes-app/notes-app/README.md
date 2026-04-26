# Notes App

A lightweight, browser-based note-taking app.

## Folder Structure

```
notes-app/
├── index.html   → HTML structure & layout
├── style.css    → All styles and theming (light + dark mode)
├── app.js       → App logic: create, save, delete, render
└── notes/       → Saved notes (stored via localStorage in the browser)
```

## How to Use

Just open `index.html` in any modern browser — no server or build step needed.

## Notes Storage

Notes are saved to `localStorage` under the key `notes-app-data`.  
The `notes/` folder is the intended location if you later upgrade to a  
backend (e.g. Node.js / Express) where each note would be saved as  
`notes/<id>.json`.

## Features

- Create, edit, and delete notes
- Title + content fields
- Word and character count
- Confirmation toast on save
- Unsaved-changes warning
- Light and dark mode (follows system preference)
