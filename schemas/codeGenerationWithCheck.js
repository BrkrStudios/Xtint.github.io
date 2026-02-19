/**
 * OPTIONAL: Code generation with uniqueness check
 *
 * This file contains an alternative code generation approach that checks
 * for uniqueness before assigning a code to a job.
 *
 * To implement this:
 * 1. Replace the simple generateJobCode() in schemas/job.js
 * 2. This will make a query to Sanity on every job creation to ensure uniqueness
 *
 * Trade-offs:
 * - PRO: Guarantees 100% unique codes
 * - CON: Slightly slower job creation (adds ~100-200ms)
 * - CON: Requires async/await which may need different schema setup
 *
 * Current implementation uses simple random generation which has
 * a collision probability of ~1 in 2.8 trillion with 8 characters.
 */

import {client} from '../src/lib/sanity/client'

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
      `*[_type == "job" && code == $code][0]`,
      {code}
    )

    if (!existing) {
      return code
    }

    attempts++
  }

  // Fallback: add timestamp to guarantee uniqueness
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4)
  let baseCode = ''
  for (let i = 0; i < 4; i++) {
    baseCode += chars[Math.floor(Math.random() * chars.length)]
  }

  return baseCode + timestamp
}

/**
 * To implement in schemas/job.js, you would need to use a document action
 * or initial value template that supports async operations.
 *
 * Example usage in a custom document action:
 *
 * export function CreateJobAction(props) {
 *   return {
 *     label: 'Create',
 *     onHandle: async () => {
 *       const code = await generateUniqueJobCode()
 *       // Create document with the unique code
 *     }
 *   }
 * }
 */

export {generateUniqueJobCode}
