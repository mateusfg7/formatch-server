import { Storage } from '@google-cloud/storage'

const storage =
  process.env.NODE_ENV === 'production'
    ? new Storage({
        projectId: process.env.PROJECT_ID,
        credentials: {
          client_email: process.env.CLIENT_EMAIL,
          private_key: process.env.PRIVATE_KEY,
        },
      })
    : new Storage()

const bucket = storage.bucket(process.env.BUCKET_NAME as string)

export { storage, bucket }
