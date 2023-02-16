import { FormEvent, useEffect, useState } from 'react'
import { Container } from 'components/Container'
import { Header } from 'components/Header'
import { AdMeta, Article } from '@prisma/client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useRouter } from 'next/navigation'
import { CircleNotch } from 'phosphor-react'

export default function Page() {
  const [title, setTitle] = useState<string>()
  const [bannerUrl, setBannerUrl] = useState<string>()
  const [content, setContent] = useState<string>()
  const [advertizer, setAdvertizer] = useState<string | undefined>()
  const [adList, setAdList] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  async function handleForm(event: FormEvent) {
    event.preventDefault()

    setIsLoading(true)

    let data = {
      title,
      banner_url: bannerUrl,
      content,
      ...(advertizer && advertizer.length > 0 && { ad_name: advertizer }),
    }

    await fetch('/api/article/create', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (response.status !== 201) {
          console.error(`${response.status} ${response.statusText}`)
          return
        }

        const article = await response.json()
        router.push(`/articles/${encodeURI(article.slug)}`)
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    async function getAdList() {
      await fetch('/api/advertisers/list')
        .then((response) => response.json())
        .then((data: AdMeta[]) => setAdList(data.map((ad) => ad.name)))
        .catch((error) => console.log(error))
    }
    getAdList()
  }, [])

  return (
    <div>
      <Header />
      <Container>
        <form
          onSubmit={handleForm}
          className='border border-neutral-400 rounded-lg p-5 flex flex-col'
        >
          <div className='flex flex-col gap-3 mb-7'>
            <label className='text-2xl' htmlFor='titulo'>
              Título
            </label>
            <input
              type='text'
              id='titulo'
              name='titulo'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='border border-neutral-400 rounded-md p-2 w-1/2'
              required
            />
          </div>

          <div className='flex flex-col gap-3 mb-7'>
            <label className='text-2xl' htmlFor='banner'>
              Banner URL
            </label>
            <input
              type='url'
              id='banner'
              name='banner'
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              className='border border-neutral-400 rounded-md p-2 w-1/2'
              required
            />
          </div>

          <div className='flex flex-col gap-3 mb-7'>
            <label className='text-2xl' htmlFor='conteudo'>
              Conteúdo
            </label>
            <div className='flex gap-3'>
              <div className='flex-1'>
                <textarea
                  id='conteudo'
                  name='conteudo'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className='border border-neutral-600 rounded-md p-2 w-full text-lg'
                  required
                />
              </div>
              <div className='flex-1 flex-wrap break-words border border-neutral-400 rounded-md p-2'>
                <ReactMarkdown
                  className='markdown-content'
                  remarkPlugins={[remarkGfm]}
                >
                  {content ? String(content) : ''}
                </ReactMarkdown>
              </div>
            </div>
          </div>
          <div className='flex gap-3 mb-7'>
            <label className='text-2xl' htmlFor='anunciante'>
              Anunciante
            </label>
            <select
              id='anunciante'
              name='anunciante'
              value={advertizer}
              onChange={(e) => setAdvertizer(e.target.value)}
              className='p-3 transition bg-neutral-100 hover:bg-neutral-200 rounded-lg hover:cursor-pointer'
            >
              <option value=''>Selecione uma opção</option>
              {adList.map((ad) => (
                <option key={ad} value={ad}>
                  {ad}
                </option>
              ))}
            </select>
          </div>

          <div className='mt-5 flex justify-end'>
            <button
              type={!isLoading ? 'submit' : 'button'}
              className={`flex gap-2 items-center p-3 rounded-md text-blue-900 bg-blue-200/50 ${
                !isLoading && 'hover:bg-blue-200'
              } text-lg`}
            >
              {!isLoading ? (
                'Criar artigo'
              ) : (
                <>
                  <CircleNotch className='animate-spin' />
                  <span>Criando...</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Container>
    </div>
  )
}
