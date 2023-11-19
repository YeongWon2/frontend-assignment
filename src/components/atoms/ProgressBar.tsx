import React from 'react';
import * as Progress from 'react-native-progress';

interface IProgressBarProps {
  width?: number;
  progress?: number;
}

function ProgressBar({ width, progress }: IProgressBarProps) {
  return (
    <Progress.Bar animated progress={progress} width={width} borderWidth={0} unfilledColor="#F6F5F8" color="#44CEC6" />
  );
}

export default ProgressBar;
