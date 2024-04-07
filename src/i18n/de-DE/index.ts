// This is just an example,
// so you can safely delete all default props below

export default {
  layout: {
    dashboard: 'Hauptseite',
    modules: 'DDOS-Module',
    activeness: 'Activeness',
    settings: 'Einstellungen',
    top: 'Ranglisten',
    developers: 'Entwickler',
  },
  modules: {
    menu: {
      main: "Hauptseite",
      active: "Aktives Modul",
      available: "Verfügbare Module"
    },
    active: {
      selected: "Ausgewähltes Modul zum Start",
      enabled: {
        title: "Modul aktivieren",
        caption: "Modulausführung aktivieren oder deaktivieren"
      },
      executionLog: "Ausführungsprotokoll",
      stdout: "Standardausgabe (stdout)",
      stderr: "Standardfehlerausgabe (stderr)",
    },
    available: {
      configuration: "Konfiguration",
      selVersion: "Version auswählen",
      selVersionDescription: "Die Modulversion zum Start",
      autoupdates: "Automatische Updates",
      autoupdatesDescription: "Das Modul automatisch auf die neueste Version aktualisieren",
      arguments: "Startparameter (für fortgeschrittene Nutzer)",
      argumentsDescription: "Zusätzliche Startparameter für die Ausführung der Binärdatei",
      versions: {
        versions: "Liste der Versionen",
        downloadInstall: "Herunterladen und Installieren",
        selectUse: "Für Verwendung auswählen"
      }
    },
    db1000n: {
      scale: "Skalierung",
      scaleDescription: "Wird verwendet, um die Anzahl der gestarteten Aufgaben zu skalieren, ähnlich wie bei der gleichzeitigen Ausführung mehrerer Instanzen",
      interval: "Intervall",
      intervalDescription: "Mindestintervall zwischen Aufgabendurchläufen",
      primitive: "Primitiver Modus",
      primitiveDescription: "Aktivieren, wenn Sie primitive Aufgaben ausführen möchten, die weniger ressourceneffizient sind",
      proxiesList: "Proxy-Liste",
      proxiesListDescription: "Adresse (im Dateisystem oder im Internet) zu der Datei mit den Proxy-Servern im Format 'protocol://ip:port' oder 'ip:port'",
      proxyProtocol: "Proxy-Protokoll",
      proxyProtocolDescription: "Zu verwendendes Protokoll, wenn nicht in der Proxy-Liste definiert"
    },
    mhddosProxy: {
      copies: "Kopien",
      copiesDescription: "Die Anzahl der gestarteten Prozesse (Modulkopien). 0 für Auto",
      threads: "Threads",
      threadsDescription: "Die Anzahl der gestarteten Threads pro Prozess. 0 für Auto",
      useMyIp: "Meine IP benutzen",
      useMyIpDescription: "Der Prozentanteil der Verwendung Ihrer eigenen IP-Adresse oder VPN, wenn konfiguriert"
    },
    distress: {
      concurrency: "Nebenläufigkeit",
      concurrencyDescription: "Die Anzahl der Aufgabenersteller. 0 setzt Standardwert auf 4096 ",
      torConnections: "Tor-Verbindungen",
      torConnectionsDescription: "Tor-Verbindungen für den Angriff verwenden",
      useMyIp: "Meine IP benutzen",
      useMyIpDescription: "Der Prozentanteil der Verwendung Ihrer eigenen IP-Adresse oder VPN, wenn konfiguriert",
      UDPFlood: "UDP-Flood deaktivieren",
      UDPFloodDescription: "UDP-Flood-Angriff verbieten. Funktioniert nur mit Ihrer eigenen IP-Adresse",
      ICMPFlood: "ICMP-Flood aktivieren",
      ICMPFloodDescription: "ICMP-Flood-Angriff erlauben. Funktioniert nur mit Ihrer eigenen IP-Adresse",
      PACKETFlood: "PACKET-Flood aktivieren",
      PACKETFloodDescription: "Funktioniert nicht unter OS Windows! PACKET-Flood-Angriff erlauben. Funktioniert nur mit Ihrer eigenen IP-Adresse"
    }
  },
  top: {
    volunteers: "TOP FREIWILLIGE",
    week: "Pro Woche",
    month: "Pro Monat",
    activeness: "Activeness",

    achievements: {
      peopleAreLikeShips: {
        title: "Menschen sind wie Schiffe",
        subtitle: "Wenn sie russisch sind, fahren sie zur Hölle",

        body: "Es scheint, als hätten Sie gerade versucht, die russische Sprache auszuwählen. Sie brauchen uns, um Sie zu retten. Keine Sorge, wir werden Sie bald denazifizieren und befreien.",
        explanationHint: "Ich verstehe nicht. Erläutern Sie mir dieses Meme.",
        explanation: '"russisches Kriegsschiff, geh fick dich selbst", war die letzte Kommunikation, die am 24. Februar, dem ersten Tag der Snake-Island-Kampagne 2022, vom ukrainischen Grenzschützer Roman Hrybov an den russischen Lenkwaffenkreuzer moskva gerichtet wurde. Am 13. April 2022 wurde moskva durch eine Explosion, verursacht von ukrainischen Anti-Schiffs-Raketen, kritisch beschädigt und sank am folgenden Tag. "Menschen sind wie Schiffe" ist ein bekanntes Lied der Band Skryabin in der Ukraine. Die Denazifizierung und die Befreiung der Ukrainer sind Slogans der russischen Propaganda der "russischen Welt"-Doktrin.',
        goodButton: "Ich bin albern. Bitte befreien Sie mich",
        badButton: "Ich mag die Ukraine nicht",
      },
    },

    activenessData: {
      notifyLoadFailed: "Fehler beim Laden der Activeness-Statistiken. Fehler: {error}"
    }
  },
  bootstrap: {
    title: "Es scheint, dies ist Ihr erster Start. Lassen Sie uns Ihnen helfen.",

    header: {
      language: "Sprache auswählen",
      data: "Daten",
      itarmy: "ITArmy ID",
      module: "Module"
    },

    language: {
      continueButton: "Weiter"
    },

    data: {
      body: "Die Anwendung wird automatisch die erforderlichen Module herunterladen und auf Ihrem PC speichern. Module und alle Daten werden im Ordner gespreichert",
      windows: "Bevor Sie fortfahren, stellen Sie sicher, dass Sie den Datenordner zu den Ausnahmen von Windows Defender und dem Antivirenprogramm hinzugefügt haben. Andernfalls werden alle heruntergeladenen Daten gelöscht.",
      openDataFolderButton: "Datenordner öffnen",
      changeDataFolderButton: "Datenordner ändern",
      continueButton: "Weiter",
      backButton: "Zurück"
    },

    itarmy: {
      body: "Wenn Sie eine ITArmy ID haben, geben Sie sie unten ein. Andernfalls klicken Sie auf die 'Weiter' Taste",
      uuidInputTitle: "ITArmy ID",
      continueButton: "Weiter",
      backButton: "Zurück"
    },

    module: {
      body: "Wählen Sie eine Voreinstellung aus. Alle Daten können dann geändert werden",
      installation: {
        title: "Modulinstallation",
      },
      preset: {
        government: {
          title: "Staatseinrichtung / Alter PC",
          description: "Diese Voreinstellung verwendet so wenig Ressourcen wie möglich. Dies kann einige Modulfunktionen deaktivieren.",
        },
        laptop: {
          title: "Laptop",
          description: "Diese Voreinstellung versucht, so wenig Ressourcen wie möglich zu verwenden, ohne dabei Funktionen zu deaktivieren.",
        },
        comfort: {
          title: "Komfort",
          description: "Diese Voreinstellung verwendet Ressourcen im Komfortmodus. Es beeinträchtigt die Leistung Ihres Computers nicht.",
        },
        normal: {
          title: "Normal",
          description: "Normaler Heimcomputer. Diese Voreinstellung verwendet standardmäßig die Konfiguration, die von den Modulentwicklern bereitgestellt wird.",
        },
        max: {
          title: "Maximal",
          description: "Höchste Leistung. Diese Voreinstellung verwendet die maximale Ressourcenkapazität Ihres Computers. Dies kann Verzögerungen in anderen Programmen verursachen.",
        },
        expert: {
          title: "Experte",
          description: "Diese Voreinstellung führt keine Aktionen aus. Alle Einstellungen müssen manuell gesetzt werden.",
        }
      }
    },

    doneDialog: {
      title: "Einrichtung abgeschlossen",
      body: "Jetzt können Sie die Anwendung verwenden. Wir benötigen jedoch noch etwas Zeit, um alles vorzubereiten (1-3 Minuten). Während dieser Zeit kann es keine Updates auf dem Hauptdashboard geben. Dies ist normal für den ersten Start :) In wenigen Minuten werden Diagramme und aktuelle Informationen auf dem Hauptdashboard angezeigt.",
      finishButton: "Großartig! Los geht's!",
    }
  },
  settings: {
    system: "System",
    look: "GUI",
    darkMode: "Dunkelmodus",
    matrixMode: "Matrix-Modus",
    autoUpdates: "Automatische Updates",
    autoUpdatesDescription: "Die Anwendung automatisch auf die letzte Version aktualiseren.",
    autoStartup: "Autostart",
    autoStartupDescription: "Die Anwendung automatisch starten, wenn das System hochfährt.",
    hideTray: "Anwendung im Infobereich verstecken",
      hideTrayDescription: "Die App im Infobereich verstecken, aber nicht schließen. Das Hauptfenster beim Start nicht anzeigen.",
    language: "Sprache",
    idDescription: "Wie kann man ID bekommen? Schauen Sie nach",
    data: "Speicher",
    dataDescription: "Derzeit sind Ihre Module im Ordner:",
    warnDelStatistics: "Sind Sie sicher, dass Sie alle Statistiken löschen möchten?",
    warnDelCache: "Sind Sie sicher, dass Sie den Modulcache löschen möchten? Die App wird nach dieser Aktion geschlossen und möglicherweise nicht automatisch neu gestartet.",
    warnDelData: "Sind Sie sicher, dass Sie alle Daten löschen möchten, einschließlich Cache, Einstellungen und Module? Die App wird nach dieser Aktion geschlossen und möglicherweise nicht automatisch neu gestartet",
    openDataFolder: "Dateinordner öffnen",
    changeModulesDataLocation: "Den Speicherort der Moduldaten ändern",
    deleteStatistics: "Statistiken löschen",
    deleteModulesCache: "Modulcache löschen",
    deleteAllTheData: "Werkeinstellungen",

    matrixQuiz: {
      header: "Wach auf, {name} ...",
        body: "Sie sind genetisch modifizierter Ukrnazi aus den Labors von Westukraine. Wir alle sind gehirngewaschen und denken gleich. Beantworte Assoziationen (das Erste, was dir in den Sinn kommt), um das zu beweisen.",

      q1: "Was raschelt?",
      q2: "Wer ist putin?",
      q3: "Was ist ausgetrocknet?",

      cancell: "Aufwachen, als wäre nichts passiert",
      submit: "Ab ins Kaninchenloch",
    },
  },

  dashboard: {
    statistics: "Angriffskraft-Statistiken",
	bytes: "Gesendet / Datenverkehr / Insgesamt",
    bytesHint: "Die Statistiken zum gesendeten Datenverkehr können ungenau sein. Dies hängt vom Modul und seiner Funktionsweise ab. Die Gesamtstatistik ist immer präzise und zeigt aggregierte Informationen aus allen laufenden Tools an.",
	moduleStatus: "Modul-Status",
	updates: "KIT Version",
	latest: "Aktuell",
  activeness: {
    score: "Activeness Score",
  },
   itarmyAPIKeyEmpty: "IT Army ID ist nicht angegeben. Es ist nicht kritisch, aber es ist erforderlich, um allgemeine Statistiken anzuzeigen. Sie können sie in den Einstellungen angeben.",
  },

  developers: {
    shieldSubtitle: "Wir sind eine Organisation, die seit dem 25. Februar 2022 tätig ist - dem zweiten Tag der großangelegten Invasion von Moskau in die Ukraine.",
    shieldMore: "Lernen Sie über uns und unsere Operationen:",
    partners: "Kollege und Partner",
    contacts: "Kontakte",
    contactP1: "Für Fragen zur Anwendung, fragen Sie zunächst im IT Army-Chat:",
    contactP1_1: "Oder als letztes Mittel, auf unserem Kanal",
    contactP1_2: "Wenn Sie uns auf dem Kanal schreiben, denken Sie daran, dass wir nur über sehr begrenzte Ressourcen verfügen und möglicherweise nicht antworten können. In der Regel gibt es jedoch Community-Mitglieder, die Ihnen helfen können.",
    contactP2: "Technische Probleme mit der Anwendung - wenn Sie wissen, wie man GitHub verwendet, erstellen Sie bitte issue im Repository.",
    contactP2_1: "Wenn nicht - fragen Sie im IT Army-Chat.",
    contactP3: "Fragen über Module - richten Sie sie an die Modul-Entwickler.",
    contributors: "Contributors",
      contributorsSubtitle: "Helfen Sie dabei, das Programm zu verbessern, und Ihr Name wird automatisch in dieser Liste erscheinen. Die Liste zeigt auch Contributors zur vorherigen Version der Anwendung und einigen Modulen."
  },

  activeness: {
    login: {
      title: "Activeness Login",
      email: "E-Mail",
      password: "Passwort",
      info: "Unglücklicherweise erfordert Activeness zusätzliche Anmeldung zur Verwendung. In Zukunft werden wir versuchen, eine Anmeldung für alle IT Army-Dienste bereitzustellen. Wenn Sie nicht wissen, was Activeness ist, besuchen Sie https://activeness.social/.",
      loginButton: "Einloggen / Registrieren",
      failed: "Anmeldung fehlgeschlagen. Überprüfen Sie Ihre Anmeldeinformationen/Netzwerkverbindung/Activeness-Status und versuchen Sie es erneut.",
    },
    tasksTable: {
      title: "Aufgaben",
      id: "ID",
      what: "Was ist zu tun",
      link: "Link",
      description: "Beschreibung",
      actions: "Aktionen",
      priority: "Diese Aufgabe hat Priorität. Es ist sehr wichtig, sie zuerst zu erledigen",
    },

    logoutButton: "Ausloggen",
    suggesttarget: "Mein Ziel vorschlagen",

    notifyTaskLoadFailed: "Fehler beim Laden der Aufgaben. Fehler: {error}",
    notifyFailedToMakeTaskDone: "Fehler beim Markieren der Aufgabe als erledigt. Fehler: {error}",
    notifyFailedTOIgnoreTask: "Fehler beim Ignorieren der Aufgabe. Fehler: {error}",
  }
}