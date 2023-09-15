import { DB1000N } from 'app/lib/module/db1000n'
import { Distress } from 'app/lib/module/distress'
import { MHDDOSProxy } from 'app/lib/module/mhddosproxy'
import { handleModules } from './modules'
import { handleExecutionEngine } from './engine'
import { handleTop } from './top'

export function handle () {
  const modules = [
    new Distress(),
    new MHDDOSProxy(),
    new DB1000N()
  ]

  handleModules(modules)
  handleExecutionEngine(modules)
  handleTop()
}
