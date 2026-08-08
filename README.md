# Neffster

Low-sensory, offline-friendly tap games for toddlers — gentle motion, soft sounds, no ads or timers.

Each game is a single, self-contained HTML file with its own folder (own manifest, own icons — no reaching into sibling folders). No build step, no dependencies beyond what's loaded from a CDN font. Open a game in a browser, add it to your home screen, and it behaves like a simple app.

Games are organized into two top-level categories:

- **`calm/`** — low-stimulation sensory play: slow motion, muted palettes, no goals, no failure states.
- **`learn/`** — learning-oriented games (currently empty — the category exists, waiting on its first game).

## Games

| Game | Category | Path | Description |
|---|---|---|---|
| Soft Bubbles | calm | `calm/soft-bubbles/soft-bubbles.html` | Pastel bubbles drift up slowly; tap to pop with a gentle chime. Shows device charging status at the top. |

*(Add new rows here as games are added.)*

## The hub

`index.html` is a simple menu that lists every game as a tappable card, built from `games.json`. It's the recommended entry point once you have more than one game — install *it* to the home screen instead of an individual game, and use it to jump between games. Each game also has a small "‹ hub" link in its bottom-left corner to get back.

You can still open or install any individual game's URL directly if you only want that one game on the home screen (see below).

### Parental controls

The hub has a **parental controls** entry — a gear icon in the bottom-right corner. It requires a 3-second long-press to open (a quick tap does nothing), so it's not something a toddler can trigger by accident. Settings are stored in `localStorage` on that device only (not synced anywhere), under the key `neffster-settings`:

- **Lock to one game** — once switched on, the *next* game opened stays locked in: the "‹ hub" link disappears and Back can't leave it. Getting back out (to switch the lock off again) still works, but the same way — the hub link becomes a hidden long-press spot (bottom-left corner, 3 seconds) instead of vanishing entirely, so it's not a dead end.
- **Games shown in hub** — toggle any game off to hide its card from the hub without deleting anything.
- **Battery status** — show or hide the battery indicator in games that have one.

## Running a game

Open the file directly on GitHub Pages, or locally:

```
https://ehneff.github.io/neffster/                                     (the hub)
https://ehneff.github.io/neffster/calm/soft-bubbles/soft-bubbles.html   (a single game)
```

Static hosts that work well for dropping in a new HTML file: GitHub Pages (this repo), Netlify Drop, Vercel.

## Offline support

A service worker (`sw.js`, registered from every page) makes the site actually usable with no internet connection, not just ad-free/account-free.

- **Any page you open while online** is fetched fresh and cached; if a later fetch fails because there's no connection, the cached copy is served instead. This covers the Google Fonts stylesheet and font file too.
- **Opening the hub while online also proactively pre-caches every game** listed in `games.json` — its HTML, manifest, and icons — not just whatever's actually been clicked into. So installing Neffster and opening the hub once, online, is enough to make the *whole* catalog work offline afterward, not just games that happened to be opened individually.
- **Updating an already-cached game** only happens if that game's `version.txt` has changed since the last time the hub refreshed it — see **Adding a new game** below. This keeps a hub visit cheap (it doesn't re-download every game's files every single time) at the cost of needing to remember to bump the version file when a game actually changes.

## Adding to the home screen

**Android (Chrome):**
1. Open the hub's URL (or a single game's URL) in Chrome.
2. Tap the ⋮ menu → **Add to Home screen**.
3. Launch it from the home screen icon — it opens full-screen, no address bar.

**iPhone (Safari):**
1. Open the hub's URL (or a single game's URL) in Safari.
2. Tap the Share icon → **Add to Home Screen**.
3. Launch it from the home screen icon.

> Home screen install requires the page to be served over HTTPS (or `localhost`). Opening a local file directly (`file://`) usually won't trigger the install prompt.

## Locking the screen so a toddler can't exit

Adding to the home screen makes the game *look* like an app, but a toddler can still swipe away or hit the home button unless you also lock the device to that one screen.

**Android — Screen Pinning:**
1. Settings → Security & Privacy → More security settings → **Screen pinning** → turn on.
2. Open the game, then open Recent Apps, tap the app's icon at the top of its card, and choose **Pin**.
3. To unpin: hold **Back + Recent Apps** together (or enter your PIN if you required one to unpin).

**iPhone — Guided Access:**
1. Settings → Accessibility → **Guided Access** → turn on, and set a passcode (or use Face ID/Touch ID to end).
2. Open the game, then triple-click the side/home button to start Guided Access.
3. To exit: triple-click again and enter your passcode.

## Known limitations

- **Battery status indicator (Soft Bubbles):** uses the Battery Status API, which Chrome/Samsung Internet on Android support but **Safari on iOS does not** — Apple removed it for privacy reasons and has no plans to bring it back. On iPhone, the bar shows "unavailable" instead of live charge info; the rest of the game still works normally.
- Games are designed for calm, low-stimulation play: slow motion, muted color palettes, no failure states, no sudden sounds. If you add a new game, keep this ethos in mind.

## Adding a new game

1. Create a new folder under `calm/` or `learn/`, named after the game (e.g. `learn/shape-match/`).
2. Inside it, add the self-contained `.html` file, its own `manifest.json`, its own `icon-192.png`/`icon-512.png`, and a `version.txt` containing just a version string (e.g. `1`) — copy the pattern in `calm/soft-bubbles/`.
3. Add a row to the **Games** table above.
4. Add an entry to `games.json` (id, name, path, desc, color, and `showsBattery` if it has a battery indicator) — this is what makes it show up in the hub, the Parental Controls game list, and the service worker's pre-caching.
5. Keep it dependency-free where possible so it stays portable and easy to self-host.
6. Nothing to change in `sw.js` itself — new games are picked up automatically from `games.json`.

**Updating an existing game:** bump its `version.txt` (e.g. `1` → `2`) whenever you change its files. This is what tells the hub's background refresh that the game actually changed and needs re-caching — **if you forget, a device that already has the old version cached offline won't pick up your change** via the hub, even though anyone who opens that game directly while online always gets the latest version regardless. If a game has no `version.txt` at all, it's always refreshed on every hub visit (safe default, just less bandwidth-efficient).
