#!/usr/bin/env python3

import os
import json
from subprocess import run

run(['node','make_set.js'])

txt = '''---
filters:
    - quarto-header-icon

header_icon:
  custom_icons:
    - "my_icons.json"
---

[quarto]{ico="simple-icons:quarto"}

'''

dat = json.load(open('my_icons.json'))

pre = dat['prefix']


with open('test.qmd','w') as f:
    f.write(txt)    
    for ico in dat['icons'].keys():
        line = f'[{ico}]{{ico="{pre}:{ico}"}}\n\n'
        f.write(line)


run(['quarto','preview', 'test.qmd'])
