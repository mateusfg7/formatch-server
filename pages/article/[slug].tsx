import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../../styles/Article.module.css'

interface ArticleData {
  title: string
  banner_url: string
  content: string
  createdAt: string
  AdMeta?: {
    name: string
    logo_url: string
    website_url: string
  }
}

export default function Article() {
  const [articleData, setArticleData] = useState<ArticleData>({} as ArticleData)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    async function fetchArticle() {
      const data: ArticleData = await fetch(
        `/api/article/${router.query.slug}`
      ).then((response) => response.json())
      setArticleData(data)
      setIsLoading(false)
    }
    fetchArticle()
  }, [router.query.slug])

  function replaceWithBr(content: string) {
    return content.replace(/\n/g, '<br />')
  }

  return (
    <div className={styles.container}>
      {isLoading ? (
        <h1>Carregando artigo...</h1>
      ) : (
        <>
          <h1>{articleData.title}</h1>
          <img className={styles.image} src={articleData.banner_url} />
          <p
            dangerouslySetInnerHTML={{
              __html: replaceWithBr(articleData.content),
            }}
            className={styles.content}
          />
        </>
      )}
    </div>
  )
}
