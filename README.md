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

- [x] if hunger is below `0.2` trigger cry instead of sleep
- [x] touch / mobile input!!!!!!!! with `touch` instead of `drag` w/e
- [x] figure local storage or sqlite to save ring count
- [x] custom cursor w glove
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
- [x] drag and drop fruit to feed (and other items)
- [ ] look into [JsDocs](https://depth-first.com/articles/2021/10/20/types-without-typescript/)
