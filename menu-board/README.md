# The Nile – Digital Menu Board

Three portrait (vertical) menu screens, 1080 × 1920 each, for TVs in the shop.
Everything runs from these files – no internet, no login and no Claude account needed.

| Screen | File | Sections |
|---|---|---|
| 1 | `screen1.html` | Starters, Pizzas, Garlic Breads |
| 2 | `screen2.html` | Burgers, The Steak House, Kebabs, Chicken, Side Orders |
| 3 | `screen3.html` | Sauces, Cakes, Milkshakes, Cookie Doughs, Ice Creams, Slushes, Drinks |

`index.html` is a start page with a button for each screen.

## Showing a screen on a TV

1. Copy the whole `menu-board` folder onto the computer / stick PC connected to the TV
   (or open it from GitHub Pages – see below).
2. Set the TV / computer display to portrait (rotated) in the display settings.
3. Open the screen in Google Chrome and press **F11** for full screen.

**Best for running all day (Chrome kiosk mode)** – starts full screen, no address bar:

Windows (one shortcut per TV):
```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --noerrdialogs --disable-session-crashed-bubble "C:\menu-board\screen1.html"
```

Raspberry Pi / Linux:
```
chromium-browser --kiosk --noerrdialogs --disable-session-crashed-bubble file:///home/pi/menu-board/screen1.html
```

Put the shortcut in the Startup folder so the menu comes back by itself after a power cut.
Also turn off the screensaver / sleep on that computer.

**If the computer can only output landscape** but the TV is mounted on its side,
add `?rotate=90` (or `?rotate=270` if it comes out upside down) to the address:
`screen1.html?rotate=90`

The layout scales itself to fit any screen size, so a 4K TV works too.

## Changing names or prices

Edit **`menu-data.js`** with any text editor (Notepad is fine). Each item is one line:

```js
["Beef Burger", "3.59"],
```

- Change a price: edit the number in quotes.
- Add an item: copy a line, paste it where you want it, change it.
- Remove an item: delete the line.
- Blank price space: `""`.
- Price with a small label: `{ l: "Only", p: "3.99" }`.
- Notes under a section are the `note:` lines.

Save, then refresh the TV browser (F5). The screens also reload by themselves every hour.
The text size adjusts automatically so everything still fits on the screen.

Which sections go on which screen is at the bottom of `menu-data.js` (`screens:`).

## Files

- `menu-data.js` – all menu text and prices, plus which screen each section is on
- `board.css` – colours, fonts and spacing
- `board.js` – draws the screens (no need to edit)
- `assets/background.jpg` – the supplied orange background, used unchanged at its original size
- `assets/logo.png` – The Nile logo (cut out from the supplied artwork)
- `fonts/` – fonts stored locally so no internet is needed

## Hosting on GitHub Pages (optional)

In the GitHub repository: Settings → Pages → deploy from branch. The screens will then be at
`https://<your-username>.github.io/<repo>/menu-board/screen1.html`.
