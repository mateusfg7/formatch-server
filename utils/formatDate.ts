import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

export function formatDate(date: Date) {
  const year = format(date, 'yyyy', { locale: ptBR })
  const month = format(date, 'MMMM', { locale: ptBR })
  const day = format(date, 'dd', { locale: ptBR })
  const hour = format(date, 'H', { locale: ptBR })
  const minutes = format(date, 'm', { locale: ptBR })

  return `${day} de ${month} de ${year}, às ${hour}:${minutes}`
}
