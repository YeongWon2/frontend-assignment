import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontStyle } from '@/helpers/StylesHelpers';
import ProgressBar from '@/components/atoms/ProgressBar';

interface ITeskProgressBarProps {
  width?: number;
  totalCount?: number;
  progressing?: number;
}

function TeskProgressBar({ width, totalCount = 0, progressing = 0 }: ITeskProgressBarProps) {
  const progress = totalCount > 0 ? (progressing / totalCount) * 100 : 0;
  const normalizedProgress = progress * 0.01;

  const title = `${progressing} of ${totalCount} completed`;

  return (
    <View>
      <View style={styles.TeskContentsStyle}>
        <Text style={styles.TitleStyle}>{title}</Text>
        <Text style={styles.PercentStyle}>{progress}%</Text>
      </View>
      <ProgressBar width={width} progress={normalizedProgress} />
    </View>
  );
}

export default memo(TeskProgressBar);

const styles = StyleSheet.create({
  TeskContentsStyle: {
    flexDirection: 'row',
    marginBottom: 18,
    alignItems: 'center',
  },
  TitleStyle: {
    ...fontStyle.NotoSans16,
    color: '#333',
    flexGrow: 1,
  },
  PercentStyle: {
    ...fontStyle.NotoSans14,
    fontWeight: '700',
    color: '#0BB',
  },
});
