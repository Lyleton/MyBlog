export const formatDate = (dateStr: string, options?: Intl.DateTimeFormatOptions) => {
  return new Date(dateStr).toLocaleDateString('zh-CN', options ?? {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
