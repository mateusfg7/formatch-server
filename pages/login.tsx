import Image from 'next/image'
import { ReactNode, useState } from 'react'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function Login() {
  const [status, setStatus] = useState<'none' | 'loading' | 'success' | 'fail'>(
    'none'
  )
  const [adminKey, setAdminKey] = useState('')

  async function handleLogin() {
    setStatus('loading')
    await sleep(3000)
    setStatus('fail')
  }

  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <div className='flex flex-col items-center justify-between rounded-2xl p-16 shadow-2xl'>
        <div className='w-96 mb-10'>
          <Image src='/logotipo.svg' width={500} height={500} alt='Formatch' />
        </div>
        <h1 className='font-bold text-2xl'>Chave de administração</h1>
        <input
          type='text'
          value={adminKey}
          onChange={(e) => {
            setAdminKey(e.target.value)
            setStatus('none')
          }}
          placeholder='61169e84-4eb5-407c-9615-386d51e4c1d0'
          className='my-5 border border-neutral-600 rounded-xl w-full p-2 text-center text-lg focus:bg-neutral-100 hover:bg-neutral-100'
        />
        {status === 'none' && (
          <button
            onClick={handleLogin}
            className='w-full p-5 border border-blue-800 text-blue-800 rounded-xl hover:bg-blue-800 hover:text-white'
          >
            Entrar
          </button>
        )}
        {status === 'loading' && (
          <button
            onClick={handleLogin}
            className='w-full p-5 border border-blue-800 text-white rounded-xl bg-blue-800'
          >
            Carregando
          </button>
        )}
        {status === 'success' && (
          <button
            onClick={handleLogin}
            className='w-full p-5 border border-green-800 text-white rounded-xl bg-green-800'
          >
            Sucesso
          </button>
        )}
        {status === 'fail' && (
          <button
            onClick={handleLogin}
            className='w-full p-5 border border-red-800 text-white rounded-xl bg-red-800'
          >
            Falhou
          </button>
        )}
      </div>
    </div>
  )
}
