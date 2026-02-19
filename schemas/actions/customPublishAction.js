import {useDocumentOperation} from 'sanity'
import {useState, useEffect} from 'react'

export function useCustomPublishAction(props) {
  const {patch, publish} = useDocumentOperation(props.id, props.type)
  const [isPublishing, setIsPublishing] = useState(false)

  return {
    disabled: publish.disabled,
    label: isPublishing ? 'Publishing...' : 'Publish',
    onHandle: () => {
      setIsPublishing(true)

      const {draft} = props

      // Update lastUpdated when status changes away from 'awaiting-dropoff'
      if (draft?.status && draft.status !== 'awaiting-dropoff') {
        patch.execute([
          {
            set: {
              lastUpdated: new Date().toISOString()
            }
          }
        ])
      }

      // Publish the document
      publish.execute()
      setIsPublishing(false)

      props.onComplete()
    },
  }
}
