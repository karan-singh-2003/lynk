// utils/parse-user-agent.ts
import { UAParser } from 'ua-parser-js'

export const parseUserAgent = (userAgent: string) => {
  const parser = new UAParser(userAgent)
  const result = parser.getResult()

  return {
    device: result.device.type === 'mobile' ? 'mobile' : 'desktop',
    browser: result.browser.name || 'Unknown',
    os: result.os.name || 'Unknown',
  }
}
