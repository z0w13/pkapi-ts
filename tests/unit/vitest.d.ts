import 'vitest'

interface CustomMatchers<R = unknown> {
  toResolveInstantly(): Promise<R>;
  toResolveAfterAtLeast(value: number): Promise<R>;
}

declare module 'vitest' {
  interface Matchers<T = any> extends CustomMatchers<T> {}
}
