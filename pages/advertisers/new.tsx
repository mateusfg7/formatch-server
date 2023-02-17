import { FormEvent, useState } from 'react'
import { Container } from 'components/Container'
import { Header } from 'components/Header'
import { useRouter } from 'next/navigation'
import { CircleNotch } from 'phosphor-react'

export default function Page() {
  const [adName, setAdName] = useState<string>()
  const [adLogoUrl, setAdLogoUrl] = useState<string>()
  const [website, setWebsite] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  async function handleForm(event: FormEvent) {
    event.preventDefault()

    setIsLoading(true)

    let data = {
      name: adName,
      logo_url: adLogoUrl,
      website,
    }

    await fetch('/api/advertiser/create', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (response.status !== 201) {
          console.error(`${response.status} ${response.statusText}`)
          return
        }

        const article = await response.json()
        router.push(`/advertisers`)
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false))
  }

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
              Nome do anunciante
            </label>
            <input
              type='text'
              id='titulo'
              name='titulo'
              value={adName}
              onChange={(e) => setAdName(e.target.value)}
              className='border border-neutral-400 rounded-md p-2 w-1/2'
              required
            />
          </div>

          <div className='flex flex-col gap-3 mb-7'>
            <label className='text-2xl' htmlFor='logo_url'>
              Logo URL
            </label>
            <input
              type='url'
              id='logo_url'
              name='logo_url'
              value={adLogoUrl}
              onChange={(e) => setAdLogoUrl(e.target.value)}
              className='border border-neutral-400 rounded-md p-2 w-1/2'
              required
            />
          </div>

          <div className='flex flex-col gap-3 mb-7'>
            <label className='text-2xl' htmlFor='webite'>
              Website
            </label>
            <input
              type='url'
              id='webite'
              name='webite'
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className='border border-neutral-400 rounded-md p-2 w-1/2'
              required
            />
          </div>

          <div className='mt-5 flex justify-end'>
            <button
              type={!isLoading ? 'submit' : 'button'}
              className={`flex gap-2 items-center p-3 rounded-md text-blue-900 bg-blue-200/50 ${
                !isLoading && 'hover:bg-blue-200'
              } text-lg`}
            >
              {!isLoading ? (
                'Criar anunciante'
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
