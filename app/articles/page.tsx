'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash } from 'phosphor-react'

import { formatDate } from '@utils/formatDate'

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
  const [articles, setArticles] = useState<ArticleData[]>([] as ArticleData[])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchArticle() {
      const data: ArticleData[] = await fetch(`/api/article/list`).then(
        (response) => response.json()
      )
      setArticles(data)
      setIsLoading(false)
    }
    fetchArticle()
  }, [])

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
      {isLoading ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        articles.map((article) => (
          <div
            key={article.slug}
            className='flex even:border-y even:border-black/10'
          >
            <Link
              href={`/articles/${article.slug}`}
              className='flex-1 py-5 group'
            >
              <div>
                <h1 className='text-xl text-neutral-700 group-hover:text-neutral-900'>
                  {article.title}
                </h1>
              </div>
              <p className='text-neutral-500 group-hover:text-neutral-700'>
                {formatDate(new Date(article.createdAt))}
              </p>
            </Link>
            <div className='flex items-center justify-center'>
              <button className='text-neutral-500 hover:text-red-600'>
                <Trash size={30} weight='duotone' />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
