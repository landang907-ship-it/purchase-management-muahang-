# PLAN: 001 — Purchase Management

## Migration: Flat `src/components/` → Feature-based `src/features/`

### Target Structure
```
src/
├── features/
│   ├── auth/
│   │   ├── ui/             ← LoginPage, FormField, SapButton, SiteHeader, SiteFooter
│   │   ├── contexts/       ← AuthContext
│   │   ├── hooks/          ← useAuth
│   │   ├── services/       ← authConfig
│   │   └── model/          ← types/sap (role types)
│   └── purchase/
│       ├── ui/             ← PurchasePage, DataTable, RequesterFilter, Header, ...
│       ├── services/       ← excel.ts, status.ts
│       ├── model/           ← types/purchase.ts
│       └── lib/             ← date.ts (purchase-specific formatting)
├── shared/
│   ├── ui/                 ← Toast
│   └── lib/                ← cn.ts
├── App.tsx
└── main.tsx
```

### Migration Steps

1. **Create new directories** — no files yet, safe.
2. **Move files** (rename imports in same step to avoid break):
   - `src/components/login/*` → `src/features/auth/ui/`
   - `src/contexts/AuthContext.tsx` → `src/features/auth/contexts/AuthContext.tsx`
   - `src/hooks/useAuth.ts` → `src/features/auth/hooks/useAuth.ts`
   - `src/lib/authConfig.ts` → `src/features/auth/services/authConfig.ts`
   - `src/types/sap.ts` → `src/features/auth/model/sap.ts`
   - `src/components/purchase/*` → `src/features/purchase/ui/`
   - `src/lib/excel.ts` → `src/features/purchase/services/excel.ts`
   - `src/lib/status.ts` → `src/features/purchase/services/status.ts`
   - `src/lib/date.ts` → `src/features/purchase/lib/date.ts`
   - `src/types/purchase.ts` → `src/features/purchase/model/purchase.ts`
   - `src/components/shared/Toast.tsx` → `src/shared/ui/Toast.tsx`
   - `src/lib/cn.ts` → `src/shared/lib/cn.ts`
3. **Update tsconfig.app.json** — add:
   ```json
   "@/features/*": ["./src/features/*"],
   "@/shared/*": ["./src/shared/*"]
   ```
4. **Update vite.config.ts** — add resolve.alias entries for new aliases.
5. **Update all imports** in moved files to use new paths.
6. **Delete old directories** `src/components/`, `src/contexts/`, `src/hooks/`, `src/types/`.

### Rollback Plan
If build fails: `git checkout HEAD -- src/` to restore flat structure,
fix import paths, then retry.

### Risks
- Many import paths must be updated atomically.
- If tsconfig + vite aliases not updated together, runtime 404.
- Context window limited — may need to batch updates.
