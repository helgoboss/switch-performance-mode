# Switch performance mode

This is a script to be used on my Windows computers to switch between multiple performance modes. It works by enabling or disabling Windows services, hardware devices, processes, Windows features etc. (for a complete list see section "Scope"). It's very tailored to my custom environment.

Here's the list of modes:

| Mode | When to use | Description (*) |
| ------- | ----------- | ------- |
| normal | Normal kind of work without special performance requirements | Everything enabled|
| studio | Studio work, when you want to have a compromise between high audio performance and comfort | A few nice-to-have services disabled but convenient stuff like Dropbox still running |
| live | Live performances, when real-time audio without dropouts is highest priority | Even convenience features switched off

(*) Just an extract, see script content for details!

## Installation

1. Install the following packages via Chocolatey (or manually)
    - nodejs
    - devmanview
2. Execute `npm install --global`
3. If you want to use ThrottleStop to disable CPU energy saving features on-demand (instead of disabling them permanently in the BIOS):
    - Download [ThrottleStop](https://www.techpowerup.com/download/techpowerup-throttlestop/) and make it executable at "C:\Users\helgo\Documents\opt\throttlestop\ThrottleStop.exe"

## Usage

    switch-performance-mode [normal|studio|live]

## Scope

This script mainly takes care of enabling/disabling optimizations that are sometimes desirable and sometimes not, depending on how you want to use the system:

- Activate a user-defined power scheme
- Enable/disable certain hardware devices
- Enable/disable certain Windows services (includes support for `BlackViper.csv`)
- Exit certain processes
- Enable/disable certain Windows features
- Enable/disable Windows Defender (Antivirus software)
- Enable/disable visual effects
- Launch ThrottleStop to remind you to enable an appropriate CPU performance profile

However, the script doesn't take care of *every* optimization that should be done to optimize the system for real-time audio. There are some general optimizations which should be done manually and need to be done only once because there's usually no need to undo those optimizations later on when you want to do normal kind of work.

The Focusrite guide "Optimising your PC for Audio on Windows 10" provides a pretty comprehensive list of possible performance optimizations. Here's a boiled down list that enumerates only those optimizations which I consider as important for my system and which should be applied manually *in addition* to this script:

- Create a custom power scheme based on the "high performance" scheme with everything set to top performance
    - Once you have created this scheme, this script can take care of activating it. See the script content for details.
- Disable system sounds
- Set processor scheduling to "Background services"
- Disable CPU power saving options in BIOS
    - If you use ThrottleStop instead, the script starts it for you to remind you to set the correct profile.
- Disable Windows background apps
- Disable "Windows updates from more than one place"
- Don't allow computer to turn off "USB Root Hub" devices
- Use LatencyMon to check if you forgot the most important optimizations