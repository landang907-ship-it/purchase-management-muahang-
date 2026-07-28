# Deploy Notes - Purchase Management

## ⚠️ IMPORTANT: Always use this URL
**Live URL: https://purchase-management-muahang.vercel.app**

NOT: https://purchase-mgmt.vercel.app (this is wrong/old)

## Project Info
- **Project Name:** purchase-mgmt
- **GitHub Repo:** https://github.com/landang907-ship-it/purchase-management-muahang-.git
- **Vercel Team:** landang907-1570s-projects

## Deploy Commands
```bash
cd purchase-management
npx vercel --prod --yes
```

## Key Files
- Main UI: `purchase-management/src/features/purchase/ui/PurchasePage.tsx`
- Filter UI: `purchase-management/src/features/purchase/ui/FilterBar.tsx`
- Workshop Config: `purchase-management/src/features/purchase/hooks/useWorkshopConfig.ts`
- Purchase Filters: `purchase-management/src/features/purchase/hooks/usePurchaseFilters.ts`
- README: `purchase-management/README.md`

## Bug Fixes Applied
1. Workshop config now persists on page reload (removed localStorage.removeItem force reset)
2. selectedWorkshops now saved to localStorage
3. WorkshopFilter moved to top of FilterBar (above QuickSearch)

## User Preferences
- Always confirm with user before making changes
- Report exactly what was changed
- Use the CORRECT URL: https://purchase-management-muahang.vercel.app
