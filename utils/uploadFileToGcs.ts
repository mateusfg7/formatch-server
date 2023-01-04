import { bucket } from '../lib/gcs'

export async function uploadFileToGCS(pathString: string, destination: string) {
  const file = await bucket.upload(pathString, { destination })

  const fileUrl = `https://storage.googleapis.com/assets-bucket_formatch/${file[0].metadata.name}`

  return fileUrl
}
