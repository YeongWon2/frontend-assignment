import React from 'react';
import ActiveUploadButton from '@/assets/svg/active_upload_button.svg';
import DisabledUploadButton from '@/assets/svg/disabled_upload_button.svg';

interface IUploadButtonProps {
  disabled?: boolean;
}

function UploadButton({ disabled }: IUploadButtonProps) {
  return !disabled ? <ActiveUploadButton /> : <DisabledUploadButton />;
}

export default UploadButton;
