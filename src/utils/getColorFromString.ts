const colors = [
  '#FEFA85', // Soft Yellow
  '#FF8282', // Soft Red
  '#57BFFF', // Sky Blue
  '#A287FF', // Lavender Purple
  '#FFA3C4', // Soft Pink
  '#85FFD1', // Mint Green
  '#FFD792', // Peach
  '#C5A3FF', // Light Violet
  '#7ED6FF', // Light Cyan
  '#FFB26B', // Coral Orange
]

/**
 * @param {string} text
 * @returns {string}
 */

export const getColorForString = (text: string): string => {
  if (!text) return colors[0]
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}
