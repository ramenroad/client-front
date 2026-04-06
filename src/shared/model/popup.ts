export enum PopupType {
  FILTER = "FILTER",
  SORT = "SORT",
  CONFIRM = "CONFIRM",
  IFRAME = "IFRAME",
}

export interface ModalProps {
  onClose: () => void;
}
