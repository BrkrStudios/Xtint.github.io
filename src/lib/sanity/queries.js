import { client } from './client'

/**
 * Fetch a job by its unique code
 * @param {string} code - The job code to search for
 * @returns {Promise<object|null>} The job object or null if not found
 */
export async function getJobByCode(code) {
  if (!code) return null

  // Convert to uppercase for case-insensitive search
  const normalizedCode = code.toUpperCase().trim()

  const query = `*[_type == "job" && code == $code && !defined(archivedAt)][0]{
    _id,
    code,
    customerName,
    phone,
    email,
    vehicle,
    appointmentDate,
    needsTintRemoval,
    status,
    notes,
    isDelayed,
    delayMessage,
    documents[]{
      _key,
      title,
      type,
      file{
        asset->{
          _id,
          url,
          originalFilename
        }
      }
    },
    lastUpdated,
    archivedAt,
    _createdAt
  }`

  try {
    const job = await client.fetch(query, { code: normalizedCode })
    return job
  } catch (error) {
    console.error('Error fetching job:', error)
    return null
  }
}

/**
 * Get human-readable status label
 * @param {string} status - The status value
 * @returns {string} Human-readable status
 */
export function getStatusLabel(status) {
  const statusMap = {
    'awaiting-dropoff': 'Awaiting Drop-off',
    'received': 'Received',
    'prepping': 'Prepping',
    'tint-removal': 'Tint Removal',
    'tinting': 'Tinting',
    'curing': 'Curing',
    'ready': 'Ready for Pickup',
    'completed': 'Completed',
  }
  return statusMap[status] || status
}

/**
 * Get color for status badge
 * @param {string} status - The status value
 * @returns {string} Hex color code
 */
export function getStatusColor(status) {
  const colorMap = {
    'awaiting-dropoff': '#9ca3af',  // Gray
    'received': '#3b82f6',          // Blue
    'prepping': '#eab308',           // Yellow
    'tint-removal': '#f97316',       // Orange
    'tinting': '#a855f7',            // Purple
    'curing': '#6366f1',             // Indigo
    'ready': '#22c55e',              // Green
    'completed': '#16a34a',          // Dark Green
  }
  return colorMap[status] || '#6b7280'  // Gray fallback
}
