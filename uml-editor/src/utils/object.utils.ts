export function cleanupObject<T>(obj: T, ignoredProperties: string[] = []): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleanedObject: any = {}

  for (const [key, value] of Object.entries(obj || {})) {
    if (value !== null && value !== undefined && !ignoredProperties.includes(key)) {
      if (typeof value !== 'object') {
        cleanedObject[key] = value
      } else if (Array.isArray(value)) {
        const cleanedArray = value.map((val, index) => cleanupObject({ [index]: val }, ignoredProperties)[index])
        if (cleanedArray.length > 0) {
          cleanedObject[key] = cleanedArray
        }
      } else {
        const cleanedInnerObject = cleanupObject(value, ignoredProperties)
        if (Object.keys(cleanedInnerObject || {}).length > 0) {
          cleanedObject[key] = cleanedInnerObject
        }
      }
    }
  }

  return cleanedObject
}

export function extractPropertiesByName(object: unknown, nameToMatch: string): [string, string | number][] {
  if (typeof object !== 'object' || !object) {
    return []
  }

  const returnObject: [string, string | number][] = []
  for (const [key, value] of Object.entries(object)) {
    if (key === nameToMatch && typeof value !== 'object') {
      returnObject.push([key, value])
    } else {
      returnObject.push(...extractPropertiesByName(value, nameToMatch))
    }
  }

  return returnObject
}

export function extractPropertyOccurrences(object: unknown, nameToMatch: string): [string | number, number][] {
  return extractPropertiesByName(object, nameToMatch)
    .reduce<Array<[string | number, number]>>((acc, [, value]) => {
      const result = acc.find(([id]) => id === value)
      if (result) {
        result[1]++
      } else {
        acc.push([value, 1])
      }
      return acc
    }, [])
    .sort((a, b) => b[1] - a[1])
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
