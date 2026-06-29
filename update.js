const fs = require('fs');  
const path = require('path');  
const file = path.join(__dirname, 'src/features/purchase/ui/PurchasePage.tsx');  
let c = fs.readFileSync(file, 'utf8');  
c = c.replace(\"import { parseExcel, type PurchaseRow } from '@/features/purchase/services/excel';\", \"import { parseExcel, type PurchaseRow } from '@/features/purchase/services/excel';\nimport { savePurchaseData } from '@/lib/supabase';\");  
fs.writeFileSync(file, c);  
console.log('done'); 
