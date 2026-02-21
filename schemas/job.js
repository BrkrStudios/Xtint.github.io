import {defineField, defineType} from 'sanity'
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

export default defineType({
  name: 'job',
  title: 'Job',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      title: 'Job Code',
      type: 'string',
      description: 'Unique 8-character code for customer lookup (auto-generated)',
      validation: (Rule) => Rule.required(),
      readOnly: true,
      initialValue: () => generateUniqueJobCode(),
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'vehicle',
      title: 'Vehicle',
      type: 'object',
      fields: [
        {
          name: 'make',
          title: 'Make',
          type: 'string',
        },
        {
          name: 'model',
          title: 'Model',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'appointmentDate',
      title: 'Appointment Date',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
      },
    }),
    defineField({
      name: 'needsTintRemoval',
      title: 'Needs Tint Removal',
      type: 'boolean',
      description: 'Check this if the vehicle requires old tint removal',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Awaiting Drop-off', value: 'awaiting-dropoff'},
          {title: 'Received', value: 'received'},
          {title: 'Prepping', value: 'prepping'},
          {title: 'Tint Removal', value: 'tint-removal'},
          {title: 'Tinting', value: 'tinting'},
          {title: 'Curing', value: 'curing'},
          {title: 'Ready for Pickup', value: 'ready'},
          {title: 'Completed', value: 'completed'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'awaiting-dropoff',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
      description: 'Optional notes about the job',
    }),
    defineField({
      name: 'isDelayed',
      title: 'Operations Delayed',
      type: 'boolean',
      description: 'Check this to display a delay notice to customers',
      initialValue: false,
    }),
    defineField({
      name: 'delayMessage',
      title: 'Custom Delay Message',
      type: 'text',
      rows: 3,
      description: 'Optional custom message (if empty, shows default: "Current Progress Delayed. Operations will resume shortly.")',
      hidden: ({document}) => !document?.isDelayed,
    }),
    defineField({
      name: 'documents',
      title: 'Documents',
      type: 'array',
      description: 'Upload documents for customer access',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Document Title',
              type: 'string',
              description: 'Name displayed to customers',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'type',
              title: 'Document Type',
              type: 'string',
              description: 'Category of document',
              options: {
                list: [
                  {title: 'Invoice', value: 'invoice'},
                  {title: 'Warranty', value: 'warranty'},
                  {title: 'Warranty Claim Form', value: 'warranty-claim'},
                  {title: 'Agreement', value: 'agreement'},
                  {title: 'Photo', value: 'photo'},
                  {title: 'General Document', value: 'general'},
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'file',
              title: 'File',
              type: 'file',
              description: 'Upload PDF, PNG, or JPG file',
              options: {
                accept: '.pdf,.png,.jpg,.jpeg',
              },
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'title',
              type: 'type',
              file: 'file.asset.originalFilename',
            },
            prepare({title, type, file}) {
              return {
                title: title || 'Untitled Document',
                subtitle: `${type || 'Unknown type'} • ${file || 'No file'}`,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      readOnly: true,
      description: 'Automatically updates when status changes',
    }),
    defineField({
      name: 'archivedAt',
      title: 'Archived At',
      type: 'datetime',
      readOnly: true,
      description: 'Automatically set when job is archived (30 days after creation)',
    }),
  ],
  preview: {
    select: {
      code: 'code',
      customerName: 'customerName',
      status: 'status',
      vehicle: 'vehicle',
    },
    prepare({code, customerName, status, vehicle}) {
      const vehicleInfo = vehicle?.make && vehicle?.model
        ? `${vehicle.make} ${vehicle.model}`
        : 'No vehicle info'

      return {
        title: `Job ${code}`,
        subtitle: customerName
          ? `${customerName} • ${vehicleInfo} • ${status}`
          : `${vehicleInfo} • ${status}`,
      }
    },
  },
})
