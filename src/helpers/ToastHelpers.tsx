import { BaseToastProps } from 'react-native-toast-message';
import UndoButtonToast from '@/components/molecules/UndoButtonToast';

export const toastConfig = {
  action: (props: BaseToastProps) => <UndoButtonToast {...props} />,
};
