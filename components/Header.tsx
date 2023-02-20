import Image from 'next/image'
import Link from 'next/link'

import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  return (
    <header className='flex flex-col gap-6 pt-7'>
      <section className='w-full px-content'>
        <div className='w-44'>
          <Image src='/logotipo.svg' width={500} height={500} alt='Formatch' />
        </div>
      </section>
      <nav className='flex gap-7 w-full px-content py-3 border-b border-black/10'>
        <Link
          href='/'
          className={`text-xl rounded-xl p-2 transition duration-500 hover:bg-neutral-100 ${
            pathname === '/' && 'font-bold'
          }`}
        >
          Home
        </Link>
        <Link
          href='/articles'
          className={`text-xl rounded-xl p-2 transition duration-500 hover:bg-neutral-100 ${
            pathname?.startsWith('/articles') && 'font-bold'
          }`}
        >
          Articles
        </Link>
        <Link
          href='/advertisers'
          className={`text-xl rounded-xl p-2 transition duration-500 hover:bg-neutral-100 ${
            pathname?.startsWith('/advertisers') && 'font-bold'
          }`}
        >
          Advertisers
        </Link>
        <Link
          href='/docs'
          className={`text-xl rounded-xl p-2 transition duration-500 hover:bg-neutral-100 ${
            pathname?.startsWith('/docs') && 'font-bold'
          }`}
        >
          API Docs
        </Link>
      </nav>
    </header>
  )
}
