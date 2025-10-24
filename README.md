<p align="center">
	<img width=100% src="https://user-images.githubusercontent.com/4650739/35486122-1ec10468-042f-11e8-960b-8e72ad203fdf.png" />

</p>

<h1 align="center">Wave Jump</h1>

Wave Jump is a 80's arcade inspired multiplayer game where you've got to be lightening fast to beat your friend to the finish.

Ride a bolt of electricity in a slick retro-futuristic sunset world with your friend. Put your reflexes to the test as your race to catch the final cyber portal first.

You've been warned. This game will make your brain melt.

You can play Wave Jump for free today: [https://joekarlsson.github.io/wave-jump/](https://joekarlsson.github.io/wave-jump/)

## Setup
To use this game you'll need to install a few things before you have a working copy of the project.

### 1. Clone this repo:

Navigate into your workspace directory.

Run:

```bash
git clone git@github.com:JoeKarlsson/wave-jump.git
```

### 2. Install Node.js and npm:

This project requires Node.js 18+ and npm. Download from [nodejs.org/](https://nodejs.org/en/)

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

## Deploy to GitHub Pages:

This project is configured to automatically deploy to GitHub Pages via GitHub Actions.

1. Push your code to the `main` or `master` branch
2. GitHub Actions will automatically build and deploy to GitHub Pages
3. Your game will be available at `https://[your-username].github.io/wave-jump/`

**Note:** Make sure GitHub Pages is enabled in your repository settings and set to deploy from GitHub Actions.

## Technologies Used:

*  ES6+ JavaScript (ES Modules)
*  [Phaser CE 2.10.0](https://phaser.io/)
*  [Vite 6.x](https://vitejs.dev/) - Modern build tool with HMR
*  ESLint 9.x with flat config
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
