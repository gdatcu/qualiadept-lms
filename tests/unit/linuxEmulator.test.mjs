import { describe, it, expect } from 'vitest'
import { LinuxSession, verifyLinuxChallenge } from '../../.vitepress/theme/linuxEmulator.mjs'

describe('LinuxSession Emulator', () => {
  it('executes pwd and navigation commands correctly', () => {
    const session = new LinuxSession()
    expect(session.execute('pwd').stdout).toBe('/home/qa-tester')

    session.execute('cd /var/log')
    expect(session.execute('pwd').stdout).toBe('/var/log')

    session.execute('cd ..')
    expect(session.execute('pwd').stdout).toBe('/var')

    session.execute('cd ~')
    expect(session.execute('pwd').stdout).toBe('/home/qa-tester')
  })

  it('handles ls and cat on virtual files', () => {
    const session = new LinuxSession()
    const lsRes = session.execute('ls')
    expect(lsRes.stdout).toContain('readme.txt')

    const catRes = session.execute('cat readme.txt')
    expect(catRes.stdout).toContain('terminalul Linux pentru QA Automation')
  })

  it('supports pipelines: grep | wc -l', () => {
    const session = new LinuxSession()
    const pipeRes = session.execute('cat /var/log/app.log | grep ERROR | wc -l')
    expect(pipeRes.stdout.trim()).toBe('3')
  })

  it('supports file redirection > and >>', () => {
    const session = new LinuxSession()
    session.execute('echo "First line" > /tmp/output.txt')
    expect(session.getFile('/tmp/output.txt').content.trim()).toBe('First line')

    session.execute('echo "Second line" >> /tmp/output.txt')
    expect(session.getFile('/tmp/output.txt').content).toContain('First line\nSecond line')
  })

  it('grades linux challenge correctly with verifyLinuxChallenge', () => {
    const script = 'grep ERROR /var/log/app.log > /tmp/errors.txt'
    const testCases = [
      {
        name: 'Fisierul errors.txt a fost creat in /tmp',
        type: 'file_exists',
        expectedPath: '/tmp/errors.txt'
      },
      {
        name: 'Fisierul contine eroarea de conexiune',
        type: 'file_contains',
        expectedPath: '/tmp/errors.txt',
        expected: 'Connection timeout'
      }
    ]

    const result = verifyLinuxChallenge(script, testCases)
    expect(result.success).toBe(true)
    expect(result.passed_count).toBe(2)
  })
})

