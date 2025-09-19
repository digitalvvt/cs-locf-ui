import * as React from "react"

const MOBILE_BREAKPOINT = 1240

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange)
    } else {
      // Safari <14 uses addListener/removeListener
      // eslint-disable-next-line deprecation/deprecation
      mql.addListener(onChange)
    }
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange)
      } else {
        // eslint-disable-next-line deprecation/deprecation
        mql.removeListener(onChange)
      }
    }
  }, [])

  return !!isMobile
}
