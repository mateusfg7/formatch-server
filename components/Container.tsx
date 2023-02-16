import { ReactNode } from 'react'

export function Container({ children }: { children: ReactNode }) {
  return <div className='px-content py-10 pb-24'>{children}</div>
}
