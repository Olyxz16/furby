# Modular TS Webapp (Vite + React + TypeScript)

A clean, modular starter with:
- Top bar + left sidebar layout
- Routing (Home / Tables / Planning)
- Reusable UI components (Card, DataTable, Select)
- Data layer (models + mock data) ready for DB/API later
- Service layer placeholder (swap mock for real API later)

## Run
```bash
npm install
npm run dev
```

## Structure
- `src/components/layout/*` → top bar + sidebar
- `src/components/ui/*` → reusable UI (Card, DataTable, Select)
- `src/data/models/*` → shared types matching your future DB schema
- `src/data/mock/*` → sample data (replace with DB/API later)
- `src/services/*` → data access layer (mock now, API later)
- `src/pages/*` → route pages

## Next
When you add a database, implement `src/services/*` to call your backend.
