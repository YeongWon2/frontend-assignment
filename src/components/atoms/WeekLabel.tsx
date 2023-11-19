import React from 'react';
import ActiveWeekLabel from '@/assets/svg/active_week_label.svg';
import DisabledWeekLabel from '@/assets/svg/disabled_week_label.svg';

interface IWeekLabelProps {
  isActive?: boolean;
}

function WeekLabel({ isActive = false }: IWeekLabelProps) {
  return isActive ? <ActiveWeekLabel /> : <DisabledWeekLabel />;
}

export default WeekLabel;
