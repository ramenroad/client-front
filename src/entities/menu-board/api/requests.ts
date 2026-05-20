import { apiClient, appendFiles, appendIfDefined } from '@/shared/api'
import type { DeleteMenuBoardRequest, UploadMenuBoardRequest } from '../model'

const MENU_BOARD_PATH = '/v1/ramenya/menu-board'

export const menuBoardApi = {
  upload(data: UploadMenuBoardRequest) {
    const formData = new FormData()
    appendIfDefined(formData, 'ramenyaId', data.ramenyaId)
    appendIfDefined(formData, 'description', data.description)
    appendFiles(formData, 'menuBoardImages', data.menuBoardImages)

    return apiClient.post<void>(MENU_BOARD_PATH, formData)
  },

  delete(data: DeleteMenuBoardRequest) {
    return apiClient.delete<void>(MENU_BOARD_PATH, { data })
  },
}
