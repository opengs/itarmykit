// This is just an example,
// so you can safely delete all default props below

export default {
  layout: {
    dashboard: 'Main',
    modules: 'DDOS Modules',
    settings: 'Settings',
    top: 'Rankings',
    developers: 'Developers',
  },
  modules: {
    menu: {
      main: "Main",
      active: "Active Module",
      available: "Available Modules"
    },
    active: {
      selected: "Selected Module for Launch",
      enabled: {
        title: "Activate Module",
        caption: "Enable or disable module execution"
      },
      executionLog: "Execution Log",
      stdout: "Standard Output (stdout)",
      stderr: "Standard Error Output (stderr)",
    },
    available: {
      configuration: "Configuration",
      selVersion: "Select Version",
      selVersionDescription: "Module version for launch",
      autoupdates: "Automatic Updates",
      autoupdatesDescription: "Automatically update the module to the latest version",
      arguments: "Launch Parameters (for advanced users)",
      argumentsDescription: "Additional launch parameters to be used during binary file execution",
      versions: {
        versions: "List of Versions",
        downloadInstall: "Download and Install",
        selectUse: "Select for Use"
      }
    },
    db1000n: {
      scale: "Scaling",
      scaleDescription: "Used to scale the number of tasks launched, similar to running multiple instances simultaneously",
      interval: "Interval",
      intervalDescription: "Minimum interval between task iterations",
      primitive: "Primitive Mode",
      primitiveDescription: "Activate if you want to perform primitive tasks, which are less resource efficient",
      proxiesList: "Proxy List",
      proxiesListDescription: "Address (in the file system or on the Internet) to the file with proxy servers in the format 'protocol://ip:port' or 'ip:port'",
      proxyProtocol: "Proxy Protocol",
      proxyProtocolDescription: "Protocol to use if not defined in the proxy list"
    },
    mhddosProxy: {
      copies: "Copies",
      copiesDescription: "Number of processes (module copies) launched. 0 for auto",
      threads: "Threads",
      threadsDescription: "Number of threads launched per process. 0 for auto",
      useMyIp: "Use My IP",
      useMyIpDescription: "Percentage of using your own IP address or VPN, if configured"
    },
    distress: {
      concurrency: "Concurrency",
      concurrencyDescription: "Number of task creators. 0 sets default to 4096",
      torConnections: "Tor Connections",
      torConnectionsDescription: "Use Tor connections for the attack",
      useMyIp: "Use My IP",
      useMyIpDescription: "Percentage of using your own IP address or VPN, if configured",
      udpFlood: "UDP Flood",
      udpFloodDescription: "Allow UDP flood attack. Works if you use your own IP or VPN"
    }
  },
  top: {
    volunteers: "TOP VOLUNTEERS",
    week: "Per Week",
    month: "Per Month",

    achievements: {
      peopleAreLikeShips: {
        title: "People are like Ships",
        subtitle: "if they're Russian, they're going *****",

        body: "Looks like you just tried to select Russian language. You need us to rescue you. Don't worry, we'll soon denazify and liberate you.",
        explanationHint: "I don't understand. Clarify this meme for me.",
        explanation: '"russian warship, go fuck yourself", was the final communication made on 24 February, the first day of the 2022 Snake Island campaign, by Ukrainian border guard Roman Hrybov to the russian missile cruiser moskva. On 13 April 2022, moskva was critically damaged by an explosion caused by Ukrainian anti-ship missiles and sank the following day. "People are like ships" is a well-known in Ukraine song by Skryabin band.Denazification and making Ukrainians free - are slogans of russian propaganda of "russian world" doctrine.',
        goodButton: "I'm silly. Please liberate me.",
        badButton: "I don't like Ukraine",
      },
    }
  },
  bootstrap: {
    title: "Looks like this is your first launch. Let's help you",

    header: {
      language: "Choose Language",
      data: "Data",
      itarmy: "ITArmy ID",
      module: "Modules"
    },

    language: {
      continueButton: "Continue"
    },

    data: {
      body: "The app will automatically download the necessary modules and save them on your PC. Modules and all data will be stored in the folder",
      windows: "Before continuing, make sure you've added the data folder to the windows defender and antivirus exceptions. Otherwise, all downloaded data will be deleted.",
      openDataFolderButton: "Open Data Folder",
      changeDataFolderButton: "Change Data Folder",
      continueButton: "Continue",
      backButton: "Back"
    },

    itarmy: {
      body: "If you have an ITArmy ID, enter it below. If not, press the continue button",
      uuidInputTitle: "ITArmy ID",
      continueButton: "Continue",
      backButton: "Back"
    },

    module: {
      body: "Choose a preset. All data can then be changed",
      installation: {
        title: "Module Installation",
      },
      preset: {
        government: {
          title: "Government Institution / Old PC",
          description: "This preset uses as few resources as possible. This may disable some module functions.",
        },
        laptop: {
          title: "Laptop",
          description: "This preset will try to use as few resources as possible but won't disable functions.",
        },
        normal: {
          title: "Normal",
          description: "Normal home computer. This preset uses the configuration provided by module developers by default.",
        },
        max: {
          title: "Maximum",
          description: "Maximum power. This preset uses the maximum resources of your computer. This may cause lags in other programs.",
        },
        expert: {
          title: "Expert",
          description: "This preset does not perform any actions. All settings must be done manually.",
        }
      }
    },

    doneDialog: {
      title: "Setup Completed",
      body: "Now you can start using the application. But we need a bit more time to prepare everything (1-3 minutes). During this time there may be no updates on the main dashboard. This is normal for the first launch :) In a few minutes, charts and current information will appear on the main dashboard.",
      finishButton: "Great! Let's start!",
    }
  },
  settings: {
    system: "System",
    look: "GUI",
    darkMode: "Dark Mode",
    matrixMode: "Matrix Mode",
    autoUpdates: "Automatic Updates",
    autoUpdatesDescription: "Automatically update the application to the latest version.",
    autoStartup: "Automatic Startup",
    autoStartupDescription: "Automatically start the application when the system boots.",
    hideTray: "Hide App in Tray",
    hideTrayDescription: "Hide the app in the tray, not close it. Also, do not show the main window during startup.",
    language: "Language",
    idDescription: "How to get ID ? Look on",
    data: "Storage",
    dataDescription: "Currently your modules are located in the folder:",
    warnDelCache: "Are you sure you want to delete the modules cache? The app will close after this action and may not restart automatically.",
    warnDelData: "Do you really want to delete all data, including cache, settings, and modules? The app will close after this action and may not restart automatically.",
    openDataFolder: "Open Data Folder",
    changeModulesDataLocation: "Change Modules Data Location",
    deleteModulesCache: "Delete Modules Cache",
    deleteAllTheData: "Delete All Data",

    matrixQuiz: {
      header: "Wake up, {name} ...",
      body: "You are genno-modified ukrnazi from west Ukraine laboratories. We are all brain-washed and think the same. Answer associations (first what is on your mind) to prove that.",

      q1: "What is rustling?",
      q2: "Who is putin?",
      q3: "What is dried up?",

      cancell: "Wake up as nothing happened",
      submit: "Down to the rabbit hole",
    }
  },
  
  dashboard: {
    statistics: "Attack Power Statistics",
	bytes: "Sent / Traffic",
	moduleStatus: "Module Status",
	updates: "KIT Version",
	latest: "Current"
  }
}
