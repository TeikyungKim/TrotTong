import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useUserStore } from '../../store/userStore';
import { getFontSize } from '../../constants/fonts';
import type { Video } from '../../types';

interface Props {
  video: Video;
  onPress: (video: Video) => void;
  rightAction?: React.ReactNode;
  showSinger?: boolean;
  timeLabel?: string;
}

export function VideoCard({ video, onPress, rightAction, showSinger = true, timeLabel }: Props) {
  const { colors } = useTheme();
  const fontLevel = useUserStore(s => s.prefs.fontLevel);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => onPress(video)}
      activeOpacity={0.75}
    >
      <Image
        source={{ uri: video.thumbnailUrl }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text
          style={[styles.title, { color: colors.textPrimary, fontSize: getFontSize('body', fontLevel) }]}
          numberOfLines={2}
        >
          {video.title}
        </Text>
        {showSinger && (
          <Text
            style={[styles.singer, { color: colors.textSecondary, fontSize: getFontSize('caption', fontLevel) }]}
          >
            {video.singerName}
          </Text>
        )}
        {timeLabel && (
          <Text style={[styles.time, { color: colors.textMuted, fontSize: 12 }]}>
            {timeLabel}
          </Text>
        )}
      </View>
      {rightAction && (
        <View style={styles.action}>{rightAction}</View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  thumbnail: {
    width: 100,
    height: 70,
    borderRadius: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  title: {
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 3,
  },
  singer: {
    fontWeight: '400',
  },
  time: {
    marginTop: 2,
  },
  action: {
    paddingRight: 10,
  },
});
