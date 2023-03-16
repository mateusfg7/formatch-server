import Image from 'next/image'
import Link from 'next/link'

import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  const MenuItem = ({ title, path }: { title: string; path: string }) => {
    let isActive: boolean

    if (path === '/') {
      isActive = pathname === path
      console.log('is home')
    } else {
      isActive = pathname?.startsWith(path)
      console.log('is not home')
    }

    return (
      <Link
        href={path}
        className={`text-xl rounded-xl p-2 transition duration-500 hover:bg-neutral-100 ${
          isActive && 'font-bold'
        }`}
      >
        <p className='w-max'>{title}</p>
      </Link>
    )
  }

  return (
    <header className='flex flex-col gap-6 pt-7'>
      <section className='flex justify-center md:justify-start w-full px-content'>
        <div className='w-44'>
          <Image src='/logotipo.svg' width={500} height={500} alt='Formatch' />
        </div>
      </section>
      <nav className='flex gap-7 w-full overflow-x-scroll md:overflow-visible px-content py-3 border-b border-black/10'>
        <MenuItem title='Home' path='/' />
        <MenuItem title='Articles' path='/articles' />
        <MenuItem title='Advertisers' path='/advertisers' />
        <MenuItem title='API Docs' path='/docs' />
      </nav>
    </header>
  )
}
