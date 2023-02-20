import dynamic from 'next/dynamic'
import { SwaggerUIProps } from 'swagger-ui-react'

import 'swagger-ui-react/swagger-ui.css'

import { Header } from 'components/Header'
import { useEffect, useState } from 'react'

const SwaggerUI = dynamic<SwaggerUIProps>(import('swagger-ui-react'), {
  ssr: false,
})

function ApiDoc() {
  const [spec, setSpec] = useState<object>({})

  async function fetchSpec() {
    const data = await fetch('/openapi.json').then((response) =>
      response.json()
    )

    setSpec(data)
  }

  useEffect(() => {
    fetchSpec()
  }, [])

  return (
    <div>
      <Header />
      <div className='px-content'>
        <SwaggerUI spec={spec} />
      </div>
    </div>
  )
}

export default ApiDoc
