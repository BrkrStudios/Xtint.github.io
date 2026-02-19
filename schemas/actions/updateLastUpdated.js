import {useEffect} from 'react'
import {useFormValue} from 'sanity'

export function UpdateLastUpdatedAction(props) {
  const status = useFormValue(['status'])
  const lastUpdated = useFormValue(['lastUpdated'])

  useEffect(() => {
    // Only auto-update if status is NOT 'awaiting-dropoff'
    if (status && status !== 'awaiting-dropoff') {
      // Check if we need to update
      const now = new Date().toISOString()

      // If lastUpdated is empty or status changed, update it
      if (!lastUpdated) {
        props.onComplete()
      }
    }
  }, [status, lastUpdated, props])

  return props.renderDefault(props)
}
