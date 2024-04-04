export type PropertyValueType =
  | string
  | number
  | boolean
  | null
  | undefined
  | PropertyValueType[]
  | { [key: string]: PropertyValueType }

export const cleanupProperty = (
  [key, value]: [string, PropertyValueType],
  ignoredProperties: string[] = []
): [string, PropertyValueType] | [] => {
  if (value === null || value === undefined || ignoredProperties.includes(key)) {
    return []
  }

  // if the value is not an object, we can return the key value pair
  if (typeof value !== 'object') {
    return [key, value]
  }

  // handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return []
    }

    const cleaned = value.map((value, ix) => cleanupProperty([ix.toString(), value], ignoredProperties)[1] || null)
    if (cleaned.length > 0) {
      return [key, cleaned]
    }

    return []
  }

  // otherwise we have an object
  if (Object.keys(value).length === 0) {
    // if the object is empty, we can remove it
    return []
  }

  const cleaned = Object.fromEntries(Object.entries(value).map(entry => cleanupProperty(entry, ignoredProperties)))
  if (Object.keys(cleaned).length > 0) {
    return [key, cleaned]
  }

  return []
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assignValueToObject(existingObject: any, inputString: string, value: any) {
  const parts = inputString.split('.')
  let currentObject = existingObject

  for (const part of parts.slice(0, -1)) {
    currentObject[part] = currentObject[part] || {}
    currentObject = currentObject[part]
  }

  // Assign the value to the last part in the path
  currentObject[parts[parts.length - 1]] = value

  return existingObject
}
