// Fix: Node.js 22+ exposes a broken global `localStorage` (Web Storage API)
// that requires --localstorage-file flag. Libraries like Clerk check for its
// existence and assume they're in a browser, causing SSR crashes.
export async function register() {
  if (typeof window === "undefined" && typeof globalThis.localStorage !== "undefined") {
    // @ts-expect-error -- intentionally removing broken Node.js localStorage
    globalThis.localStorage = undefined;
  }
}
