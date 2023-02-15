'use client'

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
        <div className={`text-xl ${pathname === '/' && 'font-bold'}`}>
          <Link href='/'>Home</Link>
        </div>
        <div
          className={`text-xl ${
            pathname?.startsWith('/articles') && 'font-bold'
          }`}
        >
          <Link href='/articles'>Articles</Link>
        </div>
        <div
          className={`text-xl ${
            pathname?.startsWith('/professionals') && 'font-bold'
          }`}
        >
          <Link href='/professionals'>Professionals</Link>
        </div>
      </nav>
    </header>
  )
}
