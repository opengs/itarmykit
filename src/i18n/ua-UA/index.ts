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
    active: {
      selected: "Виьбраний модуль для запуску",
      enabled: {
        title: "Модуль включений",
        caption: "Включити або відключити виконання модуля"
      },
      executionLog: "Журнал виконання",
      stdout: "Стандартний вивід (stdout)",
      stderr: "Стандартний вивід помилок (stderr)",
    }
  },
  top: {
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
  }
}
