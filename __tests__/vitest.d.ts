import 'vitest'

interface CustomMatchers<R = unknown> {
  toResolveAfterAtLeast(value: number): Promise<R>;
}

declare module 'vitest' {
  interface Matchers<T = any> extends CustomMatchers<T> {}
}
