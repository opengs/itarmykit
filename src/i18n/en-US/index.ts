// This is just an example,
// so you can safely delete all default props below

export default {
  layout: {
    dashboard: 'Main',
    modules: 'DDOS Modules',
    activeness: 'Activeness',
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
      UDPFlood: "Disable UDP Flood",
      UDPFloodDescription: "Disallow UDP flood attack. Works if you use your own IP",
      ICMPFlood: "Enable ICMP Flood",
      ICMPFloodDescription: "Allow ICMP flood attack. Works if you use your own IP",
      PACKETFlood: "Enable PACKET Flood",
      PACKETFloodDescription: "Not work in OS Windows! Allow PACKET flood attack. Works if you use your own IP"
    }
  },
  top: {
    volunteers: "TOP VOLUNTEERS",
    week: "Per Week",
    month: "Per Month",
    activeness: "Activeness",

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
    },

    activenessData: {
      notifyLoadFailed: "Failed to load activeness statistics. Error: {error}"
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
        comfort: {
          title: "Comfort",
          description: "This preset uses resources in comfortable mode. Does not affect the performance of your computer.",
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
    warnDelStatistics: "Are you sure you want to delete the statistics?",
    warnDelCache: "Are you sure you want to delete the modules cache? The app will close after this action and may not restart automatically.",
    warnDelData: "Do you really want to delete all data, including cache, settings, and modules? The app will close after this action and may not restart automatically.",
    openDataFolder: "Open Data Folder",
    changeModulesDataLocation: "Change Modules Data Location",
    deleteStatistics: "Delete Statistics",
    deleteModulesCache: "Delete Modules Cache",
    deleteAllTheData: "Factory Settings",

    matrixQuiz: {
      header: "Wake up, {name} ...",
      body: "You are genno-modified ukrnazi from west Ukraine laboratories. We are all brain-washed and think the same. Answer associations (first what is on your mind) to prove that.",

      q1: "What is rustling?",
      q2: "Who is putin?",
      q3: "What is dried up?",

      cancell: "Wake up as nothing happened",
      submit: "Down to the rabbit hole",
    },
  },

  dashboard: {
    statistics: "Attack Power Statistics",
	bytes: "Sent / Traffic / Total",
  bytesHint: "Statistics of send traffic may be not accurate. It depends on the module and the way it works. Total statistics is always precise and shows aggregated information from all the running tools.",
	moduleStatus: "Module Status",
	updates: "KIT Version",
	latest: "Current",
  activeness: {
    score: "Activeness Score",
  },
  itarmyAPIKeyEmpty: "IT Army ID is not specified. It is not critical, but it is necessary for displaying general statistics. You can specify it in the settings.",
  },

  developers: {
    shieldSubtitle: "We are an organization that has been operating since February 25, 2022 - the second day of moscovia's full-scale invasion of Ukraine.",
    shieldMore: "Learn more about us and our operations:",
    partners: "Colleges and Partners",
    contacts: "Contacts",
    contactP1: "For questions about the application, first, ask in the IT Army chat:",
    contactP1_1: "or, as a last resort, on our channel",
    contactP1_2: "If you write to us on the channel, remember that we have very few resources and might not respond. But usually, there are community members who can help.",
    contactP2: "Technical problems with the application - if you know how to use Github, please create an issue in the repository",
    contactP2_1: "if not - ask in the IT Army chat.",
    contactP3: "Questions about modules - direct them to the module developers.",
    contributors: "Contributors",
    contributorsSubtitle: "Help improve the program and your name will automatically appear in this list. The list also shows contributors to the previous version of the application and some modules."
  },

  activeness: {
    login: {
      title: "Activeness Login",
      email: "Email",
      password: "Password",
      info: "Unfortunatelly, activeness requires additional login to be used. In future we will try to provide one login to all the IT Army services. If you dont know what is the Activeness, visit https://activeness.social/",
      loginButton: "Login / Register",
      failed: "Login failed. Check your credentials/network connection/activeness status and try again.",
    },
    tasksTable: {
      title: "Tasks",
      id: "ID",
      what: "What to do",
      link: "Link",
      description: "Description",
      actions: "Actions",
      priority: "This task is priority. It is very important to do it first.",
    },

    logoutButton: "Logout",
    suggesttarget: "Suggest my target",

    notifyTaskLoadFailed: "Failed to load tasks. Error: {error}",
    notifyFailedToMakeTaskDone: "Failed to make task done. Error: {error}",
    notifyFailedTOIgnoreTask: "Failed to ignore task. Error: {error}",
  }
}