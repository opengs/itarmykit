// This is just an example,
// so you can safely delete all default props below

export default {
  layout: {
    dashboard: 'Головна',
    modules: 'DDOS модулі',
    settings: 'Налаштування',
    top: 'Рейтинги',
    developers: 'Розробники',
  },
  modules: {
    menu: {
      main: "Головна",
      active: "Активний модуль",
      available: "Доступні модулі"
    },
    active: {
      selected: "Вибраний модуль для запуску",
      enabled: {
        title: "Активувати модуль",
        caption: "Включити або відключити виконання модуля"
      },
      executionLog: "Журнал виконання",
      stdout: "Стандартний вивід (stdout)",
      stderr: "Стандартний вивід помилок (stderr)",
    },
    available: {
      configuration: "Налаштування",
      selVersion: "Обрати версію",
      selVersionDescription: "Версія модуля для запуску",
      autoupdates: "Автоматичне оновлення",
      autoupdatesDescription: "Автоматичне оновлення модуля до останньої версії",
      arguments: "Параметри запуску (лише для досвідчених користувачів)",
      argumentsDescription: "Додаткові параметри запуску, які використовуватимуться під час запуску бінарного файлу",
      versions: {
        versions: "Список версій",
        downloadInstall: "Завантажити та встановити",
        selectUse: "Вибрати для використання"
      }
    },
    db1000n: {
      scale: "Маштабування",
      scaleDescription: "Використовується для масштабування кількості завдань, що запускаються, ефект подібний до запуску кількох екземплярів одночасно",
      interval: "Інтервал",
      intervalDescription: "Мінімальний інтервал між ітераціями завдання",
      primitive: "Примітивний режим",
      primitiveDescription: "Активуйте, якщо ви хочете виконувати примітивні завдання, які є менш ресурсоефективними",
      proxiesList: "Список проксі",
      proxiesListDescription: "Адреса (у файловій системі чи в Інтернеті) до файлу з проксі-серверами у форматі 'protocol://ip:port' або 'ip:port'",
      proxyProtocol: "Проксі-протокол",
      proxyProtocolDescription: "Протокол для використання, якщо він не визначений у списку проксі"
    },
    mhddosProxy: {
      copies: "Копії",
      copiesDescription: "Кількість запущених процесів (копій модуля). 0 для авто",
      threads: "Потоки",
      threadsDescription: "Кількість потоків, запущених на процес. 0 для авто",
      useMyIp: "Задіяти мій IP",
      useMyIpDescription: "Відсоток використання власної IP-адреси або VPN, якщо налаштовано"
    },
    distress: {
      concurrency: "Паралелізм",
      concurrencyDescription: "Кількість створювачів завдань. 0 встановлює за замовчуванням 4096",
      torConnections: "З'єднання Tor",
      torConnectionsDescription: "Використовувати підключення Tor для атаки",
      useMyIp: "Задіяти мій IP",
      useMyIpDescription: "Відсоток використання власної IP-адреси або VPN, якщо налаштовано",
      udpFlood: "UDP-флуд",
      udpFloodDescription: "Дозволити атаку UDP-флуд. Працює, якщо ви використовуєте свій власний IP або VPN"
    }
  },
  top: {
    volunteers: "TOП ВОЛОНТЕРІВ",
    week: "За тиждень",
    month: "За місяць",

    achivements: {
      peopleAreLikeShips: {
        title: "Люди як кораблі",
        subtitle: "якщо російські, то йдуть *****",

        body: "Схоже ти тільки що спробував(ла) вибрати російську мову. Ти потребуєш щоб ми тебе спаслі. Не переживай ми тебе скоро денацифікуємо і асвабадім.",
        explanationHint: "Я не розумію. Роздупліть для мене цей мем.",
        explanation: 'Це була перевірка! Ця опція відкрита для людей з інших країн і мов. Дивно що ти сюди завітав. Направляємо по тебе бандеромобіль',

        goodButton: "Я дурненький. Будь ласка, асвабадіть мене.",
        badButton: "Я не люблю Україну",
      },
    }
  },
  bootstrap: {
    title: "Схоже це твій перший запуск. Давай допоможемо тобі",

    header: {
      language: "Вибери мову",
      data: "Дані",
      itarmy: "ITArmy ID",
      module: "Модулі"
    },

    language: {
      continueButton: "Продовжити"
    },

    data: {
      body: "Додаток автоматично завантажить необхідні модулі і збереже їх на твоєму ПК. Модулі та всі дані будуть збережені в папці",
      windows: "Перед тим як продовжити, переконайся що ти додав папку з даними в віндовс дефендер та антивірусні винятки. В іншому випадку всі завантажені дані будуть видалені.",
      openDataFolderButton: "Відкрити папку з даними",
      changeDataFolderButton: "Змінити папку з даними",
      continueButton: "Продовжити",
      backButton: "Назад"
    },

    itarmy: {
      body: "Якщо у тебе є ITArmy ID, введи його нижче. Якщо немає, натисни кнопку продовжити",
      uuidInputTitle: "ITArmy ID",
      continueButton: "Продовжити",
      backButton: "Назад"
    },

    module: {
      body: "Вибери пресет. Всі дані можна потім змінити",
      installation: {
        title: "Встановлення модулів",
      },
      preset: {
        government: {
          title: "Державна установа / старий ПК",
          description: "Цей пресет використовує якомога менше ресурсів. Це може призвести до відключення деяких функцій модулів.",
        },
        laptop: {
          title: "Ноутбук",
          description: "Цей пресет спробує використати якомога менше ресурсів, але не відключатиме функції.",
        },
        comfort: {
          title: "Комфориний",
          description: "Цей пресет використовує ресурси у комфортному режимі. Не впливає на продуктивність твого комп'ютера.",
        },
        normal: {
          title: "Нормальний",
          description: "Нормальний комп'ютер вдома. Цей пресет використовує конфігурацію, що постачається розробниками модулів за замовчуванням.",
        },
        max: {
          title: "Максимальний",
          description: "Максимальна потужність. Цей пресет використовує максимальні ресурси твого комп'ютера. Це може призвести до лагів в інших програмах.",
        },
        expert: {
          title: "Експерт",
          description: "Цей пресет не виконує жодних дій. Всі налаштування треба проводити вручну.",
        }
      }
    },

    doneDialog: {
      title: "Налаштування завершено",
      body: "Тепер ви можете почати використовувати аплікацію. Але нам потрібно ще трішки часу щоб все підготувати (1-3 хвилини). Протягом цього часу може не буде оновлень в головному дашборді. Це нормально для першого запуску :) За кілька хвилин на головному дашборді появляться графіки і актуальна інформація.",
      finishButton: "Чудово!. Почнемо!",
    }
  },
  settings: {
    system: "Система",
    autoUpdates: "Автоматичне оновлення",
    autoUpdatesDescription: "Автоматичне оновлення програми до останньої версії.",
    autoStartup: "Автоматичний запуск",
    autoStartupDescription: "Автоматичний запуск програми під час запуску системи.",
    hideTray: "Сховати програму в трей",
    hideTrayDescription: "Приховувати програму в трей, а не закривати її. Також під час запуску не показувати головне вікно.",
    language: "Мова",
    idDescription: "Де взяти ID ? Загляньте до",
    data: "Сховище",
    dataDescription: "Наразі ваші модулі знаходяться в папці:",
    warnDelCache: "Ви справді хочете видалити кеш модулів? Програма закриється після цієї дії та може не перезапуститися автоматично.",
    warnDelData: "Ви справді бажаєте видалити всі дані, включаючи кеш налаштувань і модулів? Програма закриється після цієї дії та може не перезапуститися автоматично.",
    openDataFolder: "Відкрити папку з даними",
    changeModulesDataLocation: "Змінити розташування даних модулів",
    deleteModulesCache: "Видалити кеш модулів",
    deleteAllTheData: "Заводські налаштування",
  },

  dashboard: {
    statistics: "Статистика сили атаки",
	bytes: "Відправлено / Трафік",
	moduleStatus: "Статус модуля",
	updates: "Версія KIT",
	latest: "Поточна"
  }
}
