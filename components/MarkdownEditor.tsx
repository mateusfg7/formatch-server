import { useState } from 'react'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  value: string
  setValue: (v: string) => void
}

export function MarkdownEditor({ value, setValue }: Props) {
  const [active, setActive] = useState<'editor' | 'preview'>('editor')

  return (
    <div className='border border-neutral-600 rounded-md overflow-hidden'>
      <header className='flex gap-2 justify-around md:justify-start border-b border-b-neutral-400 p-2'>
        <button
          type='button'
          onClick={() => setActive('editor')}
          className={`p-1 rounded-md ${
            active === 'editor' && 'bg-neutral-100'
          } hover:bg-neutral-200`}
        >
          Editor
        </button>
        <button
          type='button'
          onClick={() => setActive('preview')}
          className={`p-1 rounded-md ${
            active === 'preview' && 'bg-neutral-100'
          } hover:bg-neutral-200`}
        >
          Preview
        </button>
      </header>
      <main className='flex h-72'>
        {active === 'editor' && (
          <div className='flex-1'>
            <textarea
              id='conteudo'
              name='conteudo'
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className='w-full h-full p-2 text-lg resize-none'
              required
            />
          </div>
        )}
        {active === 'preview' && (
          <div className='h-full w-full overflow-y-scroll p-2 flex-wrap break-words'>
            <ReactMarkdown
              className='markdown-content'
              remarkPlugins={[remarkGfm]}
            >
              {value ? String(value) : ''}
            </ReactMarkdown>
          </div>
        )}
      </main>
    </div>
  )
}
