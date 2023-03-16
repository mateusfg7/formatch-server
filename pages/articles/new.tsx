import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdMeta } from '@prisma/client'
import { Check, CircleNotch, Plus, Trash, X } from 'phosphor-react'

import { Container } from 'components/Container'
import { Header } from 'components/Header'
import { MarkdownEditor } from '@components/MarkdownEditor'

export default function Page() {
  const [title, setTitle] = useState<string>()
  const [bannerUrl, setBannerUrl] = useState<string>()
  const [content, setContent] = useState<string>()
  const [advertizer, setAdvertizer] = useState<string | undefined>()
  const [adList, setAdList] = useState<string[]>([])
  const [currentSource, setCurrentSource] = useState<string>('')
  const [sourceList, setSourceList] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccessfulCreated, setIsSuccessfulCreated] = useState(false)
  const [isError, setIsError] = useState(false)

  const router = useRouter()

  async function handleForm(event: FormEvent) {
    event.preventDefault()

    setIsLoading(true)

    let data = {
      title,
      banner_url: bannerUrl,
      content,
      ...(sourceList.length > 0 && { sources: sourceList }),
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
        setIsSuccessfulCreated(true)
        router.push(`/articles/${encodeURI(article.slug)}`)
      })
      .catch((error) => {
        setIsError(true)
        console.log(error)
      })
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
          className='md:border border-neutral-400 rounded-lg p-1 md:p-5 flex flex-col'
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
              className='border border-neutral-400 rounded-md p-2 w-full'
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
              className='border border-neutral-400 rounded-md p-2 w-full'
              required
            />
          </div>

          <div className='flex flex-col gap-3 mb-7'>
            <label className='text-2xl' htmlFor='conteudo'>
              Conteúdo
            </label>
            <MarkdownEditor value={content as string} setValue={setContent} />
          </div>

          <div className='flex flex-col gap-3 mb-7'>
            <label className='text-2xl' htmlFor='source'>
              Fontes
            </label>
            <div className='flex flex-col gap-3'>
              <div className='flex-1 flex gap-3 flex-wrap'>
                {sourceList.map((src) => (
                  <div
                    key={src}
                    className='bg-neutral-100 rounded-md p-2 flex items-center gap-1'
                  >
                    <div>{src}</div>
                    <button
                      className='text-lg transition hover:text-red-600'
                      onClick={() => {
                        setSourceList([
                          ...sourceList.filter((source) => source !== src),
                        ])
                      }}
                    >
                      <Trash />
                    </button>
                  </div>
                ))}
              </div>
              <div className='flex-1 flex gap-3'>
                <input
                  type='url'
                  name='source'
                  id='source'
                  className='border border-neutral-400 rounded-md p-2 w-full md:w-1/2'
                  value={currentSource}
                  onChange={(e) => setCurrentSource(e.target.value)}
                />
                <button
                  type='button'
                  title='Adicionar fonte'
                  className='transition-colors duration-300 border border-neutral-400 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700 rounded-md p-3'
                  onClick={() => {
                    if (currentSource.length > 0) {
                      setSourceList([...sourceList, currentSource])
                      setCurrentSource('')
                    }
                  }}
                >
                  <Plus />
                </button>
              </div>
            </div>
          </div>

          <div className='flex flex-col md:flex-row md:items-center gap-3 mb-7'>
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
              type={
                !isLoading && !isError && !isSuccessfulCreated
                  ? 'submit'
                  : 'button'
              }
              className={`flex gap-4 items-center justify-center w-full md:w-32 p-6 md:p-3 rounded-md text-blue-900 text-lg ${
                !isSuccessfulCreated && !isError && 'bg-blue-200/50'
              } ${
                !isLoading &&
                isSuccessfulCreated &&
                !isError &&
                'bg-green-200/50'
              } ${
                !isLoading && !isSuccessfulCreated && isError && 'bg-red-200/50'
              } ${
                !isLoading &&
                !isSuccessfulCreated &&
                !isError &&
                'hover:bg-blue-200'
              }`}
            >
              {!isLoading && !isSuccessfulCreated && !isError && 'Criar artigo'}
              {!isLoading && isSuccessfulCreated && !isError && (
                <>
                  <Check className='text-green-900' />
                  <span className='text-green-900'>Sucesso</span>
                </>
              )}
              {!isLoading && !isSuccessfulCreated && isError && (
                <>
                  <X className='text-red-900' />
                  <span className='text-red-900'>Erro</span>
                </>
              )}
              {isLoading && !isSuccessfulCreated && !isError && (
                <>
                  <CircleNotch weight='bold' className='animate-spin' />
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
