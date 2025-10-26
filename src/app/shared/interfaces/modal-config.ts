export interface ModalConfig {
  icon: string;
  title: string;
  message: string | string[];
  onClose: () => void;
  onConfirm?: () => void;
}
