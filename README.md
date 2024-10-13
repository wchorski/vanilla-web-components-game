browser based pet simulator game built with

- HTML
- CSS
- Javascript
- Web-Components (reusable UI library)

> [!note] Inspired by Sonic Tiny Chao Garden

## What Is This Project For?

This project serves as a learning process for beginner developers or someone who needs a break from all the _frameworks_ and _package dependancies_.

- Fundimental web standards.
- No build tools or external packages
- source code that runs in the browser
- Development template base for simple webdev projects
- Uses jsDoc for type safety
- Pure CSS animations

## Dev Environment

- `git clone https://github.com/wchorski/vanilla-web-components-game.git`
- `cd vanilla-web-components-game`
- `code .`
- `cp process.env.js.EXAMPLE process.env.js` (tweak variables to your needs)
- VS Code Plugins
  - [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) to run game during dev
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)
  - [Pretty TypeScript Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors)
  - [vscode-icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons)
  - Microsoft's built in JS and TS intellisense

## Bugs 🐜

- broken mechanics when using browsers other than Chrome

## Game Features

- Health Mechanics
  - Hunger
  - Sleep
  - Energy
  - Happyness
- Economy (Rings)
- Feed with fruit
- Game stats save to `Local Storage`
- auto (10 seconds) or manual save button with visual feedback
- Mult pet management
- Weed pulling
- Idle clicker type game

## TODO

-
- [ ] save playfield item data type and location (fruits, weeds, toys) and repopulate on initGame
- [ ] use routine function with probability `chance` weights
- [ ] have a pet limit of ~6?
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

---

## Credits

- css sprite animations [Drew Conley](https://www.youtube.com/watch?v=ekI7vjkFrGA)
