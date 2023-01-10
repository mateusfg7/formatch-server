import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { File } from 'formidable'

import { prismaClient } from '@lib/prisma'
import { getUserFromCookies } from '@lib/getUserFromCookies'
import { uploadFileToGCS } from '@utils/uploadFileToGcs'
import { form } from '@utils/form'
import { generateUid } from '@utils/uid'

export async function createProfessional(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    form.parse(req, async (err, rawFields, files) => {
      if (err) {
        console.error(err)
        return res
          .status(500)
          .json({ error: err, message: 'Internal server error' })
      }

      const fieldsSchema = z.object({
        name: z.string(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        state_uf: z.string(),
        city: z.string(),
        biography: z.string(),
        whatsapp: z.string().optional(),
        instagram: z.string().optional(),
        services: z.string(),
      })
      const parsedFields = fieldsSchema.safeParse(rawFields)

      if (!parsedFields.success)
        return res.status(400).json({ error: parsedFields.error.issues })

      const {
        name,
        email,
        phone,
        state_uf,
        city,
        biography,
        whatsapp,
        instagram,
        services,
      } = {
        ...parsedFields.data,
        services: (rawFields.services as string).split(','),
      }

      if (!email && !phone && !whatsapp && !instagram) {
        return res.status(400).json({
          message:
            'You need to have at least one way of contact: email, phone, whatsapp or instagram.',
        })
      }

      const file = files.profile_picture_file as File

      if (!file) {
        return res
          .status(400)
          .json({ message: 'File was not sent or parameter is invalid.' })
      }

      const user = getUserFromCookies(req)

      try {
        const registeredProfessional = await prismaClient.professional.findMany(
          {
            where: {
              User: {
                email: user.email,
              },
            },
          }
        )

        if (registeredProfessional.length > 0) {
          return res
            .status(409)
            .json({ message: 'User already registered as a professional.' })
        }
      } catch (err) {
        console.error(err)
        return res
          .status(500)
          .json({ error: err, message: 'Internal server error' })
      }

      const parsedProfessionalName = name.toLowerCase().replaceAll(' ', '-')
      const parsedFileType = file.mimetype?.split('/')[1]
      const newFileName = `${generateUid()}_${parsedProfessionalName}.${parsedFileType}`

      const localFilePath = file.filepath
      const gcsFilePath = `assets/profile-picture/${newFileName}`

      try {
        const fileUrlOnGCS = await uploadFileToGCS(localFilePath, gcsFilePath)
        const code = generateUid()

        const professional = await prismaClient.professional.create({
          data: {
            name,
            code,
            email,
            phone,
            state_uf,
            city,
            biography,
            whatsapp,
            instagram,
            profile_picture_url: fileUrlOnGCS,
            profile_picture_gcs_path: gcsFilePath,
            User: {
              connect: {
                email: user.email,
              },
            },
            services: {
              connectOrCreate: services.map((service) => ({
                where: { service_name: service.trim() },
                create: { service_name: service.trim() },
              })),
            },
          },
          include: {
            services: true,
          },
        })
        return res.status(201).json({ professional })
      } catch (err) {
        console.error(err)
        return res
          .status(500)
          .json({ error: err, message: 'Internal server error' })
      }
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e, message: 'Internal server error' })
  }
}
