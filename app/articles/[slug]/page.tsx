import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { getArticle } from 'use-case/articles/getArticle'
import { formatDate } from 'utils/formatDate'

interface Props {
  params: {
    slug: string
  }
}

export default async function Page({ params }: Props) {
  const article = await getArticle(params.slug)

  if (!article) {
    return {
      noFound: true,
    }
  }

  return (
    <div>
      {
        <>
          <div>
            <h1 className='text-neutral-900 text-2xl'>{article.title}</h1>
            <p className='text-neutral-500 text-lg'>
              {formatDate(new Date(article.createdAt))}
            </p>
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
          <ReactMarkdown
            className='markdown-content'
            remarkPlugins={[remarkGfm]}
          >
            {article.content}
          </ReactMarkdown>
        </>
      }
    </div>
  )
}
