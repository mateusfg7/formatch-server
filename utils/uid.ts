import ShortUniqueId from 'short-unique-id'

export function generateUid(length = 6) {
  const uid = new ShortUniqueId({ length })

  return String(uid()).toLowerCase()
}
