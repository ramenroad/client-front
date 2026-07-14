import { useEffect, useMemo } from 'react'
import { useAppParams, useScreenScroll } from '@/shared/navigation'
import { useRamenyaGroupQuery } from '@/entities/curation/api'

export const useGroupPage = () => {
  const scrollScreen = useScreenScroll()
  const { id = '' } = useAppParams()
  const { ramenyaGroupQuery } = useRamenyaGroupQuery()

  useEffect(() => {
    scrollScreen()
  }, [id, scrollScreen])

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
