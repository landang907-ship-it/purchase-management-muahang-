#!/usr/bin/env python3
import codecs
import os
import sys

# Base path
base = r'c:/Users/landa/OneDrive/Desktop/du an mua hang/purchase-management'

# File 1: excel.ts
f1 = os.path.join(base, 'src/features/purchase/services/excel.ts')
with codecs.open(f1, 'r', 'utf-8') as file:
    c1 = file.read()
c1 = c1.replace("export const TAG_VALUE = 'Da tao';", "export const TAG_VALUE = 'VN005922';")
with codecs.open(f1, 'w', 'utf-8') as file:
    file.write(c1)
print('[OK] excel.ts updated')

# File 2: i18n/index.ts (VI)
f2 = os.path.join(base, 'src/i18n/index.ts')
with codecs.open(f2, 'r', 'utf-8') as file:
    c2 = file.read()

# Vietnamese
c2 = c2.replace("TAG-NAME = Da tao", "TAG-NAME = VN005922")

# Chinese
c2 = c2.replace("TAG-NAME = Yi chuang jian", "TAG-NAME = VN005922")

with codecs.open(f2, 'w', 'utf-8') as file:
    file.write(c2)
print('[OK] i18n/index.ts updated')

print('Done - TAG-NAME filter restored to VN005922!')
