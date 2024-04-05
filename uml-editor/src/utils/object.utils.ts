export function cleanupObject<T extends object>(obj: T, ignoredProperties: string[] = []): T {
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

export function extractPropertiesByName<T extends object>(
  object: T,
  nameToMatch: string,
  parentPath: string = ''
): [string, string, string | number][] {
  if (typeof object !== 'object' || !object) {
    return []
  }

  const returnObject: [string, string, string | number][] = []
  const forceOnlyParentPath = Array.isArray(object)
  for (const [key, value] of Object.entries(object)) {
    if (key === nameToMatch && typeof value !== 'object') {
      returnObject.push([key, parentPath, value])
    } else {
      returnObject.push(
        ...extractPropertiesByName(
          value,
          nameToMatch,
          forceOnlyParentPath ? parentPath : `${parentPath}${parentPath ? '.' : ''}${key}`
        )
      )
    }
  }

  return returnObject
}

export function extractPropertyWithPathOccurrences<T extends object>(
  object: T,
  nameToMatch: string
): [string | number, string, number][] {
  return extractPropertiesByName(object, nameToMatch)
    .reduce<Array<[string | number, string, number]>>((acc, [, key, value]) => {
      const result = acc.find(([id, path]) => id === value && path === key)
      if (result) {
        result[2]++
      } else {
        acc.push([value, key, 1])
      }
      return acc
    }, [])
    .sort((a, b) => b[2] - a[2])
}

export function replacePropertyWithValue<T extends object>(
  object: T,
  nameToMatch: string,
  lookupMap: Map<unknown, unknown>
): T {
  if (typeof object !== 'object' || !object) {
    return object
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newObject: any = { ...object }
  for (const [key, value] of Object.entries(newObject)) {
    if (key === nameToMatch) {
      const replacementValue = lookupMap.get(value)
      if (replacementValue) {
        newObject[key] = lookupMap.get(value) || value
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      newObject[key] = replacePropertyWithValue(<any>value, nameToMatch, lookupMap)
    }
  }

  return newObject
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
