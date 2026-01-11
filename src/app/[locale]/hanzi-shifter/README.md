# HanziShifter Game

A Unity WebGL game integrated into the Next.js portfolio as a React component.

## Overview

HanziShifter is an interactive Chinese character learning game originally built with Unity and exported as WebGL. This implementation wraps the Unity game in a React component with proper loading states, error handling, and responsive design.

## File Structure

```
src/app/[locale]/hanzi-shifter/
├── page.tsx                    # Server component entry point
├── HanziShifterClient.tsx      # Client component with Unity integration
└── README.md                   # This file

public/unity/hanzi-shifter/
├── Build/                      # Unity WebGL build files
│   ├── web_HanziShifter.data
│   ├── web_HanziShifter.framework.js
│   ├── web_HanziShifter.loader.js
│   └── web_HanziShifter.wasm
└── TemplateData/               # Unity template assets
    ├── favicon.ico
    ├── style.css
    └── [other assets]
```

## Features

- **Unity WebGL Integration**: Seamlessly loads Unity game in React
- **Loading Progress**: Visual progress bar during game initialization
- **Error Handling**: Graceful error messages if game fails to load
- **Fullscreen Support**: Button to enter fullscreen mode
- **Responsive Design**: Adapts to different screen sizes
- **Mobile Optimization**: Reduced pixel ratio for better mobile performance
- **i18n Support**: Multilingual UI (English/Chinese)

## Technical Details

### Unity Loader

The component dynamically loads the Unity loader script and creates a Unity instance with the following configuration:

- **Data URL**: `/unity/hanzi-shifter/Build/web_HanziShifter.data`
- **Framework URL**: `/unity/hanzi-shifter/Build/web_HanziShifter.framework.js`
- **Code URL**: `/unity/hanzi-shifter/Build/web_HanziShifter.wasm`
- **Canvas Size**: 960x600 (responsive)

### Component Lifecycle

1. Component mounts and creates canvas reference
2. Unity loader script is dynamically injected
3. Unity instance is created with progress callback
4. Loading progress is displayed to user
5. Game becomes interactive when fully loaded
6. Cleanup on unmount (Unity instance quit)

## Usage

The game is accessible at:
- English: `/en/hanzi-shifter`
- Chinese: `/zh/hanzi-shifter`

It's also listed in the Games Center page at `/[locale]/games`.

## Styling

The component uses:
- Tailwind CSS for styling
- Gradient backgrounds (gray-900 to black)
- Neon accent colors (pink-500, cyan-500)
- Backdrop blur effects
- Smooth animations and transitions

## Browser Compatibility

Requires:
- Modern browser with WebGL support
- JavaScript enabled
- Sufficient memory for Unity WebGL runtime

## Performance Considerations

- Mobile devices use reduced pixel ratio (`devicePixelRatio = 1`)
- Unity instance is properly cleaned up on unmount
- Loader script is removed from DOM on cleanup
- Canvas size is responsive but maintains aspect ratio

## Future Enhancements

- [ ] Add game instructions/tutorial
- [ ] Implement save/load functionality
- [ ] Add leaderboard integration
- [ ] Optimize loading time with compression
- [ ] Add sound toggle controls
- [ ] Implement game state persistence
