# Neon Claw Game Audio Assets

This directory contains audio files for the Neon Claw game.

## Required Audio Files

The following audio files are expected by the AudioManager:

| File | Description | Recommended Format |
|------|-------------|-------------------|
| `synthwave-bgm.mp3` | Background music - synthwave/cyberpunk style | MP3, 128-192kbps, loopable |
| `servo-motor.mp3` | Claw movement sound - mechanical servo | MP3, short clip (~0.5s) |
| `claw-grab.mp3` | Claw closing/grabbing sound | MP3, short clip (~0.5s) |
| `success-coin.mp3` | Success sound - 8-bit coin style | MP3, short clip (~0.5s) |
| `fail-slip.mp3` | Failure sound - slip/drop effect | MP3, short clip (~0.5s) |
| `8bit-coin.mp3` | Scoring sound - 8-bit coin pickup | MP3, short clip (~0.3s) |
| `capsule-collision.mp3` | Capsule collision sound - impact/bounce effect | MP3, short clip (~0.2s) |

## Audio Specifications

- **BGM**: Should be loopable, synthwave/retrowave style, ~120-140 BPM
- **SFX**: Short, punchy sounds with cyberpunk/arcade aesthetic
- **Format**: MP3 for broad browser compatibility
- **Sample Rate**: 44.1kHz recommended

## Placeholder Files

If audio files are not available, the game will continue to function without sound.
The AudioManager handles missing files gracefully with console warnings.

## Licensing

Ensure all audio files are properly licensed for your use case.
Consider using royalty-free sources like:
- Freesound.org
- OpenGameArt.org
- Incompetech.com
