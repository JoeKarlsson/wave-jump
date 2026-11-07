<p align="center">
	<img width=100% src="https://user-images.githubusercontent.com/4650739/35486122-1ec10468-042f-11e8-960b-8e72ad203fdf.png" />

</p>

<h1 align="center">Wave Jump</h1>

Wave Jump is a 80's arcade inspired multiplayer game where you've got to be lightening fast to beat your friend to the finish.

Ride a bolt of electricity in a slick retro-futuristic sunset world with your friend. Put your reflexes to the test as your race to catch the final cyber portal first.

You've been warned. This game will make your brain melt.

You can play Wave Jump for free today: [https://wavejump.joekarlsson.com/](https://wavejump.joekarlsson.com/)

## Recording (November 2026)

![Wave Jump: the sunset title screen, then two players riding a rolling white wave over a blue grid, and a big "Player 1 Wins" screen each time one reaches the checkered gate](.github/readme/2026-11-recording.gif)

What Wave Jump looked like in November 2026, recorded for [its page on joekarlsson.com](https://www.joekarlsson.com/work/wave-jump/). The full-quality video is [2026-11-recording.mp4](.github/readme/2026-11-recording.mp4).

## Setup
To use this game you'll need to install a few things before you have a working copy of the project.

### 1. Clone this repo:

Navigate into your workspace directory.

Run:

```bash
git clone git@github.com:JoeKarlsson/wave-jump.git
```

### 2. Install Node.js and npm:

This project requires Node.js 22+ and npm. Download from [nodejs.org/](https://nodejs.org/en/)

### 3. Install dependencies:

Navigate to the cloned repo's directory.

Run:

```bash
npm install
```

## 4. Run the development server:

Run:

```bash
npm run dev
```

This will start the Vite development server with hot module replacement (HMR).

Open your browser and navigate to [localhost:3000](http://localhost:3000/)

The page will automatically reload when you make changes to the source code.

## Build for production:

Run:
```bash
npm run build
```

This will create an optimized production build in the `dist/` directory.

## Preview production build locally:

After building, you can preview the production build locally:

```bash
npm run preview
```

## Test:

```bash
npx playwright install chromium   # once
npm test
```

The tests build the site, serve it, and play it in a browser: the head metadata and icons, a round on a desktop (no console errors, failed requests or runaway timers), and the keyboard notice on a phone.

## Assets:

Everything in `assets/` ships with the site. The original full-size art and the WAV music live in `design/` and don't ship; the game loads compressed WebP and MP3 copies. To redraw the PNG icons from `assets/favicon.svg` and the social card from the title screen, build, start `npx vite preview --port 4173`, then run `npm run images`.

## Deploy:

Every push to `master` runs lint and the tests in GitHub Actions, then deploys `dist/` to GitHub Pages at [wavejump.joekarlsson.com](https://wavejump.joekarlsson.com/).

## Technologies Used:

*  ES6+ JavaScript (ES Modules)
*  [Phaser CE 2.21](https://github.com/phaserjs/phaser-ce) (the arcade-physics build)
*  [Vite 8](https://vitejs.dev/)
*  [Playwright](https://playwright.dev/) for tests
*  ESLint 10 with flat config
*  Prettier for code formatting
*  GitHub Actions for CI/CD

## Contributing

1.  Fork it!
1.  Create your feature branch: git checkout -b my-new-feature
1.  Commit your changes: git commit -am 'Add some feature'
1.  Push to the branch: git push origin my-new-feature
1.  Submit a pull request :D

## Contributors

This game was created for the [Global Game Jam 2018](http://globalgamejam.org/) over 48 hours on January 26 - 28, 2018 in Minneapolis, MN.

![wave_jump_team_photo](https://user-images.githubusercontent.com/4650739/35485808-4e223b96-042a-11e8-9bad-c3516f8939c2.jpg)

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150 height="150"
        src="https://avatars.githubusercontent.com/JoeKarlsson?v=3">
        <br />
        <a href="https://github.com/JoeKarlsson">Joe Karlsson</a>
      </td>
      <td align="center">
        <img width="150 height="150"
        src="https://avatars.githubusercontent.com/calcarlson?v=3">
        <br />
        <a href="https://github.com/calcarlson">Cal Carlson</a>
      </td>
      <td align="center">
        <img width="150 height="150"
        src="https://avatars.githubusercontent.com/Danielwbolson?v=3">
        <br />
        <a href="https://github.com/Danielwbolson">Daniel Olson</a>
      </td>
      <td align="center">
        <img width="150 height="150"
        src="https://avatars.githubusercontent.com/lisamabley?v=3">
        <br />
        <a href="https://github.com/lisamabley">Lisa Mabley</a>
      </td>
    <tr>
  <tbody>
</table>

Original music and sounds by [Andrew Hill](https://www.origin414.com/andrew-hill)

### License

#### [MIT](https://github.com/JoeKarlsson/wave-jump/blob/develop/LICENSE)
