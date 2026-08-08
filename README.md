# Neffster

Low-sensory, offline-friendly tap games for toddlers — gentle motion, soft sounds, no ads or timers.

Each game is a single, self-contained HTML file. No build step, no dependencies beyond what's loaded from a CDN font. Open a game in a browser, add it to your home screen, and it behaves like a simple app.

## Games

| Game | File | Description |
|---|---|---|
| Soft Bubbles | `bubbles.html` | Pastel bubbles drift up slowly; tap to pop with a gentle chime. Shows device charging status at the top. |

*(Add new rows here as games are added.)*

## Running a game

Open the file directly on GitHub Pages, or locally:

```
https://ehneff.github.io/neffster/bubble_calm.html
```

Static hosts that work well for dropping in a new HTML file: GitHub Pages (this repo), Netlify Drop, Vercel.

## Adding to the home screen

**Android (Chrome):**
1. Open the game's URL in Chrome.
2. Tap the ⋮ menu → **Add to Home screen**.
3. Launch it from the home screen icon — it opens full-screen, no address bar.

**iPhone (Safari):**
1. Open the game's URL in Safari.
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

1. Drop a new self-contained `.html` file in the repo root (or a subfolder, if it grows).
2. Add a row to the **Games** table above.
3. Keep it dependency-free where possible so it stays portable and easy to self-host.
