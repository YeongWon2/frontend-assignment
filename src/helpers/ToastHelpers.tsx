import ActionButtonToast from '@/components/molecules/ActionButtonToast';
import { BaseToastProps } from 'react-native-toast-message';

export const toastConfig = {
  action: (props: BaseToastProps) => <ActionButtonToast {...props} />,
};
