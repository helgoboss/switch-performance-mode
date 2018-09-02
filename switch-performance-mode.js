#!/usr/bin/env node
// Configuration
// -------------

// Hint: [normal, studio, live]


const dryRun = false

// The power scheme to be activated whenever this script runs (no matter the mode).
// Important because sometimes the power scheme seems to be reset, that's very bad for audio
// and bad for normal operation. Determine the GUID by executing 'powercfg -l'
const powerSchemeGuid = '05296fe9-5838-48ec-ae9c-572bdf2ec4ad'

const devices = {
    "Marvell AVASTAR Wireless-AC Network Controller": [true, true, false],
    "Mikrofonarray (Realtek High Definition Audio(SST))": [true, true, false],
    "ADAT (3+4) (RME Babyface)": [true, true, false],
    "ADAT (5+6) (RME Babyface)": [true, false, false],
    "ADAT (7+8) (RME Babyface)": [true, false, false],
    "Analog (1+2) (RME Babyface)": [true, false, false],
    "Analog (3+4) (RME Babyface)": [true, false, false],
    "Lautsprecher (RME Babyface)": [true, false, false],
    "SPDIF/ADAT (1+2) (RME Babyface)": [true, false, false],
    "Intel(R) AVStream Camera 2500": [true, false, false],
    "Realtek High Definition Audio(SST)": [true, true, false],
    "Intel(R) Display-Audio": [false, false, false],
    "Marvell AVASTAR-Bluetooth-Funkadapter": [true, true, false],
    "Microsoft Surface ACPI-Compliant Control Method Battery": [true, true, false]
}

const services = {
    "AdobeARMservice": {
        displayName: "Adobe Acrobat Update Service",
        defaultStartType: "auto",
        states: [false, false, false]
    },
    "Everything": {
        displayName: "Everything",
        defaultStartType: "auto",
        states: [true, true, false]
    },
    "dbupdate": {
        displayName: "Dropbox-Update-Service (dbupdate)",
        defaultStartType: "delayed-auto",
        states: [true, true, false]
    },
    "dbupdatem": {
        displayName: "Dropbox-Update-Service (dbupdatem)",
        defaultStartType: "demand",
        states: [true, true, false]
    },
    "DbxSvc": {
        displayName: "DbxSvc",
        defaultStartType: "auto",
        states: [true, true, false]
    },
    "CrashPlanService": {
        displayName: "CrashPlan PRO Backup Service",
        defaultStartType: "auto",
        states: [true, false, false]
    },
    "com.docker.service": {
        displayName: "Docker for Windows Service",
        defaultStartType: "auto",
        states: [false, false, false]
    },
    "Bonjour Service": {
        displayName: "Dienst \"Bonjour\"",
        defaultStartType: "auto",
        states: [true, true, false]
    },
    "NIHardwareService": {
        displayName: "NIHardwareService",
        defaultStartType: "auto",
        states: [true, false, false]
    },
    "NIHostIntegrationAgent": {
        displayName: "NIHostIntegrationAgent",
        defaultStartType: "auto",
        states: [true, false, false]
    },
    // "AdvanceAudioDevMon": {
    //     displayName: "ADVANCE Audio Device Monitor",
    //     defaultStartType: "auto",
    //     states: [true, true, true]
    // },
    // "NVDisplay.ContainerLocalSystem": {
    //     displayName: "NVIDIA Display Container LS",
    //     defaultStartType: "auto",
    //     states: [true, true, true]
    // },
    "WSearch": {
        displayName: "Windows Search",
        defaultStartType: "delayed-auto",
        states: [true, true, false]
    },
    "wuauserv": {
        displayName: "Windows Update",
        defaultStartType: "demand",
        states: [true, false, false]
    },
    // "ShellHWDetection": {
    //     displayName: "Shellhardwareerkennung",
    //     defaultStartType: "auto",
    //     states: [true, true, true]
    // },
    // "Themes": {
    //     displayName: "Designs",
    //     defaultStartType: "auto",
    //     states: [true, true, true]
    // },
    "ClickToRunSvc": {
        displayName: "Microsoft Office-Klick-und-Los-Dienst",
        defaultStartType: "auto",
        states: [true, false, false]
    }
}

// Def = Default (so wird Windows ausgeliefert), Safe = Abgespeckt (abgeschaltet, was sicher abgeschaltet werden kann)
// Desk = Desktop (nicht nehmen!), Lap = Laptop
// Min = Es werden nur die Services angerührt, welche nicht eh schon von Haus aus den jeweiligen Startmodus haben (wir sollten immer Min nehmen, um nicht zuviel zu machen)
const blackViperServices = ["Def-Pro-Min", "Def-Pro-Min", "Safe-Lap-Min"]

const processes = {
    "Everything.exe": [true, true, false],
    "Dropbox.exe": [true, true, false],
    "CrashPlanTray.exe": [true, false, false],
    "BoxcryptorClassic.exe": [true, true, false],
    "Ditto.exe": [true, true, false],
    "Greenshot.exe": [true, true, false],
    "jetbrains-toolbox.exe": [true, false, false],
    "KeePass.exe": [true, true, false],
    "PureText.exe": [true, true, false],
    "SyncTrayzor.exe": [true, false, false],
    "MSASCuiL.exe": [true, true, false] // Windows Defender notification icon
}

const features = {
    "Microsoft-Hyper-V-All": [false, false, false]
}

const processorFlags = {
    "C1E": [true, false, false],
    "SpeedStep": [true, false, false]
}

const antivirus = [true, true, false]

const visualEffects = [true, false, false]

// TODO Device energy settings: https://superuser.com/a/774463

// Main code
// ---------

const path = require('path')
const fs = require('fs')
const sh = require('shelljs')
const parse = require('csv-parse')

const mode = process.argv[2]
const modeIndex = getModeIndex(mode)

if (dryRun) {
    sh.echo("DRY RUN")
}
sh.echo(`Entering ${mode} mode...`)

processAll()


// Functions
// ---------

function processAll() {
    processPowerScheme()
    processBlackViperServices(() => {
        processDevices()
        processServices()
        processProcesses()
        processFeatures()
        processAntivirus()
        processVisualEffects()
        processProcessorFlags()
    })
}

function processPowerScheme() {
    printHeading("Power scheme")
    activatePowerScheme(powerSchemeGuid)
}

function processDevices() {
    printHeading("Devices")
    for (var devId in devices) {
        printSubHeading(devId)
        const devConf = devices[devId]
        const devEnabled = devConf[modeIndex]
        if (devEnabled) {
            enableDevice(devId)
        } else {
            disableDevice(devId)
        }
    }
}

function processServices() {
    printHeading("Services")
    for (var serviceId in services) {
        printSubHeading(serviceId)
        const serviceConf = services[serviceId]
        const serviceEnabled = serviceConf.states[modeIndex]
        if (serviceEnabled) {
            enableService(serviceId, serviceConf.defaultStartType)
        } else {
            disableService(serviceId)
        }
    }
}

function processBlackViperServices(nextOperations) {
    const mapping = {
        "1": "disabled",
        "2": "demand",
        "3": "auto",
        "4": "delayed-auto"
    }
    const profileName = blackViperServices[modeIndex]
    // Parses CSV file from BlackViperScript (https://github.com/madbomb122/BlackViperScript)
    const parser = parse({ comment: '#' }, (err, output) => {
        printHeading("BlackViper Services")
        const headingRow = output[0]
        const profileColumn = headingRow.indexOf(profileName)
        for (var i = 2; i < output.length; i++) {
            const row = output[i]
            if (row[profileColumn] != "0") {
                const serviceId = row[0]
                const startTypeNumeric = row[profileColumn]
                const startType = mapping[startTypeNumeric]
                printSubHeading(`${serviceId} => ${startType}`)
                switch (startType) {
                    case "disabled":
                        stopService(serviceId)
                        break
                    case "auto":
                    case "delayed-auto":
                        startService(serviceId)
                        break
                }
                setServiceStartType(serviceId, startType)
            }
        }
        nextOperations()
    })
    const blackViperCsvPath = path.resolve(__dirname, 'lib/BlackViperScript/BlackViper.csv')
    fs.createReadStream(blackViperCsvPath).pipe(parser);
}

function processProcesses() {
    printHeading("Processes")
    for (var processId in processes) {
        printSubHeading(processId)
        const processConf = processes[processId]
        const processEnabled = processConf[modeIndex]
        if (processEnabled) {
            enableProcess(processId)
        } else {
            disableProcess(processId)
        }
    }
}

function processFeatures() {
    printHeading("Features")
    for (var featureId in features) {
        printSubHeading(featureId)
        const featureConf = features[featureId]
        const featureEnabled = featureConf[modeIndex]
        if (featureEnabled) {
            enableFeature(featureId)
        } else {
            disableFeature(featureId)
        }
    }
}

function processAntivirus() {
    printHeading("Antivirus")
    const antivirusEnabled = antivirus[modeIndex]
    if (antivirusEnabled) {
        enableAntivirus()
    } else {
        disableAntivirus()
    }
}

function processVisualEffects() {
    printHeading("Visual effects")
    const visualEffectsEnabled = visualEffects[modeIndex]
    if (visualEffectsEnabled) {
        enableVisualEffects()
    } else {
        disableVisualEffects()
    }
}

function processProcessorFlags() {
    printHeading("Processor flags")
    launchThrottleStop()
}

function getModeIndex(mode) {
    switch (mode) {
        case "normal": return 0
        case "studio": return 1
        case "live": return 2
        default:
            sh.echo(`Unknown mode ${mode}`)
            sh.exit(1)
    }
}

function enableDevice(devId) {
    sh.echo(`Enabling device "${devId}"...`)
    exec(`devmanview /enable "${devId}"`)
}

function disableDevice(devId) {
    sh.echo(`Disabling device "${devId}"...`)
    exec(`devmanview /disable "${devId}"`)
}

function enableService(serviceId, defaultStartType) {
    sh.echo(`Enabling service "${serviceId}"...`)
    setServiceStartType(serviceId, defaultStartType)
    startService(serviceId)
}

function disableService(serviceId) {
    sh.echo(`Disabling service "${serviceId}"...`)
    setServiceStartType(serviceId, "disabled")
    stopService(serviceId)
}

function setServiceStartType(serviceId, startType) {
    exec(`sc config "${serviceId}" start= ${startType}`)
}

function startService(serviceId) {
    exec(`sc start "${serviceId}"`)
}

function stopService(serviceId) {
    exec(`sc stop "${serviceId}"`)
}

function enableProcess(processId) {
    sh.echo(`Attempted to enable process "${processId}" but starting processes not supported`)
}

function disableProcess(processId) {
    sh.echo(`Disabling process "${processId}"...`)
    killProcess(processId)
}

function killProcess(fileName) {
    exec(`wmic process where name="${fileName}" call terminate`)
}

function printHeading(heading) {
    sh.echo(`\n# ${heading}`)
}

function printSubHeading(heading) {
    sh.echo(`\n## ${heading}`)
}

function enableAntivirus() {
    sh.echo("Enabling real-time virus scanning...")
    exec(`powershell "Set-MpPreference -DisableRealtimeMonitoring $false"`)
}

function disableAntivirus() {
    sh.echo("Disabling real-time virus scanning...")
    exec(`powershell "Set-MpPreference -DisableRealtimeMonitoring $true"`)
}

function enableVisualEffects() {
    sh.echo("Enabling visual effects...")
    changeVisualEffectsMainRegistryEntry("1")
    exec("systempropertiesperformance")
}

function disableVisualEffects() {
    sh.echo("Disabling visual effects...")
    changeVisualEffectsMainRegistryEntry("2")
    exec("systempropertiesperformance")
}

function changeVisualEffectsMainRegistryEntry(data) {
    changeDwordRegistryEntry(
        "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects",
        "VisualFXSetting",
        data
    )
}

function changeDwordRegistryEntry(path, value, data) {
    exec(`reg add "${path}" /f /v "${value}" /t REG_DWORD /d "${data}"`)
}

function changeBinaryRegistryEntry(path, value, data) {
    exec(`reg add "${path}" /f /v "${value}" /t REG_BINARY /d "${data}"`)
}

function enableFeature(feature) {
    sh.echo(`Enabling feature ${feature}...`)
    exec(`powershell "Enable-WindowsOptionalFeature -Online -FeatureName ${feature} -NoRestart"`)
}

function disableFeature(feature) {
    sh.echo(`Disabling feature ${feature}...`)
    exec(`powershell "Disable-WindowsOptionalFeature -Online -FeatureName ${feature} -NoRestart"`)
}

function launchThrottleStop() {
    exec("C:\\Users\\helgo\\Documents\\opt\\throttlestop\\ThrottleStop.exe")
}

function activatePowerScheme(schemeGuid) {
    exec(`powercfg -setactive ${schemeGuid}`)
}

function exec(command) {
    if (dryRun) {
        sh.echo(`Would execute [${command}]`)
    } else {
        sh.exec(command)
    }
}