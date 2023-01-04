import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { File } from 'formidable'

import { prismaClient } from '../../lib/prisma'
import { uploadFileToGCS } from '../../utils/uploadFileToGcs'
import { form } from '../../utils/form'
import { generateUid } from '../../utils/uid'
import { Professional } from '@prisma/client'
import { deleteFileFromGcs } from '../../utils/deleteFileFromGcs'

export async function updateProfessional(
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
        professional_id: z.string(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        state_uf: z.string().optional(),
        city: z.string().optional(),
        biography: z.string().optional(),
        whatsapp: z.string().optional(),
        instagram: z.string().optional(),
        services: z.string().optional(),
      })
      const parsedFields = fieldsSchema.safeParse(rawFields)

      if (!parsedFields.success)
        return res.status(400).json({ error: parsedFields.error.issues })

      let {
        professional_id,
        name,
        email,
        phone,
        state_uf,
        city,
        biography,
        whatsapp,
        instagram,
        services,
      } = parsedFields.data

      let parsedService: string[] | undefined

      if (services) {
        parsedService = services.split(',')
      }

      const file = files.profile_picture_file as File | undefined

      let professional: Professional

      try {
        const professionalOnDB = await prismaClient.professional.findUnique({
          where: {
            id: professional_id,
          },
        })
        if (!professionalOnDB)
          return res.status(404).json({ message: 'Professional not found.' })
        professional = professionalOnDB
      } catch (err) {
        console.error(err)
        return res
          .status(500)
          .json({ error: err, message: 'Internal server error' })
      }

      let gcsFilePath: string | undefined
      let fileUrlOnGCS: string | undefined

      if (file) {
        const deleteFromGcsResponse = await deleteFileFromGcs(
          professional.profile_picture_gcs_path
        )
        if (deleteFromGcsResponse.statusCode !== 204)
          return res
            .status(500)
            .json({ message: 'Error while update professional picture.' })

        const parsedProfessionalName = professional.name
          .toLowerCase()
          .replaceAll(' ', '-')
        const parsedFileType = file.mimetype?.split('/')[1]
        const newFileName = `${generateUid()}_${parsedProfessionalName}.${parsedFileType}`

        const localFilePath = file.filepath
        gcsFilePath = `assets/profile-picture/${newFileName}`

        fileUrlOnGCS = await uploadFileToGCS(localFilePath, gcsFilePath)
      }

      try {
        let updatedProfessional: Professional
        if (parsedService) {
          updatedProfessional = await prismaClient.professional.update({
            where: {
              id: professional_id,
            },
            data: {
              name,
              email,
              phone,
              state_uf,
              city,
              biography,
              whatsapp,
              instagram,
              profile_picture_url: fileUrlOnGCS,
              profile_picture_gcs_path: gcsFilePath,
              services: {
                set: [],
                connectOrCreate: parsedService.map((service) => ({
                  where: { service_name: service.trim() },
                  create: { service_name: service.trim() },
                })),
              },
            },
            include: {
              services: true,
            },
          })
        } else {
          updatedProfessional = await prismaClient.professional.update({
            where: {
              id: professional_id,
            },
            data: {
              name,
              email,
              phone,
              state_uf,
              city,
              biography,
              whatsapp,
              instagram,
              profile_picture_url: fileUrlOnGCS,
              profile_picture_gcs_path: gcsFilePath,
            },
            include: {
              services: true,
            },
          })
        }

        return res.status(200).json({ professional: updatedProfessional })
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
