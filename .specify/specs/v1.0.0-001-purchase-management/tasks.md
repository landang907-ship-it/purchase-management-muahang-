# TASKS: 001 — Purchase Management

## Phase 1: Documentation Layer
- [x] Create `.specify/memory/constitution.md`
- [x] Create `.specify/templates/spec-template.md`
- [x] Create `.specify/scripts/common.sh`
- [x] Create `.specify/specs/001-purchase-management/spec.md`
- [x] Create `.specify/specs/001-purchase-management/plan.md`
- [x] Create `.specify/specs/001-purchase-management/tasks.md`
- [ ] Create `.specify/specs/001-purchase-management/checklists/requirements.md`

## Phase 2: Create Feature Directories
- [ ] Create `src/features/auth/ui/`
- [ ] Create `src/features/auth/contexts/`
- [ ] Create `src/features/auth/hooks/`
- [ ] Create `src/features/auth/services/`
- [ ] Create `src/features/auth/model/`
- [ ] Create `src/features/purchase/ui/`
- [ ] Create `src/features/purchase/services/`
- [ ] Create `src/features/purchase/model/`
- [ ] Create `src/features/purchase/lib/`
- [ ] Create `src/shared/ui/`
- [ ] Create `src/shared/lib/`

## Phase 3: Move Files
- [ ] Move login components → `src/features/auth/ui/`
- [ ] Move AuthContext → `src/features/auth/contexts/`
- [ ] Move useAuth → `src/features/auth/hooks/`
- [ ] Move authConfig → `src/features/auth/services/`
- [ ] Move sap types → `src/features/auth/model/`
- [ ] Move purchase components → `src/features/purchase/ui/`
- [ ] Move excel.ts → `src/features/purchase/services/`
- [ ] Move status.ts → `src/features/purchase/services/`
- [ ] Move date.ts → `src/features/purchase/lib/`
- [ ] Move purchase types → `src/features/purchase/model/`
- [ ] Move Toast → `src/shared/ui/`
- [ ] Move cn.ts → `src/shared/lib/`

## Phase 4: Config Updates
- [ ] Update `tsconfig.app.json` — add `@/features/*` and `@/shared/*` aliases
- [ ] Update `vite.config.ts` — add resolve.alias for new paths

## Phase 5: Import Updates
- [ ] Update imports in `src/main.tsx`
- [ ] Update imports in `src/App.tsx`
- [ ] Update imports in all auth feature files
- [ ] Update imports in all purchase feature files
- [ ] Update imports in shared files

## Phase 6: Cleanup
- [ ] Delete old `src/components/` directory
- [ ] Delete old `src/contexts/` directory
- [ ] Delete old `src/hooks/` directory
- [ ] Delete old `src/types/` directory

## Phase 7: Verify
- [ ] Run `npm run build` — must pass
- [ ] Start preview server on 0.0.0.0:4173
- [ ] Verify app loads from desktop browser
- [ ] Verify app loads from mobile via LAN IP
