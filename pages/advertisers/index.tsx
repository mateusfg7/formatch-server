import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AdMeta } from '@prisma/client'
import { SmileySad, Storefront, Trash } from 'phosphor-react'

import { formatDate } from 'utils/formatDate'
import { Header } from 'components/Header'
import { Container } from 'components/Container'

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
        <div className='flex justify-end mb-3'>
          <Link
            href='/advertisers/new'
            className='flex items-center justify-center gap-2 p-3 rounded-xl transition text-neutral-800 bg-neutral-100 hover:bg-blue-100 hover:text-blue-800 hover:cursor-pointer'
          >
            <span>Novo</span>
            <Storefront className='text-xl' weight='duotone' />
          </Link>
        </div>
        {isLoading ? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : advertises.length > 0 ? (
          advertises.map((ad) => (
            <div
              key={ad.id}
              className='flex border-b border-black/10 last:border-none group'
            >
              <div className='flex-1 py-1 flex gap-7 group-hover:cursor-pointer'>
                <div className='relative flex items-center justify-center w-[14%] rounded-xl overflow-hidden p-2 transition duration-500 bg-neutral-300 group-hover:bg-neutral-400 border border-neutral-500'>
                  <div className='relative w-full h-full'>
                    <Image
                      src={ad.logo_url}
                      alt='Error'
                      className='object-contain flex items-center justify-center'
                      fill
                    />
                  </div>
                </div>
                <div className='py-5'>
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
        ) : (
          <div className='p-20 flex items-center justify-center gap-6 text-xl text-neutral-500'>
            <span>Nenhum anunciante encontrado</span>
            <SmileySad />
          </div>
        )}
      </Container>
    </div>
  )
}
