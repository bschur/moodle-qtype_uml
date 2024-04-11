export function cleanupObject<T extends object>(obj: T, ignoredProperties: string[] = []): T {
  const cleanedObject: T = Array.isArray(obj) ? <T>[] : <T>{}

  for (const [key, value] of Object.entries(obj || {})) {
    if (value !== null && value !== undefined && !ignoredProperties.includes(key)) {
      const parsedKey = key as keyof T
      if (typeof value !== 'object') {
        cleanedObject[parsedKey] = value
      } else if (Array.isArray(value)) {
        const cleanedArray = value.map((val, index) => cleanupObject({ [index]: val }, ignoredProperties)[index])
        if (cleanedArray.length > 0) {
          cleanedObject[parsedKey] = <T[keyof T]>cleanedArray
        }
      } else {
        const cleanedInnerObject = cleanupObject(value, ignoredProperties)
        if (Object.keys(cleanedInnerObject || {}).length > 0) {
          cleanedObject[parsedKey] = cleanedInnerObject
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

export function extractPropertyValueByOccurrence<T extends object>(
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

  const newObject: T = Array.isArray(object) ? <T>[...object] : { ...object }
  for (const [key, value] of Object.entries(newObject)) {
    const parsedKey = key as keyof T
    if (key === nameToMatch) {
      const replacementValue = lookupMap.get(value)
      if (replacementValue) {
        newObject[parsedKey] = lookupMap.get(value) || value
      }
    } else {
      newObject[parsedKey] = replacePropertyWithValue(value, nameToMatch, lookupMap)
    }
  }

  return newObject
}

export function assignValueToObject<T extends object>(existingObject: T, inputString: string, value: T[keyof T]) {
  const parts = inputString.split('.')
  let currentObject = existingObject

  for (const part of parts.slice(0, -1)) {
    const parsedPart = part as keyof T
    currentObject[parsedPart] = <T[keyof T]>(currentObject[parsedPart] || {})
    currentObject = <T>currentObject[parsedPart]
  }

  // Assign the value to the last part in the path
  const parsedPart = parts[parts.length - 1] as keyof T
  currentObject[parsedPart] = value

  return existingObject
}
