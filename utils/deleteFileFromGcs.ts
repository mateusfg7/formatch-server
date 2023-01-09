import { bucket } from '@lib/gcs'

export async function deleteFileFromGcs(filePathOnGcs: string) {
  const file = bucket.file(filePathOnGcs)

  const deleteResponse = await file.delete()

  return deleteResponse[0]
}
