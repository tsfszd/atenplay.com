# AtenPlay.com

Public showcase website for AtenPlay.

## Games featured

- **ArrowMaze** — source project: `tsfszd/ArrowMaze`
- **Break It!** — source project: `tsfszd/BreakIt`
- **SkyWings** — source project: `tsfszd/SkyWings`
- **PongMaster** — source project: `tsfszd/PongMaster`
- **BrickBreaker** — source project: `tsfszd/BrickBreaker`

Business/application repositories are intentionally excluded.

## Visual references

The current homepage uses lightweight CSS art derived from each game's documented visual/gameplay direction so the public site has no dependency on private repository assets.

Canonical visual libraries to use when exporting production screenshots:

- Break It!: `Design/Mockups/` (`BreakIt_25_Themes.svg`, `BreakIt_Core_Screens.svg`, `BreakIt_All_Levels.html`)
- BrickBreaker: `StoreAssets/` (`BrickBreaker-FeatureGraphic.png`, `BrickBreaker-AppIcon.png`)
- ArrowMaze, SkyWings and PongMaster: export representative gameplay captures from their current playable vertical slices.

When final screenshots are ready, place web-optimized copies under `assets/screenshots/` in this public repository and swap each `.visual` panel in `index.html` to the matching image. Do not hotlink private GitHub assets from the public site.
