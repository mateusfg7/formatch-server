import { useRouter } from 'next/router'
import React, { useState } from 'react'

interface Article {
  title: string
  banner_url: string
  content: string
  ad_meta?: {
    name?: string
    logo_url?: string
    website_url?: string
  }
}

interface ResponseData {
  banner_url: string
  content: string
  createdAt: string
  id: string
  slug: string
  title: string
  updatedAt: string
  AdMeta?: {
    createdAt: string
    id: string
    logo_url: string
    name: string
    updatedAt: string
    website_url: string
  }
}

const ArticleForm = () => {
  const [title, setTitle] = useState<string>('')
  const [bannerUrl, setBannerUrl] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [showAdvertiser, setShowAdvertiser] = useState<boolean>(false)
  const [advertiserName, setAdvertiserName] = useState<string | undefined>(
    undefined
  )
  const [advertiserLogoUrl, setAdvertiserLogoUrl] = useState<
    string | undefined
  >(undefined)
  const [advertiserWebsiteUrl, setAdvertiserWebsiteUrl] = useState<
    string | undefined
  >(undefined)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const haveAdvertiserData =
      !!showAdvertiser &&
      !!advertiserName &&
      !!advertiserLogoUrl &&
      !!advertiserWebsiteUrl

    const article: Article = {
      title,
      banner_url: bannerUrl,
      content,
      ...(haveAdvertiserData && {
        ad_meta: {
          name: advertiserName,
          logo_url: advertiserLogoUrl,
          website_url: advertiserWebsiteUrl,
        },
      }),
    }

    try {
      const response = await fetch('/api/article/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      })

      if (!response.ok) {
        alert(
          `Ocorreu um erro ao criar o artigo!\n\n${response.status} ${response.statusText}`
        )
        console.log(response)
        throw new Error(response.statusText)
      }

      const data: ResponseData = await response.json()

      alert(`Artigo criado com sucesso!`)
      router.push(`/article/${data.slug}`)
    } catch (error) {
      console.error(error)
      alert('There was an error creating the article. Please try again.')
    }
  }

  return (
    <form className='bg-white p-6 rounded-lg shadow-lg' onSubmit={handleSubmit}>
      <h2 className='block font-semibold text-gray-700 mb-5'>Artigo</h2>
      <label className='block font-medium text-gray-700 mb-2' htmlFor='title'>
        Título:
      </label>
      <input
        className='w-full border border-gray-400 p-2 rounded-lg'
        type='text'
        id='title'
        name='title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label
        className='block font-medium text-gray-700 mb-2 mt-5'
        htmlFor='banner-url'
      >
        Banner URL:
      </label>
      <input
        className='w-full border border-gray-400 p-2 rounded-lg'
        type='url'
        id='banner-url'
        name='banner-url'
        value={bannerUrl}
        onChange={(e) => setBannerUrl(e.target.value)}
        required
      />

      <label
        className='block font-medium text-gray-700 mb-2 mt-5'
        htmlFor='content'
      >
        Conteúdo:
      </label>
      <textarea
        className='w-full border border-gray-400 p-2 rounded-lg'
        id='content'
        name='content'
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <label
        className='block font-medium text-gray-700 mb-2 mt-5'
        htmlFor='advertiser'
      >
        <input
          type='checkbox'
          id='advertiser'
          className='mr-3'
          checked={showAdvertiser}
          onChange={() => setShowAdvertiser(!showAdvertiser)}
        />
        Adicionar anunciante
      </label>
      {showAdvertiser && (
        <div className='mt-7'>
          <h2 className='block font-semibold text-gray-700 mb-5'>Anunciante</h2>
          <label
            className='block font-medium text-gray-700 mb-2 mt-5'
            htmlFor='advertiser-name'
          >
            Nome:
          </label>
          <input
            className='w-full border border-gray-400 p-2 rounded-lg'
            type='text'
            id='advertiser-name'
            name='advertiser-name'
            value={advertiserName}
            onChange={(e) => setAdvertiserName(e.target.value)}
            required
          />

          <label
            className='block font-medium text-gray-700 mb-2 mt-5'
            htmlFor='advertiser-logo-url'
          >
            Logo URL:
          </label>
          <input
            className='w-full border border-gray-400 p-2 rounded-lg'
            type='url'
            id='advertiser-logo-url'
            name='advertiser-logo-url'
            value={advertiserLogoUrl}
            onChange={(e) => setAdvertiserLogoUrl(e.target.value)}
            required
          />

          <label
            className='block font-medium text-gray-700 mb-2 mt-5'
            htmlFor='advertiser-website-url'
          >
            Website URL:
          </label>
          <input
            className='w-full border border-gray-400 p-2 rounded-lg'
            type='url'
            id='advertiser-website-url'
            name='advertiser-website-url'
            value={advertiserWebsiteUrl}
            onChange={(e) => setAdvertiserWebsiteUrl(e.target.value)}
            required
          />
        </div>
      )}

      <div className='mt-10 flex justify-end'>
        <button
          type='submit'
          className='bg-indigo-500 text-white py-3 px-6 rounded-lg hover:bg-indigo-600'
        >
          Enviar
        </button>
      </div>
    </form>
  )
}

export default ArticleForm
