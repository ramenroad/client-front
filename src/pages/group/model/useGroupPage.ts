import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useRamenyaGroupQuery } from '@/entities/curation/api'

export const useGroupPage = () => {
  const { id = '' } = useParams()
  const { ramenyaGroupQuery } = useRamenyaGroupQuery()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  const ramenyaGroup = useMemo(
    () => ramenyaGroupQuery.data?.find((group) => group._id === id),
    [id, ramenyaGroupQuery.data],
  )

  return {
    ramenyaGroup,
    ramenyaList: ramenyaGroup?.ramenyas,
    isLoading: ramenyaGroupQuery.isLoading,
    isError: ramenyaGroupQuery.isError,
  }
}
