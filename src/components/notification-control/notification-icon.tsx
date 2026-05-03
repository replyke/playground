import React from "react";
import {
  MessageCircle,
  Heart,
  AtSign,
  UserPlus,
  MessageSquare,
  Wrench,
  LucideIcon,
} from "lucide-react";

interface IconThemeColors {
  light: string;
  dark: string;
}

interface BaseIconConfig {
  Icon: LucideIcon;
  color: IconThemeColors;
  backgroundColor: IconThemeColors;
}

interface ResolvedIconConfig {
  Icon: LucideIcon;
  color: string;
  backgroundColor: string;
}

const getIconConfig = (isDark = false): Record<string, ResolvedIconConfig> => {
  const baseConfig: Record<string, BaseIconConfig> = {
    system: {
      Icon: Wrench,
      color: { light: "#2563eb", dark: "#3b82f6" },
      backgroundColor: { light: "#dbeafe", dark: "rgba(59, 130, 246, 0.15)" },
    },
    "entity-comment": {
      Icon: MessageCircle,
      color: { light: "#2563eb", dark: "#3b82f6" },
      backgroundColor: { light: "#dbeafe", dark: "rgba(59, 130, 246, 0.15)" },
    },
    "comment-reply": {
      Icon: MessageSquare,
      color: { light: "#2563eb", dark: "#3b82f6" },
      backgroundColor: { light: "#dbeafe", dark: "rgba(59, 130, 246, 0.15)" },
    },
    "entity-mention": {
      Icon: AtSign,
      color: { light: "#9333ea", dark: "#a855f7" },
      backgroundColor: { light: "#ede9fe", dark: "rgba(168, 85, 247, 0.15)" },
    },
    "comment-mention": {
      Icon: AtSign,
      color: { light: "#9333ea", dark: "#a855f7" },
      backgroundColor: { light: "#ede9fe", dark: "rgba(168, 85, 247, 0.15)" },
    },
    "entity-upvote": {
      Icon: Heart,
      color: { light: "#dc2626", dark: "#ef4444" },
      backgroundColor: { light: "#fee2e2", dark: "rgba(239, 68, 68, 0.15)" },
    },
    "comment-upvote": {
      Icon: Heart,
      color: { light: "#dc2626", dark: "#ef4444" },
      backgroundColor: { light: "#fee2e2", dark: "rgba(239, 68, 68, 0.15)" },
    },
    "new-follow": {
      Icon: UserPlus,
      color: { light: "#16a34a", dark: "#22c55e" },
      backgroundColor: { light: "#dcfce7", dark: "rgba(34, 197, 94, 0.15)" },
    },
  };

  return Object.entries(baseConfig).reduce<Record<string, ResolvedIconConfig>>(
    (acc, [key, value]) => {
      acc[key] = {
        Icon: value.Icon,
        color: isDark ? value.color.dark : value.color.light,
        backgroundColor: isDark
          ? value.backgroundColor.dark
          : value.backgroundColor.light,
      };
      return acc;
    },
    {}
  );
};

interface NotificationIconProps {
  type: string;
  style?: React.CSSProperties;
  isDarkTheme: boolean;
}

function NotificationIcon({ type, style = {}, isDarkTheme }: NotificationIconProps) {
  const iconConfig = getIconConfig(isDarkTheme);
  const { Icon, color, backgroundColor } = iconConfig[type] ?? iconConfig["system"];

  return (
    <div
      className="flex items-center justify-center rounded-full p-2 flex-shrink-0"
      style={{
        backgroundColor,
        ...style,
      }}
    >
      <Icon className="w-4 h-4" style={{ color }} />
    </div>
  );
}

export default NotificationIcon;
