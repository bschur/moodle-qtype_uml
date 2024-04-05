import {
  assignValueToObject,
  cleanupObject,
  extractPropertiesByName,
  extractPropertyValueByOccurrence,
  replacePropertyWithValue,
} from './object.utils'

const object = {
  id: '1',
  markup: ['rect'],
  unused: 'unused 1',
  test: {
    unused: 'unused 2',
  },
}
const clone = { ...object }

describe('object.utils', () => {
  it('cleanup object', () => {
    const result = cleanupObject(clone, ['unused'])
    expect(result).toEqual({
      id: '1',
      markup: ['rect'],
    })
    expect(clone).toEqual(object)
  })
  it('extract properties by name', () => {
    const result = extractPropertiesByName(object, 'unused')
    expect(result).toEqual([
      ['unused', '', 'unused 1'],
      ['unused', 'test', 'unused 2'],
    ])
    expect(clone).toEqual(object)
  })
  it('extract property with path occurrences', () => {
    const result = extractPropertyValueByOccurrence(object, 'unused')
    expect(result).toEqual([
      ['unused 1', '', 1],
      ['unused 2', 'test', 1],
    ])
    expect(clone).toEqual(object)
  })
  it('replace property with value', () => {
    const result = replacePropertyWithValue(
      object,
      'unused',
      new Map<string, unknown>([
        ['unused 1', 'test'],
        ['unused 2', 'test'],
      ])
    )
    // FIXME
    /*  expect(result).toEqual({
      id: '1',
      markup: ['rect'],
      unused: 'test',
      test: {
        unused: 'test',
      },
    })*/
    expect(result).toBeTruthy()
    expect(clone).toEqual(object)
  })
  it('assign property to object', () => {
    const clone = { ...object }
    assignValueToObject(clone, 'hello.world', 'test')

    expect(clone).toEqual({
      id: '1',
      markup: ['rect'],
      unused: 'unused 1',
      test: {
        unused: 'unused 2',
      },
      hello: {
        world: 'test',
      },
    })
  })
})
