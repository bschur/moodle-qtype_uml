export interface JointJSElementType {
    type: string
}

export type CustomElementAttributes<T> = JointJSElementType & Partial<T>