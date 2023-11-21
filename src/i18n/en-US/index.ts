// This is just an example,
// so you can safely delete all default props below

export default {
  layout: {
    dashboard: 'Dashboard',
    modules: 'DDOS modules',
    settings: 'Settings',
    top: 'Leaderboard',
    developers: 'Developers',
  },
  modules: {
    active: {
      selected: "Seleted module to run",
      enabled: {
        title: "Module enabled",
        caption: "Enable or disable module execution"
      },
      executionLog: "Execution log",
      stdout: "Standard output (stdout)",
      stderr: "Standard error (stderr)",
    }
  },
  top: {
    achivements: {
      peopleAreLikeShips: {
        title: "People are like ships",
        subtitle: "if russians - ** **** ********",

        body: "Looks like you have just tried to select russian language. You need our help. Dont wory, we will denazificate you and make you free.",
        explanationHint: "I dont understand. Explain me this meme.",
        explanation: '"russian warship, go fuck yourself", was the final communication made on 24 February, the first day of the 2022 Snake Island campaign, by Ukrainian border guard Roman Hrybov to the russian missile cruiser moskva. On 13 April 2022, moskva was critically damaged by an explosion caused by Ukrainian anti-ship missiles and sank the following day. "People are like ships" is a well-known in Ukraine song by Skryabin band.Denazification and making Ukrainians free - are slogans of russian propaganda of "russian world" doctrine.',
      
        goodButton: "Sory. I'm underdeveloped. I'm ready to be free",
        badButton: "I dont like Ukraine",
      },
    }
  },
  bootstrap: {
    title: "Looks like you are first time here. Let us help you",

    header: {
      language: "Select language",
      data: "Data",
      itarmy: "ITArmy ID",
      module: "Modules"
    },

    language: {
      continueButton: "Continue"
    },

    data: {
      body: "Application will automatically download required modules and store them on yours PC. Modules and all the data will be stored in the folder",
      windows: "Before continue, make sure you added data folder to the windows defender and antivirus exceptions. Otherwise, all the downloaded data will be deleted.",
      openDataFolderButton: "Open data folder",
      changeDataFolderButton: "Change data folder",
      continueButton: "Continue",
      backButton: "Back"
    },

    itarmy: {
      body: "If you have ITArmy ID, you can enter it here. Otherwise, you can skip this step.",
      uuidInputTitle: "ITArmy ID",
      continueButton: "Continue",
      backButton: "Back"
    },

    module: {
      body: "Select configuration preset. You can change all the configured options later.",
      installation: {
        title: "Installing module"
      },
      preset: {
        government: {
          title: "Government / Old PC",
          description: "This preset will use as little resources as possible. This may cut several features of the modules.",
        },
        laptop: {
          title: "Laptop",
          description: "This preset will try to use less resources, but will not cut features.",
        },
        normal: {
          title: "Normal",
          description: "Normal computer at home. This preset will use default (supplied by developers) configuration options for installed modules",
        },
        max: {
          title: "Maximum",
          description: "Maximum performance. This preset will use maximum resources of your computer. This may cause some lags in other applications.",
        },
        expert: {
          title: "Expert",
          description: "Dont make any changes to the configuration. You will have to provide everything manually",
        }
      }
    },

    doneDialog: {
      title: "Bootstrap completed",
      body: "You can start using application now. Application still need some time to start (1-3 minutes). During this time there may no be updates on the GUI. This is OK for first launch :). After some period of time chart an the dashboard will appear.",
      finishButton: "Cool. I'm ready to start",
    }
  }
}
