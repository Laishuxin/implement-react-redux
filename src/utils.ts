// @ts-nocheck
export const shallowEqual = (o1, o2) => {
  if (o1 === o2) {
    return true
  }

  if (
    typeof o1 !== 'object' ||
    o1 === null ||
    typeof o2 !== 'object' ||
    o2 === null
  ) {
    return false
  }

  const keysO1 = Object.keys(o1)
  if (keysO1.length !== Object.keys(o2).length) {
    return false
  }

  for (const key of keysO1) {
    if (!o2.hasOwnProperty(key) || o1[key] !== o2[key]) {
      return false
    }
  }

  return true
}
