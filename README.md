# Pomodoro Flow

A modern, customizable Pomodoro timer application built with Next.js, React, and TypeScript. Developed using [vibe coding](https://en.wikipedia.org/wiki/Vibe_coding) as an experiment. 
A detailed write-up on how this was built is available at [my blog - Relfections](https://annjose.com/post/vibe-coding-pomodoro-app/).

Pomodoro Flow helps you stay focused and productive by breaking your work into timed intervals separated by short breaks.

This app is deployed on Netlify. Visit [my-pomodoro-flow.netlify.app](https://my-pomodoro-flow.netlify.app) to see it in action.

![Pomodoro Flow App Screenshot](public/screenshots/main-page.png)

## Features

- 🕒 Fully customizable timers for focus sessions, short breaks, and long breaks
- 🎨 Multiple theme options (Synthwave, Cafe, Cosmic, Minimal, Lofi, Forest)
- 📊 Session tracking and cycle progress visualization
- 🔔 In-app notifications when timers complete
- 🎵 Sound alerts for timer completion and button clicks
- ❓ Comprehensive help guide with instructions and productivity tips
- ⚡ Debug mode for testing (add `?debug=true` to URL)
- 📱 Responsive design that works on all devices

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pomodoro-flow.git
cd pomodoro-flow
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Basic Timer Controls

- Click **Start** to begin the timer
- Click **Pause** to temporarily stop the timer
- Click **Reset** to reset the current timer to its original duration
- Use the quick access buttons at the bottom to switch between Focus, Short Break, and Long Break modes

### Customizing Settings

1. Click the ⚙️ (settings) icon in the top-right corner
2. Adjust the duration for focus sessions, short breaks, and long breaks
3. Set the number of focus sessions per cycle (before a long break)
4. Click **Save** to apply your changes

### Changing Themes

Click the **Change Vibe** button to cycle through different visual themes:
- **Synthwave**: purple and pink gradients
- **Cafe**: warm amber tones
- **Cosmic**: deep blue space theme
- **Minimal**: clean grayscale design
- **Lofi**: muted slate colors
- **Forest**: natural green tones

## Debug Mode

For faster testing, append `?debug=true` to the URL. This shortens all timer durations:
- Focus session: 30 seconds (instead of 25 minutes)
- Short break: 10 seconds (instead of 5 minutes)
- Long break: 15 seconds (instead of 15 minutes)

## Technologies Used

- [Next.js 15](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [TailwindCSS](https://tailwindcss.com/) - Styling

## Deployment

This app is deployed on Netlify. Visit [my-pomodoro-flow.netlify.app](https://my-pomodoro-flow.netlify.app) to see it in action.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The Pomodoro Technique was developed by Francesco Cirillo

## Attributions

### Sounds
- tada2.wav by jobro -- https://freesound.org/s/60444/ -- License: Attribution 3.0

### Help and Instructions

Click the question mark (?) icon in the top-right corner to open the help guide that includes:
- Explanation of the Pomodoro technique
- Instructions on using the app
- Feature overview
- Productivity tips
- Keyboard shortcuts
