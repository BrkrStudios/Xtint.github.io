import {useDocumentOperation} from 'sanity'
import {useState} from 'react'
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
      return code
    }

    attempts++
    console.log(`Code collision detected: ${code}. Regenerating... (attempt ${attempts}/${maxAttempts})`)
  }

  // Fallback: add timestamp to guarantee uniqueness (extremely rare)
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4)
  let baseCode = ''
  for (let i = 0; i < 4; i++) {
    baseCode += chars[Math.floor(Math.random() * chars.length)]
  }

  return baseCode + timestamp
}

export function CreateJobAction(props) {
  const {patch, publish} = useDocumentOperation(props.id, props.type)
  const [isCreating, setIsCreating] = useState(false)

  return {
    label: isCreating ? 'Generating code...' : props.draft ? 'Create' : 'Create',
    disabled: isCreating || publish.disabled,
    onHandle: async () => {
      setIsCreating(true)

      try {
        // Generate unique code
        const code = await generateUniqueJobCode()

        // Patch the document with the unique code
        patch.execute([{set: {code}}])

        // Small delay to ensure patch is applied
        await new Promise(resolve => setTimeout(resolve, 100))

        // Publish the document
        publish.execute()

        props.onComplete()
      } catch (error) {
        console.error('Error creating job with unique code:', error)
        alert('Error generating unique job code. Please try again.')
      } finally {
        setIsCreating(false)
      }
    },
  }
}
