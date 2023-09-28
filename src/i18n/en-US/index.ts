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
  }
}
