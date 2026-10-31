/**
 * QualiAdept LMS - In-Browser Linux & Bash Shell Emulator
 * Provides a virtual POSIX-like in-memory filesystem and command interpreter
 * designed specifically for QA Automation & Software Testing exercises.
 */

export function createInitialFileSystem() {
  return {
    '/': { type: 'dir', permissions: '755' },
    '/home': { type: 'dir', permissions: '755' },
    '/home/qa-tester': { type: 'dir', permissions: '755' },
    '/home/qa-tester/readme.txt': {
      type: 'file',
      permissions: '644',
      content: 'Bine ai venit în terminalul Linux pentru QA Automation!\nAici poți exersa comenzi de navigare, inspectare log-uri și scripting Bash.\n'
    },
    '/home/qa-tester/test_notes.txt': {
      type: 'file',
      permissions: '644',
      content: 'TODO Sprint 42:\n- Validare endpoint /api/v1/checkout\n- Verificare log-uri Nginx pentru erori 500\n- Rulare suita pytest smoke\n'
    },
    '/var': { type: 'dir', permissions: '755' },
    '/var/log': { type: 'dir', permissions: '755' },
    '/var/log/app.log': {
      type: 'file',
      permissions: '644',
      content: [
        '2026-10-31 10:00:01 INFO [AuthService] User 101 login successful from 192.168.1.50',
        '2026-10-31 10:00:15 INFO [OrderService] Order 5001 created by user 101 status=PENDING',
        '2026-10-31 10:01:02 ERROR [PaymentGateway] Connection timeout to payment provider gateway.stripe.local:443',
        '2026-10-31 10:01:05 WARN [OrderService] Payment retry 1 initiated for order 5001',
        '2026-10-31 10:01:12 ERROR [PaymentGateway] Transaction declined: INSUFFICIENT_FUNDS user=101 code=PAY_ERR_04',
        '2026-10-31 10:02:40 INFO [AuthService] User 102 login successful from 192.168.1.88',
        '2026-10-31 10:03:10 INFO [CartService] Cart 881 items=3 total=450.00 RON',
        '2026-10-31 10:04:22 ERROR [DatabasePool] Deadlock detected in table orders_queue on thread pool worker-3',
        '2026-10-31 10:05:00 INFO [HealthCheck] System health status=UP memory=42% cpu=18%'
      ].join('\n') + '\n'
    },
    '/var/log/nginx_access.log': {
      type: 'file',
      permissions: '644',
      content: [
        '192.168.1.50 - - [31/Oct/2026:10:00:01 +0200] "POST /api/v1/login HTTP/1.1" 200 145',
        '192.168.1.50 - - [31/Oct/2026:10:00:15 +0200] "POST /api/v1/orders HTTP/1.1" 201 320',
        '192.168.1.50 - - [31/Oct/2026:10:01:02 +0200] "POST /api/v1/payments HTTP/1.1" 500 89',
        '192.168.1.88 - - [31/Oct/2026:10:02:40 +0200] "POST /api/v1/login HTTP/1.1" 200 145',
        '192.168.1.88 - - [31/Oct/2026:10:03:10 +0200] "GET /api/v1/cart HTTP/1.1" 200 512',
        '10.0.0.15 - - [31/Oct/2026:10:04:22 +0200] "POST /api/v1/orders HTTP/1.1" 500 102',
        '127.0.0.1 - - [31/Oct/2026:10:05:00 +0200] "GET /health HTTP/1.1" 200 24'
      ].join('\n') + '\n'
    },
    '/app': { type: 'dir', permissions: '755' },
    '/app/users.csv': {
      type: 'file',
      permissions: '644',
      content: [
        'id,username,email,role,status',
        '1,admin_master,admin@qualiadept.ro,admin,active',
        '2,elena_tester,elena@qa.ro,qa_engineer,active',
        '3,dan_dev,dan@dev.ro,developer,active',
        '4,test_guest,guest@temp.ro,viewer,disabled'
      ].join('\n') + '\n'
    },
    '/app/config.json': {
      type: 'file',
      permissions: '644',
      content: JSON.stringify({
        environment: "staging",
        port: 8080,
        debug: true,
        database: {
          host: "db.staging.local",
          port: 5432,
          name: "qa_ecommerce"
        }
      }, null, 2) + '\n'
    },
    '/tmp': { type: 'dir', permissions: '777' },
    '/etc': { type: 'dir', permissions: '755' },
    '/etc/os-release': {
      type: 'file',
      permissions: '644',
      content: 'NAME="Ubuntu"\nVERSION="22.04.4 LTS (Jammy Jellyfish)"\nID=ubuntu\nPRETTY_NAME="Ubuntu 22.04.4 LTS"\n'
    },
    '/etc/hosts': {
      type: 'file',
      permissions: '644',
      content: '127.0.0.1 localhost\n127.0.1.1 qa-runner\n10.0.0.15 api.internal.local\n'
    }
  }
}

export class LinuxSession {
  constructor(initialFs = null) {
    this.fs = initialFs ? JSON.parse(JSON.stringify(initialFs)) : createInitialFileSystem()
    this.cwd = '/home/qa-tester'
    this.homeDir = '/home/qa-tester'
    this.user = 'qa-tester'
    this.hostname = 'linux-sandbox'
    this.lastExitCode = 0
    this.env = {
      USER: 'qa-tester',
      HOME: '/home/qa-tester',
      SHELL: '/bin/bash',
      PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
      TERM: 'xterm-256color',
      LANG: 'en_US.UTF-8'
    }
    this.history = []
  }

  resolvePath(pathStr) {
    if (!pathStr || pathStr === '.') return this.cwd
    if (pathStr === '~' || pathStr.startsWith('~/')) {
      pathStr = this.homeDir + pathStr.slice(1)
    }
    let parts
    if (pathStr.startsWith('/')) {
      parts = pathStr.split('/')
    } else {
      parts = (this.cwd === '/' ? '' : this.cwd).split('/').concat(pathStr.split('/'))
    }
    const stack = []
    for (const part of parts) {
      if (!part || part === '.') continue
      if (part === '..') {
        if (stack.length > 0) stack.pop()
      } else {
        stack.push(part)
      }
    }
    return '/' + stack.join('/')
  }

  getFile(absPath) {
    const node = this.fs[absPath]
    if (node && node.type === 'file') return node
    return null
  }

  getDir(absPath) {
    const node = this.fs[absPath]
    if (node && node.type === 'dir') return node
    return null
  }

  execute(rawScript) {
    if (!rawScript || typeof rawScript !== 'string') {
      return { stdout: '', stderr: '', exitCode: 0 }
    }

    const lines = rawScript
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('#'))

    let lastStdout = ''
    let lastStderr = ''
    let exitCode = 0

    for (const line of lines) {
      this.history.push(line)
      const res = this.executeCompoundCommand(line)
      lastStdout += (lastStdout && res.stdout ? '\n' : '') + res.stdout
      if (res.stderr) {
        lastStderr += (lastStderr ? '\n' : '') + res.stderr
      }
      this.lastExitCode = res.exitCode
      exitCode = res.exitCode
      if (exitCode !== 0 && line.includes('set -e')) {
        break
      }
    }

    return {
      stdout: lastStdout,
      stderr: lastStderr,
      exitCode: exitCode
    }
  }

  executeCompoundCommand(line) {
    // Handle command chaining: ; or && or ||
    const tokens = this.tokenizeCompound(line)
    let currentInput = ''
    let accumulatedStdout = ''
    let accumulatedStderr = ''
    let lastExit = 0

    for (let i = 0; i < tokens.length; i++) {
      const { cmd, op } = tokens[i]
      if (i > 0) {
        const prevOp = tokens[i - 1].op
        if (prevOp === '&&' && lastExit !== 0) continue
        if (prevOp === '||' && lastExit === 0) continue
      }

      const res = this.executePipeline(cmd, currentInput)
      if (res.stdout) {
        accumulatedStdout += (accumulatedStdout ? '\n' : '') + res.stdout
      }
      if (res.stderr) {
        accumulatedStderr += (accumulatedStderr ? '\n' : '') + res.stderr
      }
      lastExit = res.exitCode
      this.lastExitCode = lastExit
    }

    return {
      stdout: accumulatedStdout,
      stderr: accumulatedStderr,
      exitCode: lastExit
    }
  }

  tokenizeCompound(line) {
    const list = []
    const regex = /(&&|\|\||;)/g
    let lastIndex = 0
    let match

    while ((match = regex.exec(line)) !== null) {
      const cmd = line.substring(lastIndex, match.index).trim()
      const op = match[0]
      if (cmd) list.push({ cmd, op })
      lastIndex = match.index + op.length
    }
    const rem = line.substring(lastIndex).trim()
    if (rem) list.push({ cmd: rem, op: null })
    return list
  }

  executePipeline(pipelineStr, initialStdin = '') {
    // Split by | while ignoring inside quotes
    const pipeCommands = this.splitPipes(pipelineStr)
    let pipeStdin = initialStdin
    let lastResult = { stdout: '', stderr: '', exitCode: 0 }

    for (let i = 0; i < pipeCommands.length; i++) {
      const cmdStr = pipeCommands[i].trim()
      lastResult = this.executeSingleCommandWithRedirection(cmdStr, pipeStdin)
      pipeStdin = lastResult.stdout
      if (lastResult.exitCode !== 0 && i < pipeCommands.length - 1) {
        // Pipeline failed early
      }
    }

    return lastResult
  }

  splitPipes(str) {
    const parts = []
    let current = ''
    let inSingle = false
    let inDouble = false

    for (let i = 0; i < str.length; i++) {
      const char = str[i]
      if (char === "'" && !inDouble) {
        inSingle = !inSingle
        current += char
      } else if (char === '"' && !inSingle) {
        inDouble = !inDouble
        current += char
      } else if (char === '|' && !inSingle && !inDouble) {
        if (str[i + 1] === '|') {
          // It's || operator, not pipe! Skip here (already handled)
          current += '||'
          i++
        } else {
          parts.push(current)
          current = ''
        }
      } else {
        current += char
      }
    }
    if (current.trim()) parts.push(current)
    return parts
  }

  executeSingleCommandWithRedirection(cmdStr, stdinText = '') {
    // Check for > (overwrite) or >> (append)
    let redirectFile = null
    let append = false
    let cleanCmd = cmdStr

    const appendMatch = cmdStr.match(/^(.*?)\s*>>\s*([^>|]+)$/)
    const overwriteMatch = cmdStr.match(/^(.*?)\s*>\s*([^>|]+)$/)

    if (appendMatch) {
      cleanCmd = appendMatch[1].trim()
      redirectFile = appendMatch[2].trim()
      append = true
    } else if (overwriteMatch) {
      cleanCmd = overwriteMatch[1].trim()
      redirectFile = overwriteMatch[2].trim()
      append = false
    }

    const args = this.parseArgs(cleanCmd)
    if (args.length === 0) {
      return { stdout: '', stderr: '', exitCode: 0 }
    }

    const res = this.dispatchCommand(args, stdinText)

    if (redirectFile) {
      const absPath = this.resolvePath(redirectFile)
      const existing = this.getFile(absPath)
      if (append && existing) {
        existing.content += res.stdout + '\n'
      } else {
        this.fs[absPath] = {
          type: 'file',
          permissions: '644',
          content: res.stdout + '\n'
        }
      }
      return { stdout: '', stderr: res.stderr, exitCode: res.exitCode }
    }

    return res
  }

  parseArgs(cmdStr) {
    const args = []
    let current = ''
    let inSingle = false
    let inDouble = false

    for (let i = 0; i < cmdStr.length; i++) {
      const char = cmdStr[i]
      if (char === "'" && !inDouble) {
        inSingle = !inSingle
      } else if (char === '"' && !inSingle) {
        inDouble = !inDouble
      } else if (char === ' ' && !inSingle && !inDouble) {
        if (current.length > 0) {
          args.push(this.expandEnvVars(current))
          current = ''
        }
      } else {
        current += char
      }
    }
    if (current.length > 0) {
      args.push(this.expandEnvVars(current))
    }
    return args
  }

  expandEnvVars(token) {
    if (token === '$?') return String(this.lastExitCode)
    if (token.startsWith('$')) {
      const varName = token.slice(1)
      if (this.env[varName] !== undefined) return this.env[varName]
    }
    return token
  }

  dispatchCommand(args, stdinText) {
    const cmd = args[0]
    const rest = args.slice(1)

    switch (cmd) {
      case 'pwd':
        return { stdout: this.cwd, stderr: '', exitCode: 0 }

      case 'cd': {
        const target = rest[0] || '~'
        const resolved = this.resolvePath(target)
        if (this.getDir(resolved)) {
          this.cwd = resolved
          return { stdout: '', stderr: '', exitCode: 0 }
        } else if (this.getFile(resolved)) {
          return { stdout: '', stderr: `bash: cd: ${target}: Not a directory`, exitCode: 1 }
        }
        return { stdout: '', stderr: `bash: cd: ${target}: No such file or directory`, exitCode: 1 }
      }

      case 'ls': {
        const showAll = rest.some(a => a.includes('a'))
        const longListing = rest.some(a => a.includes('l'))
        const targetPath = rest.find(a => !a.startsWith('-')) || '.'
        const resolved = this.resolvePath(targetPath)

        if (this.getFile(resolved)) {
          return { stdout: targetPath, stderr: '', exitCode: 0 }
        }
        if (!this.getDir(resolved)) {
          return { stdout: '', stderr: `ls: cannot access '${targetPath}': No such file or directory`, exitCode: 2 }
        }

        const entries = []
        const prefix = resolved === '/' ? '/' : resolved + '/'
        for (const [p, node] of Object.entries(this.fs)) {
          if (p === resolved) continue
          if (p.startsWith(prefix)) {
            const rel = p.slice(prefix.length)
            if (!rel.includes('/')) {
              if (rel.startsWith('.') && !showAll) continue
              entries.push({ name: rel, node })
            }
          }
        }
        entries.sort((a, b) => a.name.localeCompare(b.name))

        if (longListing) {
          const lines = entries.map(e => {
            const typeChar = e.node.type === 'dir' ? 'd' : '-'
            const perms = typeChar + (e.node.permissions || 'rwxr-xr-x')
            const size = e.node.content ? e.node.content.length : 4096
            return `${perms} 1 ${this.user} ${this.user} ${size.toString().padStart(5, ' ')} Oct 31 10:00 ${e.name}`
          })
          return { stdout: lines.join('\n'), stderr: '', exitCode: 0 }
        }

        return { stdout: entries.map(e => e.name).join('  '), stderr: '', exitCode: 0 }
      }

      case 'cat': {
        if (rest.length === 0) {
          return { stdout: stdinText, stderr: '', exitCode: 0 }
        }
        let out = ''
        for (const f of rest) {
          const p = this.resolvePath(f)
          const file = this.getFile(p)
          if (!file) {
            return { stdout: '', stderr: `cat: ${f}: No such file or directory`, exitCode: 1 }
          }
          out += file.content
        }
        return { stdout: out.replace(/\n$/, ''), stderr: '', exitCode: 0 }
      }

      case 'head': {
        let count = 10
        let filePath = null
        for (let i = 0; i < rest.length; i++) {
          if (rest[i] === '-n' && rest[i + 1]) {
            count = parseInt(rest[i + 1], 10) || 10
            i++
          } else if (!rest[i].startsWith('-')) {
            filePath = rest[i]
          }
        }
        let content = stdinText
        if (filePath) {
          const p = this.resolvePath(filePath)
          const f = this.getFile(p)
          if (!f) return { stdout: '', stderr: `head: cannot open '${filePath}': No such file or directory`, exitCode: 1 }
          content = f.content
        }
        const lines = content.split('\n')
        return { stdout: lines.slice(0, count).join('\n').replace(/\n$/, ''), stderr: '', exitCode: 0 }
      }

      case 'tail': {
        let count = 10
        let filePath = null
        for (let i = 0; i < rest.length; i++) {
          if (rest[i] === '-n' && rest[i + 1]) {
            count = parseInt(rest[i + 1], 10) || 10
            i++
          } else if (!rest[i].startsWith('-')) {
            filePath = rest[i]
          }
        }
        let content = stdinText
        if (filePath) {
          const p = this.resolvePath(filePath)
          const f = this.getFile(p)
          if (!f) return { stdout: '', stderr: `tail: cannot open '${filePath}': No such file or directory`, exitCode: 1 }
          content = f.content
        }
        const lines = content.trimEnd().split('\n')
        return { stdout: lines.slice(Math.max(0, lines.length - count)).join('\n'), stderr: '', exitCode: 0 }
      }

      case 'echo':
        return { stdout: rest.join(' '), stderr: '', exitCode: 0 }

      case 'mkdir': {
        const target = rest.find(a => !a.startsWith('-'))
        if (!target) return { stdout: '', stderr: 'mkdir: missing operand', exitCode: 1 }
        const resolved = this.resolvePath(target)
        this.fs[resolved] = { type: 'dir', permissions: '755' }
        return { stdout: '', stderr: '', exitCode: 0 }
      }

      case 'touch': {
        for (const file of rest) {
          const resolved = this.resolvePath(file)
          if (!this.fs[resolved]) {
            this.fs[resolved] = { type: 'file', permissions: '644', content: '' }
          }
        }
        return { stdout: '', stderr: '', exitCode: 0 }
      }

      case 'rm': {
        for (const file of rest.filter(a => !a.startsWith('-'))) {
          const resolved = this.resolvePath(file)
          delete this.fs[resolved]
        }
        return { stdout: '', stderr: '', exitCode: 0 }
      }

      case 'cp': {
        const nonFlags = rest.filter(a => !a.startsWith('-'))
        if (nonFlags.length < 2) return { stdout: '', stderr: 'cp: missing file operand', exitCode: 1 }
        const src = this.resolvePath(nonFlags[0])
        const dest = this.resolvePath(nonFlags[1])
        const srcFile = this.getFile(src)
        if (!srcFile) return { stdout: '', stderr: `cp: cannot stat '${nonFlags[0]}': No such file`, exitCode: 1 }
        this.fs[dest] = { ...srcFile }
        return { stdout: '', stderr: '', exitCode: 0 }
      }

      case 'mv': {
        const nonFlags = rest.filter(a => !a.startsWith('-'))
        if (nonFlags.length < 2) return { stdout: '', stderr: 'mv: missing file operand', exitCode: 1 }
        const src = this.resolvePath(nonFlags[0])
        const dest = this.resolvePath(nonFlags[1])
        const srcNode = this.fs[src]
        if (!srcNode) return { stdout: '', stderr: `mv: cannot stat '${nonFlags[0]}': No such file`, exitCode: 1 }
        this.fs[dest] = srcNode
        delete this.fs[src]
        return { stdout: '', stderr: '', exitCode: 0 }
      }

      case 'grep': {
        let caseInsensitive = rest.includes('-i')
        let invert = rest.includes('-v')
        let countOnly = rest.includes('-c')
        let lineNumbers = rest.includes('-n')
        const nonFlags = rest.filter(a => !a.startsWith('-'))

        if (nonFlags.length === 0) return { stdout: '', stderr: 'grep: missing pattern', exitCode: 2 }
        const patternStr = nonFlags[0]
        const filePath = nonFlags[1]

        let text = stdinText
        if (filePath) {
          const p = this.resolvePath(filePath)
          const f = this.getFile(p)
          if (!f) return { stdout: '', stderr: `grep: ${filePath}: No such file or directory`, exitCode: 2 }
          text = f.content
        }

        const lines = text.trimEnd().split('\n')
        const regex = new RegExp(patternStr, caseInsensitive ? 'i' : '')
        const matched = []

        lines.forEach((line, idx) => {
          const matches = regex.test(line)
          if ((matches && !invert) || (!matches && invert)) {
            matched.push(lineNumbers ? `${idx + 1}:${line}` : line)
          }
        })

        if (countOnly) {
          return { stdout: String(matched.length), stderr: '', exitCode: matched.length > 0 ? 0 : 1 }
        }

        return {
          stdout: matched.join('\n'),
          stderr: '',
          exitCode: matched.length > 0 ? 0 : 1
        }
      }

      case 'wc': {
        const countLines = rest.includes('-l')
        const nonFlags = rest.filter(a => !a.startsWith('-'))
        let text = stdinText
        if (nonFlags[0]) {
          const p = this.resolvePath(nonFlags[0])
          const f = this.getFile(p)
          if (!f) return { stdout: '', stderr: `wc: ${nonFlags[0]}: No such file or directory`, exitCode: 1 }
          text = f.content
        }
        const linesCount = text.trim() ? text.trimEnd().split('\n').length : 0
        const wordsCount = text.trim() ? text.trim().split(/\s+/).length : 0
        const charsCount = text.length

        if (countLines) {
          return { stdout: String(linesCount), stderr: '', exitCode: 0 }
        }
        return { stdout: `  ${linesCount}  ${wordsCount} ${charsCount}`, stderr: '', exitCode: 0 }
      }

      case 'sort': {
        const reverse = rest.includes('-r')
        const unique = rest.includes('-u')
        const numeric = rest.includes('-n')
        const nonFlags = rest.filter(a => !a.startsWith('-'))
        let text = stdinText
        if (nonFlags[0]) {
          const p = this.resolvePath(nonFlags[0])
          const f = this.getFile(p)
          if (!f) return { stdout: '', stderr: `sort: ${nonFlags[0]}: No such file`, exitCode: 2 }
          text = f.content
        }
        let lines = text.trimEnd().split('\n').filter(Boolean)
        if (unique) {
          lines = Array.from(new Set(lines))
        }
        lines.sort((a, b) => {
          if (numeric) {
            const na = parseFloat(a) || 0
            const nb = parseFloat(b) || 0
            return na - nb
          }
          return a.localeCompare(b)
        })
        if (reverse) lines.reverse()
        return { stdout: lines.join('\n'), stderr: '', exitCode: 0 }
      }

      case 'uniq': {
        const withCount = rest.includes('-c')
        const lines = (stdinText || '').trimEnd().split('\n').filter(Boolean)
        const result = []
        let current = null
        let count = 0

        for (const line of lines) {
          if (line === current) {
            count++
          } else {
            if (current !== null) {
              result.push(withCount ? `      ${count} ${current}` : current)
            }
            current = line
            count = 1
          }
        }
        if (current !== null) {
          result.push(withCount ? `      ${count} ${current}` : current)
        }
        return { stdout: result.join('\n'), stderr: '', exitCode: 0 }
      }

      case 'whoami':
        return { stdout: this.user, stderr: '', exitCode: 0 }

      case 'uname':
        return { stdout: 'Linux qa-sandbox 6.5.0-42-generic #42-Ubuntu SMP x86_64 GNU/Linux', stderr: '', exitCode: 0 }

      case 'chmod': {
        const nonFlags = rest.filter(a => !a.startsWith('-'))
        if (nonFlags.length < 2) return { stdout: '', stderr: 'chmod: missing operand', exitCode: 1 }
        const mode = nonFlags[0]
        const file = this.resolvePath(nonFlags[1])
        if (this.fs[file]) {
          this.fs[file].permissions = mode
          return { stdout: '', stderr: '', exitCode: 0 }
        }
        return { stdout: '', stderr: `chmod: cannot access '${nonFlags[1]}': No such file or directory`, exitCode: 1 }
      }

      case 'ps':
        return {
          stdout: [
            'USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND',
            'root           1  0.0  0.1 168924 11488 ?        Ss   09:00   0:02 /sbin/init',
            'qa-tester    542  0.1  0.5 892300 45210 ?        Ssl  09:15   0:05 python3 -m app.server --port 8080',
            'qa-tester   1024  0.0  0.2  18450  4120 pts/0    Ss   10:00   0:00 /bin/bash',
            'qa-tester   1105  0.0  0.1  14200  2100 pts/0    R+   10:05   0:00 ps aux'
          ].join('\n'),
          stderr: '',
          exitCode: 0
        }

      case 'curl': {
        const url = rest.find(a => !a.startsWith('-')) || ''
        if (url.includes('/health')) {
          return { stdout: '{"status": "UP", "version": "1.4.2"}', stderr: '', exitCode: 0 }
        }
        if (url.includes('/api/v1/orders')) {
          return { stdout: '{"orders": [{"id": 5001, "status": "PENDING"}]}', stderr: '', exitCode: 0 }
        }
        return { stdout: `HTTP/1.1 200 OK\nContent-Type: text/plain\n\nOK from ${url}`, stderr: '', exitCode: 0 }
      }

      case 'env':
        return {
          stdout: Object.entries(this.env).map(([k, v]) => `${k}=${v}`).join('\n'),
          stderr: '',
          exitCode: 0
        }

      case 'export': {
        if (rest[0] && rest[0].includes('=')) {
          const [k, ...v] = rest[0].split('=')
          this.env[k.trim()] = v.join('=').trim()
        }
        return { stdout: '', stderr: '', exitCode: 0 }
      }

      default:
        return { stdout: '', stderr: `bash: ${cmd}: command not found`, exitCode: 127 }
    }
  }
}

/**
 * Challenge verifier for Linux shell tasks
 */
export function verifyLinuxChallenge(userScript, testCases = []) {
  const session = new LinuxSession()
  const execResult = session.execute(userScript)

  const tests = []
  let passedCount = 0

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i]
    let passed = true
    let actualValue = null
    let error = null

    try {
      if (tc.type === 'stdout_contains') {
        actualValue = execResult.stdout
        passed = execResult.stdout.includes(tc.expected)
      } else if (tc.type === 'stdout_regex') {
        actualValue = execResult.stdout
        passed = new RegExp(tc.expected).test(execResult.stdout)
      } else if (tc.type === 'stdout_exact') {
        actualValue = execResult.stdout.trim()
        passed = actualValue === String(tc.expected).trim()
      } else if (tc.type === 'file_exists') {
        const targetPath = session.resolvePath(tc.expectedPath)
        const fileNode = session.fs[targetPath]
        passed = Boolean(fileNode)
        actualValue = passed ? 'Exists' : 'Missing'
      } else if (tc.type === 'file_contains') {
        const targetPath = session.resolvePath(tc.expectedPath)
        const fileNode = session.getFile(targetPath)
        if (!fileNode) {
          passed = false
          actualValue = 'File missing'
        } else {
          actualValue = fileNode.content
          passed = fileNode.content.includes(tc.expected)
        }
      } else if (tc.type === 'exit_code') {
        actualValue = execResult.exitCode
        passed = execResult.exitCode === tc.expected
      }
    } catch (err) {
      passed = false
      error = err.message
    }

    if (passed) passedCount++

    tests.push({
      id: i + 1,
      name: tc.name,
      passed,
      expected: tc.expected !== undefined ? tc.expected : tc.expectedPath,
      actual: actualValue,
      error
    })
  }

  return {
    success: tests.length > 0 && passedCount === tests.length,
    passed_count: passedCount,
    total_count: tests.length,
    stdout: execResult.stdout,
    stderr: execResult.stderr,
    exitCode: execResult.exitCode,
    tests
  }
}

