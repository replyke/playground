import { Loader2, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { AppNotification } from "@replyke/react-js";
type PotentiallyPopulatedUnifiedAppNotification = AppNotification.PotentiallyPopulatedUnifiedAppNotification;
import NotificationItem from "./notification-item";

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
  popover: isDark ? "oklch(0.205 0 0)" : "#ffffff",
  popoverForeground: isDark ? "oklch(0.985 0 0)" : "#0f172a",
});

interface NotificationSkeletonProps {
  isDarkTheme: boolean;
}

function NotificationSkeleton({ isDarkTheme }: NotificationSkeletonProps) {
  const colors = getColors(isDarkTheme);

  return (
    <div className="flex gap-3 p-3">
      <div
        className="w-8 h-8 rounded-full flex-shrink-0 animate-pulse"
        style={{ backgroundColor: colors.muted }}
      />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3 rounded w-3/4 animate-pulse" style={{ backgroundColor: colors.muted }} />
        <div className="h-2 rounded w-1/2 animate-pulse" style={{ backgroundColor: colors.muted }} />
        <div className="h-2 rounded w-1/4 animate-pulse" style={{ backgroundColor: colors.muted }} />
      </div>
      <div
        className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5 animate-pulse"
        style={{ backgroundColor: colors.muted }}
      />
    </div>
  );
}

interface EmptyStateProps {
  isDarkTheme: boolean;
}

function EmptyState({ isDarkTheme }: EmptyStateProps) {
  const colors = getColors(isDarkTheme);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: colors.muted }}
      >
        <Bell className="w-8 h-8" style={{ color: colors.mutedForeground }} />
      </div>
      <h3 className="text-sm font-medium mb-2 m-0" style={{ color: colors.foreground }}>
        No notifications yet
      </h3>
      <p className="text-xs max-w-[200px] leading-6 m-0" style={{ color: colors.mutedForeground }}>
        When you get new comments, mentions, or follows, they'll appear here.
      </p>
    </motion.div>
  );
}

interface LoadingStateProps {
  isDarkTheme: boolean;
}

function LoadingState({ isDarkTheme }: LoadingStateProps) {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <NotificationSkeleton key={i} isDarkTheme={isDarkTheme} />
      ))}
    </div>
  );
}

interface NotificationListProps {
  notifications: PotentiallyPopulatedUnifiedAppNotification[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onNotificationClick: (notification: PotentiallyPopulatedUnifiedAppNotification) => void;
  isDarkTheme: boolean;
}

function NotificationList({
  notifications,
  loading,
  hasMore,
  onLoadMore,
  onNotificationClick,
  isDarkTheme,
}: NotificationListProps) {
  const colors = getColors(isDarkTheme);

  if (loading && notifications.length === 0) {
    return <LoadingState isDarkTheme={isDarkTheme} />;
  }

  if (!loading && notifications.length === 0) {
    return <EmptyState isDarkTheme={isDarkTheme} />;
  }

  return (
    <div className="flex flex-col h-full max-h-[400px]">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col gap-1 p-1">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <NotificationItem
                notification={notification}
                onNotificationClick={onNotificationClick}
                isDarkTheme={isDarkTheme}
              />
              {index < notifications.length - 1 && (
                <div
                  className="h-px mx-3"
                  style={{ backgroundColor: colors.border }}
                />
              )}
            </motion.div>
          ))}

          {(hasMore || loading) && (
            <div className="p-3">
              <div className="h-px mb-3" style={{ backgroundColor: colors.border }} />
              {loading ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="w-4 h-4 animate-spin" style={{ color: colors.mutedForeground }} />
                  <span className="ml-2 text-sm" style={{ color: colors.mutedForeground }}>
                    Loading more...
                  </span>
                </div>
              ) : (
                <button
                  onClick={onLoadMore}
                  className="w-full bg-transparent border-none p-2 text-sm cursor-pointer rounded transition-colors duration-200 hover:opacity-80"
                  style={{ color: colors.mutedForeground }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.foreground;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.mutedForeground;
                  }}
                >
                  Load more notifications
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationList;
