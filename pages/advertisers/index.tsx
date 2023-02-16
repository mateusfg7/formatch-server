import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash } from 'phosphor-react'

import { formatDate } from 'utils/formatDate'
import { Header } from 'components/Header'
import { Container } from 'components/Container'
import { AdMeta } from '@prisma/client'
import Image from 'next/image'

interface ArticleData {
  title: string
  slug: string
  banner_url: string
  content: string
  createdAt: string
  AdMeta?: {
    name: string
    logo_url: string
    website_url: string
  }
}

export default function Page() {
  const [advertises, setAdvertises] = useState<AdMeta[]>([] as AdMeta[])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAdvertisers() {
      const data: AdMeta[] = await fetch(`/api/advertisers/list`).then(
        (response) => response.json()
      )
      setAdvertises(data)
      console.table(data)
      setIsLoading(false)
    }
    fetchAdvertisers()
  }, [])

  // async function deleteArticle(slug: string) {
  //   const articleListBackup = advertises
  //   setAdvertises(advertises.filter((article) => article.slug != slug))
  //   await fetch(`/api/article/${slug}`, {
  //     method: 'DELETE',
  //   })
  //     .then((response) => {
  //       if (response.status !== 204) {
  //         setAdvertises(articleListBackup)
  //         console.error(
  //           `Error while deleting article:\n\n${response.status} ${response.statusText}`
  //         )
  //         return
  //       }
  //       console.log(
  //         `Article deleted successfully with status code ${response.status}`
  //       )
  //     })
  //     .catch((error) => {
  //       setAdvertises(articleListBackup)
  //       console.error(error)
  //     })
  // }

  const Skeleton = () => (
    <div className='flex animate-pulse'>
      <div className='flex-1 py-5 group'>
        <div className='bg-neutral-200 h-6 w-36 mb-1' />
        <div className='bg-neutral-200 h-6 w-56' />
      </div>
      <div className='flex items-center justify-center'>
        <div className='w-8 h-8 bg-neutral-200' />
      </div>
    </div>
  )

  return (
    <div>
      <Header />
      <Container>
        {isLoading ? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          advertises.map((ad) => (
            <div
              key={ad.id}
              className='flex border-t border-black/10 first:border-none'
            >
              <div className='flex-1 py-5 flex gap-7'>
                <div className='relative flex items-center justify-center w-28 rounded-xl overflow-hidden p-3 bg-black/40'>
                  <div className='relative w-full h-full flex items-center justify-center'>
                    <Image src={ad.logo_url} alt='pic' fill />
                  </div>
                </div>
                <div>
                  <div>
                    <h1 className='text-xl text-neutral-900'>{ad.name}</h1>
                  </div>
                  <p className='text-neutral-700'>
                    {formatDate(new Date(ad.createdAt))}
                  </p>
                </div>
              </div>
              {/* <div className='flex items-center justify-center'>
                <button
                  className='text-neutral-500 hover:text-red-600'
                  onClick={() => deleteArticle(ad.slug)}
                >
                  <Trash size={30} weight='duotone' />
                </button>
              </div> */}
            </div>
          ))
        )}
      </Container>
    </div>
  )
}
