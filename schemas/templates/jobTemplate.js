import {client} from '../../src/lib/sanity/client'

async function generateUniqueJobCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const length = 8
  let attempts = 0
  const maxAttempts = 10

  while (attempts < maxAttempts) {
    let code = ''

    // Generate random code
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length)
      code += chars[randomIndex]
    }

    // Check if code already exists
    const existing = await client.fetch(
      `count(*[_type == "job" && code == $code])`,
      {code}
    )

    if (existing === 0) {
      console.log('✅ Generated unique job code:', code)
      return code
    }

    attempts++
    console.log(`⚠️ Code collision detected: ${code}. Regenerating... (attempt ${attempts}/${maxAttempts})`)
  }

  // Fallback: add timestamp to guarantee uniqueness
  console.warn('⚠️ Max attempts reached. Using timestamp fallback.')
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4)
  let baseCode = ''
  for (let i = 0; i < 4; i++) {
    baseCode += chars[Math.floor(Math.random() * chars.length)]
  }

  return baseCode + timestamp
}

export default {
  id: 'job',
  title: 'Job',
  schemaType: 'job',
  value: async () => {
    const code = await generateUniqueJobCode()
    return {
      code,
      status: 'awaiting-dropoff',
      needsTintRemoval: false,
    }
  },
}
