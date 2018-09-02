# Switch performance mode

This is a script to be used on my Windows computers to switch between multiple performance modes. It works by enabling/disabling Windows services, hardware devices, processes, Windows features etc. It's very tailored to my custom environment.

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

    node switch-performance-mode [normal|studio|live]