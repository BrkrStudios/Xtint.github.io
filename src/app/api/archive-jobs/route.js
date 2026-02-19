import { client } from '@/lib/sanity/client'

/**
 * Archive jobs older than 30 days
 * This endpoint should be called via a cron job (e.g., Vercel Cron or external service)
 */
export async function GET(request) {
  try {
    // Verify the request is from a cron job (optional: add authentication)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Calculate the date 30 days ago
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const cutoffDate = thirtyDaysAgo.toISOString()

    // Find all jobs created more than 30 days ago that are not already archived
    const query = `*[_type == "job" && _createdAt < $cutoffDate && !defined(archivedAt)]{ _id, code, _createdAt }`
    const jobsToArchive = await client.fetch(query, { cutoffDate })

    if (jobsToArchive.length === 0) {
      return Response.json({
        success: true,
        message: 'No jobs to archive',
        archived: 0
      })
    }

    // Archive each job by setting archivedAt timestamp
    const archivePromises = jobsToArchive.map((job) =>
      client
        .patch(job._id)
        .set({ archivedAt: new Date().toISOString() })
        .commit()
    )

    await Promise.all(archivePromises)

    return Response.json({
      success: true,
      message: `Successfully archived ${jobsToArchive.length} job(s)`,
      archived: jobsToArchive.length,
      jobs: jobsToArchive.map(j => ({ id: j._id, code: j.code, createdAt: j._createdAt }))
    })

  } catch (error) {
    console.error('Error archiving jobs:', error)
    return Response.json(
      { error: 'Failed to archive jobs', details: error.message },
      { status: 500 }
    )
  }
}
