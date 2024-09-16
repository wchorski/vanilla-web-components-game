browser based pet simulator game built with

- HTML
- CSS
- Javascript
- Web-Components (reusable UI library)

> [!note] Inspired by Sonic Tiny Chao Garden

## Features

- Heath Mechanics
  - Hunger
- Economy (Rings)
- Feed with fruit
- Game stats save to `Local Storage`

## TODO

- [ ] figure local storage or sqlite to save ring count
- [ ] custom cursor w glove
- [ ] make weeds apear randomly
- [ ] able to pluck weeds
- [ ] health meters
  - [ ] sleep (sleep raises energy and sleep)
  - [ ] hunger (food lowers hunger and boosts energy)
  - [ ] energy (too much energy is bad)
    - uses energy passively or if given toys
  - [ ] cant style `<meter>` so moving to `<progress>` tag instead
  - [ ] Sleep
    - engergy is below half
    - hunger is above full
    - sleep meter doesn't fill as fast when hungerPoints are high
    - sleep (naptime) happens at regular intervals and duration is usually the same (slight variable?)
- [ ] don't forget to export `<number-counter>` before too much customization
- [ ] drag and drop fruit to feed (and other items)
