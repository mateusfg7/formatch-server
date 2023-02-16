import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Article, FilePlus, Pen, Trash } from 'phosphor-react'

import { formatDate } from 'utils/formatDate'
import { Header } from 'components/Header'
import { Container } from 'components/Container'

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

  async function deleteArticle(slug: string) {
    const articleListBackup = articles
    setArticles(articles.filter((article) => article.slug != slug))
    await fetch(`/api/article/${slug}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.status !== 204) {
          setArticles(articleListBackup)
          console.error(
            `Error while deleting article:\n\n${response.status} ${response.statusText}`
          )
          return
        }
        console.log(
          `Article deleted successfully with status code ${response.status}`
        )
      })
      .catch((error) => {
        setArticles(articleListBackup)
        console.error(error)
      })
  }

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
            href='/articles/new'
            className='flex items-center justify-center gap-2 p-3 rounded-xl transition text-neutral-800 bg-neutral-100 hover:bg-blue-100 hover:text-blue-800 hover:cursor-pointer'
          >
            <span>Novo</span>
            <FilePlus className='text-xl' weight='duotone' />
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
        ) : (
          articles.map((article) => (
            <div
              key={article.slug}
              className='flex border-b border-black/10 last:border-none'
            >
              <Link
                href={`/articles/${encodeURI(article.slug)}`}
                target='_blank'
                className='flex-1 py-5 group'
              >
                <div>
                  <h1 className='text-xl text-neutral-600 group-hover:text-neutral-900'>
                    {article.title}
                  </h1>
                </div>
                <p className='text-neutral-500 group-hover:text-neutral-700'>
                  {formatDate(new Date(article.createdAt))}
                </p>
              </Link>
              <div className='flex items-center justify-center'>
                <button
                  className='text-neutral-500 hover:text-red-600'
                  onClick={() => deleteArticle(article.slug)}
                >
                  <Trash size={30} weight='duotone' />
                </button>
              </div>
            </div>
          ))
        )}
      </Container>
    </div>
  )
}
