import React from 'react';
import ActiveChecked from '@/assets/svg/active_check.svg';
import DisabledChecked from '@/assets/svg/disabled_check.svg';

interface ICheckedIconProps {
  checked?: boolean;
}

function CheckedIcon({ checked }: ICheckedIconProps) {
  return checked ? <ActiveChecked /> : <DisabledChecked />;
}

export default CheckedIcon;
