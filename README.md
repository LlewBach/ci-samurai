# Milestone 2 Project - Code Eye Samurai
By Gareth Llewelyn

[View website on GitHub Pages](https://llewbach.github.io/ci-samurai/)

## Table of contents

> 1. [Overview](#overview)
> 2. [UX](#ux)
>> 1. [Strategy](#strategy)
>> 2. [Scope](#scope)
>> 3. [Structure](#structure)
>> 4. [Skeleton](#skeleton)
>> 5. [Surface](#surface)
> 3. [Features](#features)
> 4. [Technologies Used](#technologies-used)
> 5. [Testing](#testing)
> 6. [Deployment](#deployment)
> 7. [Credits](#credits)
> 8. [Acknowledgements](#acknowledgements)

## Overview

[Back to top](#milestone-2-project---code-eye-samurai)
This is a side scroller fighting game using only vanilla Javascript. The game's shortened name (CI Samurai) is a nod to my code dojo, Code Institute.

## UX

[Back to top](#milestone-2-project---code-eye-samurai)

### Strategy

[Back to top](#milestone-2-project---code-eye-samurai)

The idea for this game was inspired by the rad Netflix show, 'Blue Eye Samurai' and also a deep empathy for my fellow coders battling with bugs on a daily basis. I decided that a game that offered coders sweet payback time in the form of a virtual rampage would be both of psychological benefit to the user, and of societal service by reducing the probability of a real one.

Creator's goals...
- wants to demonstrate skill with JavaScript
- wants to offer a safe means of decompressing to bug-beleaguered coders

Player's goals...
- wants to enjoy a game
- wants to decompress, and re-energize debugging mojo

Target audience...
- employers who will be considering the creator's skill and employability
- seething coders who need their problems to just 'bug-ger off'

Unique selling proposition
- Game made specifically for the benefit of coders, and the CI community.

### Scope

[Back to top](#milestone-2-project---code-eye-samurai)

1) What the customer says they need - a fun game
2) What the customer actually needs - a morale boost for debugging
3) What the customer doesn't know they need - an urgent psychological decompression, and probably therapy

#### User Stories (US) and Acceptance Criteria (AC)

US1 - "As a site visitor, I want to know what the purpose of this site is and what kind of game it is so I can decide whether it's for me."

AC1 - "Users can immediately identify the game name, theme and type. Users are initially directed to the intro tab, where they can learn more about the game's lore".

US2 - "As an interested player, I want to know how to play."

AC2 - "Users can navigate to the controls tab for instructions on gameplay."

US3 - "As a convinced player, I want to play the game."

AC3 - "Users can navigate to the game tab and start playing."

US4 - "As a potential employer, I want to ??????????????? Should I include this?

#### Information and features scope

This site will include information about the game, the game lore, game controls and game play. 

In terms of the game's features, it will be limited to a 2d canvas, with only horizontal 'exploration'. The number of player states will allow convincing movement (standing, running, jumping, rolling), three modes of attack, stun state and two end states. There will be two enemy types, with states that allow for more complex and exciting game play. These include two modes of appearance, two distinct forms of attack, hunting behaviour via the turning state and a death state. Both the player and enemy characters will be bidirectional. The background will have a parallax effect for a perception of depth.

### Structure

[Back to top](#milestone-2-project---code-eye-samurai)

The information will be structured by three tabs, namely 'Intro', 'Controls' and 'Game'. This order makes sense as the player will want to know whether this is the sort of thing they want to play, how to use it, then use it.

Information relevant to game play will be visible in the game, including stats such as 'score' and 'health', as well as a game result message.

### Skeleton

[Back to top](#milestone-2-project---code-eye-samurai)

Here are some wireframes of the site.

WIREFRAMES

### Surface

[Back to top](#milestone-2-project---code-eye-samurai)

#### Background

The background is a canvas element that creates a dynamic 'matrix rain' effect, that responds to the gameplay. This is reminiscent of 'hacker' and 'Chosen One' vibes from the Matrix films, which add to the theme and feel of the game.

#### Favicon

#### Font

#### Colour palette

#### Images used

## Features

[Back to top](#milestone-2-project---code-eye-samurai)

### HTML and website structure

The website is one page with a Bootstrap tab menu, containing three tabs. 

The 'Intro' tab - 

The 'Controls' tab - 

The 'Game' tab - contains an absolutely positioned canvas element.

### Website background 

This is made up of a single canvas element, with an interactive 'matrix rain' effect. If the player is losing blood, the matrix rain colour will switch to red. If the player dies, the colour switches to white. If the game ends, the 'rain drop' frequency goes down by a factor of ten.

### Game background

This consists of 4 overlaid background images which move at different relative speeds in order to create a parallax effect. The endless effect is simulated by drawing one image after the first and resetting the initial position of the images once the starting point of the second image reaches the starting point of the first image.

### Game

The game object is the spinal chord of the game, connecting all the different classes and calling their methods. The game can pause by pressing spacebar (NEED MOBILE PAUSE) and resets after game end by pressing 'r' (NEED MOBILE RESET). The game currently has a winning score which ends the game and triggers a victory message. If the player dies before reaching this score, the game ends and triggers a condolence.

The User Interface features a score count and a health bar.

### Player

The player always remains in the center of the canvas, meaning that the illusion of motion is conveyed by setting the game speed to move in the opposite direction when 'in motion'.

The player has the following possible states: standing, running, jumping, falling, rolling, stun, attack1, attack2, attack3, seppaku, transcending.

The player sprite is made bidirectional by setting a 'facingRight' property to either 1 or -1, which is then used to affect the canvas context's scale to flip it horizontally, and also to affect background motion and attack success.

The player has three different contact detection boxes: 
- the first is the body contact box, used to detect hits from enemies
- the second is a short-range attack box, used to detect enemies within range of the player's short-range attacks
- the third is a long-range attack box, used to detect enemies within range of the player's long-range attacks

Attack1 kills one enemy only. Attack2 kills all enemies within short-range. Attack3 initially kills all enemies within short-range, then fries all enemies within long-range.

### Enemies

There are two enemies that behave very similarly, but for differences in spawning modes.

Enemies have the following possible states: standing, walking, dying, spawning, turning, attack1, attack2.

### Particles

Blood - As the zombies inflict damage on the player, they will trigger a spatter of player blood, and vice versa.

### Floating messages

When zombies are killed, a message 'git some!' will appear and float towards to player's score stat.

### Game controls

Keyboard - gameplay is controlled by the arrow keys for motion and 'a', 's', and 'd' keys for attacks. Spacebar pauses the game. 'r' resets the game if the game is over.

Touchscreen - touchscreen controls are activated once a 'touch' event is detected on the window. These include a joystick for motion and control pad for attack options.

## Technologies used

[Back to top](#milestone-2-project---code-eye-samurai)

- HTML5
- CSS3
- Bootstrap framework
- Vanilla JavaScript
- Jest
- GPT-4 for help with debugging and looking things up
- VSC
- Windows PowerShell terminal
- git and GitHub

## Testing

[Back to top](#milestone-2-project---code-eye-samurai)

### Automated testing

#### Jest installation

Getting Jest set up so that it would work with VSC and modules actually proved to be quite difficult, but in the end I managed it by following these steps:

- Console command: npm init
- Console command: npm install --save-dev jest
- Console command: npm install --save-dev @babel/preset-env babel-jest
- Add to package.json: 
"babel": {
  "presets": ["@babel/preset-env"]
},
"type": "module"
- Console command: npm install --save-dev jest-environment-jsdom
- Add to package.json:
"jest": {
  "testEnvironment": "jsdom"
}

I also added the node_modules folder to the gitignore to not overload the git system.

#### Jest tests

All aspects of the scripting is tested with Jest, except for functionality involving event listeners which will be tested for behaviourly.

#### Lighthouse

### Behavioural testing

## Deployment

[Back to top](#milestone-2-project---code-eye-samurai)

### GitHub Pages

This site was deployed to GitHub Pages following the steps below:
1) Log into GitHub.
2) Select the [LlewBach/ci-samurai](https://github.com/LlewBach/ci-samurai) repository.
3) Click on the "Settings" tab.
4) Scroll down to the 'Pages' section.
5) Ensure 'Source' is set to 'Deploy from a branch'.
6) Ensure the branch chosen is 'Main', from its '/(root)'.
7) Click 'Save'.
8) Refresh the page and at the top there will appear the link to the website. This link may take a few minutes to appear. Here is the link (https://llewbach.github.io/ci-samurai/).

### How to run this project locally

1. Download the IDE of your choice as well as Git.
1. Visit the GitHub repository for [ci-samurai](https://github.com/LlewBach/ci-samurai).
2. Click on "Code" and copy the HTTPS link.
3. Create the folder where you would like to save the repository.
4. In your terminal, navigate to the folder and then input 'git clone ', then paste the HTTPS link and press enter.
5. Open the folder in your IDE. Use the Live Server extension to view the HTML pages.

## Credits

[Back to top](#milestone-2-project---code-eye-samurai)

### Code

First and foremost, I would like to credit this amazing [JavaScript Game Development Course for Beginners](https://www.youtube.com/watch?v=GFO_txvwK_c). It was featured on freeCodeCamp.org's channel and the content came from the channel [Franks laboratory](https://www.youtube.com/c/Frankslaboratory).

To get a quick sense of the scope of this course, skip to 9:36:45 right at the end for an example of game play.

This course taught me the following:
- How to use sprite sheets and animate sprites on a canvas element
- How to use timestamps and deltaTime to make sure the game runs at the same speed on different machines
- How to create endlessly scrolling parallax backgrounds
- Object Orientated Programming
- State design pattern
- Collision detection
- Particle and floating text effects
- How to add touch events

A second tutorial by Frank that I followed was [Matrix Rain Experiments in JavaScript](https://www.youtube.com/watch?v=f5ZswIE_SgY). I took what I learned from this and used it as the background for my project. The only feature I added was to make it react to game play and state, by changing colour and intensity.

Thirdly, I would like to credit this tutorial on [Creating Analog Controller](https://www.youtube.com/watch?v=Wcml7OF6DNI) which got me started on creating the mobile joystick. I ended up redesigning this to work in a way I understood and added snapping behaviour. I also had to figure out myself how to make the touch coordinates translate into canvas coordinates if the canvas had been scaled down due to screen size.

Finally, I would like to credit GPT-4 for teaching me most of what I know about Jest testing.

### Art

The [samurai sprite sheet](https://chierit.itch.io/elementals-lightning-ronin) was bought from the artist 'chierit'.

The [zombie sprite sheets](https://ggoolmool.itch.io/zombie) was bought from the artist 'ggoolmool'.

The [background layers](https://bevouliin.com/science-laboratory-game-background/) were bought from the artist 'bevouliin'.

## Acknowledgements

[Back to top](#milestone-2-project---code-eye-samurai)

I'd like to thank my mentor Ben Kavanagh for this support and advice.