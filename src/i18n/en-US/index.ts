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
      itarmy: "ITArmy ID"

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
    }
  }
}
