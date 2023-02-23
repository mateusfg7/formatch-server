import { Container } from '@components/Container'
import { Header } from '@components/Header'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { getArticle } from 'use-case/articles/getArticle'
import { formatDate } from 'utils/formatDate'

interface Article {
  id: string
  slug: string
  title: string
  banner_url: string | null
  content: string
  adMetaId: string | null
  sources: string[] | null
  createdAt: string
  updatedAt: string
  AdMeta: {
    id: string
    name: string
    logo_url: string
    website_url: string
    createdAt: string
    updatedAt: string
  } | null
}

interface Props {
  article: Article
}

export default function Page({ article }: Props) {
  return (
    <div>
      <Header />
      <Container>
        <div>
          <h1 className='text-neutral-900 text-2xl'>{article.title}</h1>
          <p className='text-neutral-500 text-lg'>{article.createdAt}</p>
        </div>
        {article.banner_url && (
          <div className='relative w-full h-64 my-10 rounded-xl overflow-hidden'>
            <Image
              src={article.banner_url}
              alt={article.banner_url}
              className='object-cover'
              fill
            />
          </div>
        )}
        <ReactMarkdown className='markdown-content' remarkPlugins={[remarkGfm]}>
          {article.content}
        </ReactMarkdown>
        {article.sources && (
          <div>
            <h2 className='text-2xl mb-3'>Fontes</h2>
            <ul>
              {article.sources.map((source) => (
                <li key={source}>
                  <a
                    href={source}
                    target='_blank'
                    rel='noreferrer'
                    className='text-blue-900 hover:underline'
                  >
                    {source}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {article.AdMeta && (
          <div className='mt-14 p-10 flex bg-gradient-to-r from-transparent to-black/50 rounded-3xl'>
            <div className='flex-1 flex flex-col gap-6'>
              <strong className='text-3xl'>{article.AdMeta.name}</strong>
              <a
                href={article.AdMeta.website_url}
                className='text-2xl transition hover:text-blue-600'
                target='_blank'
                rel='noreferrer'
              >
                {article.AdMeta.website_url}
              </a>
            </div>
            <div className='flex-1 relative'>
              <Image
                src={article.AdMeta.logo_url}
                alt={article.AdMeta.name}
                fill
              />
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query

  const article = await getArticle(slug as string)

  if (!article) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      article: article && {
        ...article,
        createdAt: formatDate(article.createdAt),
        updatedAt: formatDate(article.updatedAt),
        AdMeta: article.AdMeta && {
          ...article.AdMeta,
          createdAt: formatDate(article.AdMeta.createdAt),
          updatedAt: formatDate(article.AdMeta.updatedAt),
        },
      },
    },
  }
}
