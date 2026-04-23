export function mediaQuery<T>(mobileVal: T, desktopVal: T): T {
  return typeof window !== "undefined" && window.innerWidth <= 768 ? mobileVal : desktopVal;
}

export function isMobile(): boolean {
  return typeof window !== "undefined" && window.innerWidth <= 768;
}
