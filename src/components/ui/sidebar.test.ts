import { describe, it, expect, beforeEach } from 'vitest'
import { getInitialOpen } from './sidebar'

const SIDEBAR_COOKIE_NAME = 'sidebar:state'

function clearCookies() {
  for (const cookie of document.cookie.split(';')) {
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
  }
}

beforeEach(() => {
  clearCookies()
})

describe('getInitialOpen', () => {
  it('returns default when cookie is missing', () => {
    expect(getInitialOpen(true)).toBe(true)
    expect(getInitialOpen(false)).toBe(false)
  })

  it('reads boolean from cookie', () => {
    document.cookie = `${SIDEBAR_COOKIE_NAME}=false`
    expect(getInitialOpen(true)).toBe(false)

    document.cookie = `${SIDEBAR_COOKIE_NAME}=true`
    expect(getInitialOpen(false)).toBe(true)
  })

  it('returns default when cookie is invalid', () => {
    document.cookie = `${SIDEBAR_COOKIE_NAME}=invalid`
    expect(getInitialOpen(true)).toBe(true)
  })
})
