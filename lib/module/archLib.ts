import * as fs from 'fs'
import * as path from 'path'
import * as cp from 'child_process'

export type Architecture = 'x64' | 'arm64' | 'ia32'

let cachedArchitecture: Architecture | undefined = undefined

export function getCPUArchitecture(): Architecture {
    if (cachedArchitecture) {
        return cachedArchitecture
    }

    if (process.arch != 'ia32') {
        return process.arch as Architecture
    }   

    /**
   * On Windows, the most reliable way to detect a 64-bit OS from within a 32-bit
   * app is based on the presence of a WOW64 file: %SystemRoot%\SysNative.
   * See: https://twitter.com/feross/status/776949077208510464
   */
    if (process.platform === 'win32') {
        var useEnv = false
        try {
        useEnv = !!(process.env.SYSTEMROOT && fs.statSync(process.env.SYSTEMROOT))
        } catch (err) {}

        let sysRoot = useEnv ? process.env.SYSTEMROOT : 'C:\\Windows'
        sysRoot = sysRoot || 'C:\\Windows'

        // If %SystemRoot%\SysNative exists, we are in a WOW64 FS Redirected application.
        var isWOW64 = false
        try {
            isWOW64 = !!fs.statSync(path.join(sysRoot, 'sysnative'))
        } catch (err) {}

        cachedArchitecture = isWOW64 ? 'x64' : 'ia32'
        return cachedArchitecture
    }

    /**
     * On Linux, use the `getconf` command to get the architecture.
     */
    if (process.platform === 'linux') {
        var output = cp.execSync('getconf LONG_BIT', { encoding: 'utf8' })
        cachedArchitecture = output === '64\n' ? 'x64' : 'ia32'
        return cachedArchitecture
    }

    /**
     * If none of the above, assume the architecture is 32-bit.
     */
    cachedArchitecture = 'ia32'
    return cachedArchitecture
}