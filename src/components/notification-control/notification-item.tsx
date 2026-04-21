import { motion } from "framer-motion";
import { formatRelativeTime, truncateText } from "./utils";
import NotificationIcon from "./notification-icon";
import { AppNotification } from "@replyke/react-js";
type PotentiallyPopulatedUnifiedAppNotification = AppNotification.PotentiallyPopulatedUnifiedAppNotification;

const getColors = (isDark = false) => ({
  background: isDark ? "oklch(0.145 0 0)" : "#ffffff",
  foreground: isDark ? "oklch(0.985 0 0)" : "#0f172a",
  muted: isDark ? "oklch(0.269 0 0)" : "#f8fafc",
  mutedForeground: isDark ? "oklch(0.708 0 0)" : "#64748b",
  border: isDark ? "oklch(1 0 0 / 10%)" : "#f1f5f9",
  accent: isDark ? "oklch(0.269 0 0)" : "#f8fafc",
  accentForeground: isDark ? "oklch(0.985 0 0)" : "#0f172a",
  primary: isDark ? "oklch(0.985 0 0)" : "#0f172a",
  primaryForeground: isDark ? "oklch(0.205 0 0)" : "#f8fafc",
  card: isDark ? "oklch(0.205 0 0)" : "#ffffff",
  cardForeground: isDark ? "oklch(0.985 0 0)" : "#0f172a",
  unreadBackground: isDark
    ? "oklch(0.269 0 0 / 0.3)"
    : "rgba(248, 250, 252, 0.8)",
  unreadBackgroundHover: isDark
    ? "oklch(0.269 0 0 / 0.5)"
    : "rgba(248, 250, 252, 0.9)",
  hoverBackground: isDark
    ? "oklch(0.269 0 0 / 0.2)"
    : "rgba(248, 250, 252, 0.7)",
});

interface NotificationAvatarProps {
  src: string | null | undefined;
  name: string;
  isDarkTheme: boolean;
}

function NotificationAvatar({ src, name, isDarkTheme }: NotificationAvatarProps) {
  const colors = getColors(isDarkTheme);

  return (
    <div className="relative flex-shrink-0">
      <div
        className="w-8 h-8 rounded-full overflow-hidden"
        style={{
          border: "1px solid " + colors.border,
          backgroundColor: colors.muted,
        }}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML =
                  "<div style=\"width: 100%; height: 100%; background-color: " +
                  colors.accent +
                  "; color: " +
                  colors.accentForeground +
                  "; font-size: 14px; font-weight: 500; display: flex; align-items: center; justify-content: center;\">" +
                  name.charAt(0).toUpperCase() +
                  "</div>";
              }
            }}
          />
        ) : (
          <div
            className="w-full h-full text-sm font-medium flex items-center justify-center"
            style={{
              backgroundColor: colors.accent,
              color: colors.accentForeground,
            }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}

interface NotificationItemProps {
  notification: PotentiallyPopulatedUnifiedAppNotification;
  onNotificationClick: (notification: PotentiallyPopulatedUnifiedAppNotification) => void;
  isDarkTheme: boolean;
}

function NotificationItem({ notification, onNotificationClick, isDarkTheme }: NotificationItemProps) {
  const colors = getColors(isDarkTheme);

  const relativeTime = formatRelativeTime(notification.createdAt);
  const truncatedContent = truncateText(notification.content || "", 80);

  const handleClick = () => {
    onNotificationClick?.(notification);
  };

  const initiatorAvatar =
    notification.type !== "system"
      ? (notification.metadata as { initiatorAvatar?: string }).initiatorAvatar
      : null;

  const systemMetadata =
    notification.type === "system"
      ? (notification.metadata as { buttonData?: { text: string; url: string } | null })
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="relative flex gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200"
      style={{
        backgroundColor: !notification.isRead
          ? colors.unreadBackground
          : "transparent",
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = !notification.isRead
          ? colors.unreadBackgroundHover
          : colors.hoverBackground;

        const titleElement = e.currentTarget.querySelector(
          "[data-notification-title]"
        ) as HTMLElement | null;
        const contentElement = e.currentTarget.querySelector(
          "[data-notification-content]"
        ) as HTMLElement | null;

        if (titleElement) titleElement.style.color = colors.foreground;
        if (contentElement) contentElement.style.color = colors.foreground;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = !notification.isRead
          ? colors.unreadBackground
          : "transparent";

        const titleElement = e.currentTarget.querySelector(
          "[data-notification-title]"
        ) as HTMLElement | null;
        const contentElement = e.currentTarget.querySelector(
          "[data-notification-content]"
        ) as HTMLElement | null;

        if (titleElement) {
          titleElement.style.color = !notification.isRead
            ? colors.foreground
            : colors.mutedForeground;
        }
        if (contentElement) {
          contentElement.style.color = colors.mutedForeground;
        }
      }}
    >
      {!notification.isRead && (
        <div className="absolute top-2 right-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: isDarkTheme ? "oklch(0.922 0 0)" : "#0f172a",
            }}
          />
        </div>
      )}

      <NotificationAvatar
        src={initiatorAvatar}
        name={"initiatorName"}
        isDarkTheme={isDarkTheme}
      />

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <p
              data-notification-title
              className={"text-sm leading-snug m-0 transition-colors duration-200 " + (
                !notification.isRead ? "font-medium" : "font-normal"
              )}
              style={{
                color: !notification.isRead
                  ? colors.foreground
                  : colors.mutedForeground,
              }}
            >
              {notification.title}
            </p>
            {truncatedContent && (
              <p
                data-notification-content
                className="text-xs leading-snug m-0 mt-0.5 transition-colors duration-200"
                style={{
                  color: colors.mutedForeground,
                }}
              >
                {truncatedContent}
              </p>
            )}
          </div>
          <div className="mt-0.5">
            <NotificationIcon
              type={notification.type}
              style={{ width: "24px", height: "24px" }}
              isDarkTheme={isDarkTheme}
            />
          </div>
        </div>

        {notification.type === "system" && systemMetadata?.buttonData && (
          <div className="mt-2 mb-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (systemMetadata.buttonData) {
                  window.open(systemMetadata.buttonData.url, "_blank");
                }
              }}
              className="border-none rounded-md py-1 px-3 text-xs font-medium cursor-pointer transition-all duration-200 inline-flex items-center justify-center hover:opacity-90"
              style={{
                backgroundColor: colors.primary,
                color: colors.primaryForeground,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDarkTheme
                  ? "oklch(0.922 0 0)"
                  : "#374151";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
              }}
            >
              {systemMetadata.buttonData.text}
            </button>
          </div>
        )}

        <div
          className="flex items-center gap-2 text-xs"
          style={{
            color: colors.mutedForeground,
          }}
        >
          <span>{relativeTime}</span>
          {!notification.isRead && (
            <span
              className="font-medium"
              style={{
                color: colors.primary,
              }}
            >
              New
            </span>
          )}
        </div>
      </div>

      <div
        className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-200 pointer-events-none"
        style={{
          background: "linear-gradient(to right, transparent, " + colors.primary + "08)",
        }}
      />
    </motion.div>
  );
}

export default NotificationItem;
