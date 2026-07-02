#!/usr/bin/env python3
import codecs
import os

# Base path
base = r'c:/Users/landa/OneDrive/Desktop/du an mua hang/purchase-management'

# File 2: i18n/index.ts
f2 = os.path.join(base, 'src/i18n/index.ts')
with codecs.open(f2, 'r', 'utf-8') as file:
    c2 = file.read()

# Vietnamese: replace TAG-NAME = \u0110\u00e3 t\u1ea1o with TAG-NAME = VN005922
c2 = c2.replace('\u0110\u00e3 t\u1ea1o', 'VN005922')

# Chinese: replace TAG-NAME = \u5df2\u521b\u5efa with TAG-NAME = VN005922
c2 = c2.replace('\u5df2\u521b\u5efa', 'VN005922')

with codecs.open(f2, 'w', 'utf-8') as file:
    file.write(c2)
print('[OK] i18n/index.ts updated')

print('Done - TAG-NAME filter restored to VN005922!')
