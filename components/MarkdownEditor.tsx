import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  value: string
  setValue: (v: string) => void
}

export function MarkdownEditor({ value, setValue }: Props) {
  return (
    <div className='flex gap-3'>
      <div className='flex-1'>
        <textarea
          id='conteudo'
          name='conteudo'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className='border border-neutral-600 rounded-md p-2 w-full text-lg'
          required
        />
      </div>
      <div className='flex-1 flex-wrap break-words border border-neutral-400 rounded-md p-2'>
        <ReactMarkdown className='markdown-content' remarkPlugins={[remarkGfm]}>
          {value ? String(value) : ''}
        </ReactMarkdown>
      </div>
    </div>
  )
}
