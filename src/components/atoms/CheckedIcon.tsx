import React from 'react';
import ActiveChecked from '@/assets/svg/active_check.svg';
import DisabledChecked from '@/assets/svg/disabled_check.svg';

interface ICheckedIconProps {
  isActive?: boolean;
}

function CheckedIcon({ isActive }: ICheckedIconProps) {
  return isActive ? <ActiveChecked /> : <DisabledChecked />;
}

export default CheckedIcon;
