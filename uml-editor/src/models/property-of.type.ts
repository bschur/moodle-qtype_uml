export type PropsOfType<T> = {
  [K in keyof T]: T[K]
}
