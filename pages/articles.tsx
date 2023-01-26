import { useEffect, useState } from 'react'
import styles from '../styles/Article.module.css'
import Link from 'next/link'

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

export default function Article() {
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

  return (
    <div className={styles.container}>
      {isLoading ? (
        <h1>Carregando artigos...</h1>
      ) : (
        articles.map((article) => {
          return (
            <Link key={article.slug} href={`/article/${article.slug}`}>
              <div
                className={styles.articleInfo}
                style={{ backgroundImage: `url(${article.banner_url})` }}
              >
                <div className={styles.overlay}>
                  <h1 style={{ margin: '0' }}>{article.title}</h1>
                  <p>{article.createdAt}</p>
                </div>
              </div>
            </Link>
          )
        })
      )}
    </div>
  )
}
