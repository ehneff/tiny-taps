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

`index.html` is a simple menu that lists every game as a tappable card. It's the recommended entry point once you have more than one game — install *it* to the home screen instead of an individual game, and use it to jump between games. Each game also has a small "‹ hub" link in its top-left corner to get back.

You can still open or install any individual game's URL directly if you only want that one game on the home screen (see below).

The hub also has a **parental controls** entry — a small gear icon in the bottom-right corner. It requires a 3-second long-press to open (a quick tap does nothing), so it's not something a toddler can trigger by accident. It currently links to lock-screen setup instructions (Screen Pinning / Guided Access) and will grow to hold more settings over time.

## Running a game

Open the file directly on GitHub Pages, or locally:

```
https://ehneff.github.io/neffster/                                     (the hub)
https://ehneff.github.io/neffster/calm/soft-bubbles/soft-bubbles.html   (a single game)
```

Static hosts that work well for dropping in a new HTML file: GitHub Pages (this repo), Netlify Drop, Vercel.

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
2. Inside it, add the self-contained `.html` file, its own `manifest.json`, and its own `icon-192.png`/`icon-512.png` — copy the pattern in `calm/soft-bubbles/`.
3. Add a row to the **Games** table above.
4. Add a matching card to `index.html`'s game grid so it shows up in the hub.
5. Keep it dependency-free where possible so it stays portable and easy to self-host.
