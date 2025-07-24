export const bgColor = [
  '#FF6CAC',
  '#8C6CFF',
  '#6C9AFF',
  '#6CFFCC',
  '#9FFF6C',
  '#EEFF6C',
  '#FFCC6C',
  '#FF986C',
  '#FE7B7B',
  '#6CE4FF',
]

export const textColor = [
  '#A10046',
  '#3000A1',
  '#0038A1',
  '#04734C',
  '#4D842E',
  '#8C6807',
  '#A13E00',
  '#A10000',
  '#A10000',
  '#0D5079',
]

export const getTextColor = (text: string): string => {
  if (text === 'admin') return '#82FF69'
  if (text.trim().toLowerCase().includes('subadmin')) return '#C9BDFF'

  if (text.trim().toLowerCase().includes('admin')) return '#5EFAFF'
  if (!text) return textColor[0]
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash)
  }
  return textColor[Math.abs(hash) % textColor.length]
}

export const getBgColor = (text: string): string => {
  if (text === 'admin') return '#18C023'
  if (text.trim().toLowerCase().includes('subadmin')) return '#3C14EF'
  if (text.trim().toLowerCase().includes('admin')) return '#5FCFFF'

  if (!text) return bgColor[0]
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash)
  }
  return bgColor[Math.abs(hash) % bgColor.length]
}

export const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
