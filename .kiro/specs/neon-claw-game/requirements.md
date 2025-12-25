# Requirements Document

## Introduction

Neon Claw (霓虹神手) is a web-based claw machine game with a cyberpunk aesthetic. The game features AI-powered hand gesture controls via webcam, combined with traditional mouse/keyboard input. The core experience focuses on satisfying visual feedback and a probability-controlled grab mechanic disguised as physics simulation. The game targets tech enthusiasts, casual gamers, and brands seeking interactive marketing experiences.

## Glossary

- **Neon_Claw_System**: The complete web-based claw machine game application
- **Claw**: The mechanical grabbing device controlled by the player
- **Capsule**: Spherical prize objects in the prize pool that can be grabbed
- **Hand_Tracker**: The MediaPipe-based hand gesture recognition subsystem
- **Physics_Engine**: The Matter.js-based physics simulation for visual effects
- **Loot_Table**: The probability configuration determining grab success rates
- **HUD**: Heads-Up Display showing game status information
- **Gesture_Mode**: Control mode using webcam hand tracking
- **Default_Mode**: Control mode using mouse/keyboard input
- **Prize_Pool**: The collection of capsules available for grabbing
- **Drop_Zone**: The target area where successfully grabbed items must be released

## Requirements

### Requirement 1: Game Initialization and Mode Selection

**User Story:** As a player, I want to choose between gesture control and traditional input modes, so that I can play the game regardless of whether I have a webcam.

#### Acceptance Criteria

1. WHEN a player loads the game page THEN the Neon_Claw_System SHALL display a start screen with mode selection options within 3 seconds of page load
2. WHEN a player selects gesture mode THEN the Neon_Claw_System SHALL request webcam permission from the browser
3. WHEN the browser grants webcam permission THEN the Hand_Tracker SHALL initialize and display a calibration prompt
4. WHEN the browser denies webcam permission THEN the Neon_Claw_System SHALL fall back to Default_Mode and display a notification
5. WHEN a player selects default mode THEN the Neon_Claw_System SHALL initialize mouse/keyboard controls immediately

### Requirement 2: Hand Gesture Recognition and Calibration

**User Story:** As a player using gesture mode, I want the system to accurately recognize my hand gestures, so that I can control the claw intuitively.

#### Acceptance Criteria

1. WHEN the Hand_Tracker initializes THEN the Neon_Claw_System SHALL display a prompt instructing the player to raise their hand
2. WHEN the Hand_Tracker detects a hand skeleton THEN the Neon_Claw_System SHALL display a green "Ready" status indicator
3. WHEN the Hand_Tracker loses hand detection THEN the Neon_Claw_System SHALL display a red "Lost" status indicator within 100 milliseconds
4. WHEN the player displays an open palm gesture THEN the Hand_Tracker SHALL recognize the hovering state and map palm X-coordinate to Claw horizontal position
5. WHEN the player displays a fist gesture for 5 consecutive frames THEN the Hand_Tracker SHALL trigger the grab action
6. WHEN the player transitions from fist to open palm THEN the Hand_Tracker SHALL trigger the release action
7. WHILE processing hand gestures THEN the Hand_Tracker SHALL run in a WebWorker to prevent blocking the main rendering thread

### Requirement 3: Claw Movement and Control

**User Story:** As a player, I want smooth and responsive claw movement, so that I can accurately position the claw over prizes.

#### Acceptance Criteria

1. WHEN the player moves their hand horizontally in gesture mode THEN the Claw SHALL move horizontally with linear interpolation smoothing applied
2. WHEN the player moves the mouse horizontally in default mode THEN the Claw SHALL follow the mouse X-position with a deadzone filter applied
3. WHILE the Claw is moving THEN the Physics_Engine SHALL apply velocity-based movement with maximum speed clamping
4. WHEN the Claw reaches the boundary of the play area THEN the Claw SHALL stop at the boundary position
5. WHILE the Claw is in motion THEN the Neon_Claw_System SHALL play servo motor sound effects

### Requirement 4: Grab Mechanic with Probability Control

**User Story:** As a player, I want a fair chance to grab prizes with satisfying feedback, so that I feel engaged and motivated to continue playing.

#### Acceptance Criteria

1. WHEN the player triggers a grab action THEN the Claw SHALL descend vertically until contacting a Capsule or reaching the bottom
2. WHEN the Claw contacts a Capsule THEN the Neon_Claw_System SHALL query the Loot_Table to determine grab success
3. WHEN the Loot_Table returns success THEN the Claw SHALL create an invisible constraint attaching the Capsule to the Claw center
4. WHEN the Loot_Table returns failure THEN the Claw SHALL simulate a slip animation releasing the Capsule mid-ascent
5. WHEN a player fails to grab 5 consecutive times THEN the Loot_Table SHALL guarantee success on the next attempt
6. WHILE the Claw is ascending with a grabbed Capsule THEN the Neon_Claw_System SHALL display a glowing trail effect on the Capsule

### Requirement 5: Prize Release and Scoring

**User Story:** As a player, I want clear feedback when I successfully capture a prize, so that I feel rewarded for my efforts.

#### Acceptance Criteria

1. WHEN the player triggers release over the Drop_Zone THEN the Claw SHALL release the Capsule
2. WHEN a released Capsule enters the Drop_Zone THEN the Neon_Claw_System SHALL increment the score by 1
3. WHEN a Capsule successfully enters the Drop_Zone THEN the Neon_Claw_System SHALL play success sound effect and particle explosion animation
4. WHEN a released Capsule misses the Drop_Zone THEN the Neon_Claw_System SHALL display a "Try Again" message
5. WHEN scoring occurs THEN the HUD SHALL update the score display within 100 milliseconds

### Requirement 6: Game Timer and Session Management

**User Story:** As a player, I want a time-limited game session, so that each round feels exciting and prevents fatigue.

#### Acceptance Criteria

1. WHEN the game starts THEN the Neon_Claw_System SHALL initialize a 30-second countdown timer
2. WHILE the game is active THEN the HUD SHALL display the remaining time in MM:SS format
3. WHEN the timer reaches 10 seconds THEN the HUD SHALL change the timer color to red
4. WHEN the timer reaches zero THEN the Neon_Claw_System SHALL transition to the results screen
5. WHEN the results screen displays THEN the Neon_Claw_System SHALL show total score and option to play again

### Requirement 7: Physics Simulation for Visual Effects

**User Story:** As a player, I want realistic-looking physics for the prizes, so that the game feels immersive and satisfying.

#### Acceptance Criteria

1. WHILE Capsules are in the Prize_Pool THEN the Physics_Engine SHALL simulate gravity, collision, and bouncing between Capsules
2. WHEN the Claw contacts the Prize_Pool THEN the Neon_Claw_System SHALL trigger a screen shake effect
3. WHEN a Capsule is released THEN the Physics_Engine SHALL apply gravity causing the Capsule to fall naturally
4. WHILE the Physics_Engine is running THEN the Neon_Claw_System SHALL maintain 60 frames per second rendering

### Requirement 8: User Interface and HUD Display

**User Story:** As a player, I want clear visual feedback about game state, so that I always know what is happening and what to do next.

#### Acceptance Criteria

1. WHILE the game is active THEN the HUD SHALL display current score in the top-right corner
2. WHILE the game is active THEN the HUD SHALL display countdown timer in the top-center
3. WHILE gesture mode is active THEN the Neon_Claw_System SHALL display a picture-in-picture webcam feed with hand skeleton overlay
4. WHEN the game state changes THEN the HUD SHALL display contextual prompts (e.g., "Open palm to move", "Make fist to grab")
5. WHILE the Hand_Tracker is active THEN the HUD SHALL display a status indicator showing detection state

### Requirement 9: Cyberpunk Visual Theme

**User Story:** As a player, I want an immersive cyberpunk aesthetic, so that the game feels unique and visually exciting.

#### Acceptance Criteria

1. WHEN the game renders THEN the Neon_Claw_System SHALL display a dark background with neon accent lighting in pink and cyan colors
2. WHEN visual effects trigger THEN the Neon_Claw_System SHALL apply glitch art effects to UI elements
3. WHEN the Claw moves THEN the Neon_Claw_System SHALL update dynamic lighting and shadows based on Claw position
4. WHEN audio plays THEN the Neon_Claw_System SHALL use synthwave-style electronic music and 8-bit sound effects

### Requirement 10: Game State Serialization

**User Story:** As a developer, I want to serialize and deserialize game state, so that game progress can be saved and restored.

#### Acceptance Criteria

1. WHEN saving game state THEN the Neon_Claw_System SHALL serialize the current score, timer, and capsule positions to JSON format
2. WHEN loading game state THEN the Neon_Claw_System SHALL deserialize JSON data and restore the game to the saved state
3. WHEN serializing game state THEN the Neon_Claw_System SHALL produce valid JSON that can be parsed without errors
