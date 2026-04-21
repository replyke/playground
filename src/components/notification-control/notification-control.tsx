import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppNotifications, AppNotification } from "@replyke/react-js";
import { CheckCheck } from "lucide-react";
type NotificationTemplates = AppNotification.NotificationTemplates;
type PotentiallyPopulatedUnifiedAppNotification = AppNotification.PotentiallyPopulatedUnifiedAppNotification;
import NotificationList from "./notification-list";
import NotificationTrigger from "./notification-trigger";

interface DropdownPosition {
  position: "absolute" | "fixed";
  top: string | number;
  right: string | number;
  left: string | number;
  marginTop: string;
}

interface NotificationControlProps {
  notificationTemplates?: Partial<NotificationTemplates>;
  theme?: "auto" | "light" | "dark";
}

function NotificationControl({ notificationTemplates, theme = "auto" }: NotificationControlProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    position: "absolute",
    top: "100%",
    right: 0,
    left: "auto",
    marginTop: "8px",
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const {
    appNotifications,
    unreadAppNotificationsCount,
    loading,
    hasMore,
    loadMore,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useAppNotifications({
    limit: 10,
    notificationTemplates,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      if (isOpen) {
        const position = calculateDropdownPosition();
        setDropdownPosition(position);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  const calculateDropdownPosition = (): DropdownPosition => {
    if (!triggerRef.current) {
      return {
        position: "absolute",
        top: "100%",
        right: 0,
        left: "auto",
        marginTop: "8px",
      };
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const dropdownWidth = Math.min(
      400,
      viewportWidth <= 768 ? viewportWidth - 32 : 400
    );
    const padding = 16;

    if (viewportWidth <= 768) {
      const triggerBottom = triggerRect.bottom;
      const triggerRight = triggerRect.right;

      let leftPosition = triggerRight - dropdownWidth;

      if (leftPosition < padding) {
        leftPosition = padding;
      }

      if (leftPosition + dropdownWidth > viewportWidth - padding) {
        leftPosition = viewportWidth - dropdownWidth - padding;
      }

      return {
        position: "fixed",
        top: (triggerBottom + 8) + "px",
        left: leftPosition + "px",
        right: "auto",
        marginTop: "0px",
      };
    }

    const triggerRight = triggerRect.right;
    const triggerLeft = triggerRect.left;

    const wouldOverflowRight = triggerRight + padding > viewportWidth;

    if (wouldOverflowRight || triggerRight - dropdownWidth < padding) {
      if (triggerLeft + dropdownWidth + padding <= viewportWidth) {
        return {
          position: "absolute",
          top: "100%",
          right: "auto",
          left: 0,
          marginTop: "8px",
        };
      } else {
        const maxLeft = viewportWidth - dropdownWidth - padding;
        const idealLeft = Math.max(
          padding,
          Math.min(maxLeft, triggerRight - dropdownWidth)
        );

        return {
          position: "fixed",
          top: (triggerRect.bottom + 8) + "px",
          left: idealLeft + "px",
          right: "auto",
          marginTop: "0px",
        };
      }
    }

    return {
      position: "absolute",
      top: "100%",
      right: 0,
      left: "auto",
      marginTop: "8px",
    };
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead({ notificationId });
  };

  const handleNotificationClick = (notification: PotentiallyPopulatedUnifiedAppNotification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    const meta = notification.metadata as Record<string, string>;

    switch (notification.type) {
      case "entity-upvote":
        navigate("/e/" + meta.entityShortId);
        break;
      case "entity-mention":
        navigate("/e/" + meta.entityShortId);
        break;
      case "entity-comment":
        navigate("/e/" + meta.entityShortId + "/?commentId=" + meta.commentId);
        break;
      case "comment-upvote":
        navigate("/e/" + meta.entityShortId + "/?commentId=" + meta.commentId);
        break;
      case "comment-mention":
        navigate("/e/" + meta.entityShortId + "/?commentId=" + meta.commentId);
        break;
      case "comment-reply":
        navigate("/e/" + meta.entityShortId + "/?commentId=" + meta.commentId);
        break;
      case "new-follow":
        navigate("/u/" + meta.initiatorId);
        break;
    }
  };

  const isDarkTheme =
    theme === "auto"
      ? typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-color-scheme: dark)").matches
      : theme === "dark";

  const colors = {
    background: isDarkTheme ? "oklch(0.205 0 0)" : "#ffffff",
    border: isDarkTheme ? "oklch(1 0 0 / 10%)" : "#e5e7eb",
    text: isDarkTheme ? "oklch(0.985 0 0)" : "#0f172a",
    textMuted: isDarkTheme ? "oklch(0.708 0 0)" : "#64748b",
    separator: isDarkTheme ? "oklch(1 0 0 / 10%)" : "#f1f5f9",
  };

  const dropdownStyle: React.CSSProperties = {
    position: dropdownPosition.position,
    top: dropdownPosition.top,
    right: dropdownPosition.right,
    left: dropdownPosition.left,
    marginTop: dropdownPosition.marginTop,
    width:
      typeof window !== "undefined" && window.innerWidth <= 768
        ? Math.min(400, window.innerWidth - 32) + "px"
        : "400px",
    backgroundColor: colors.background,
    borderColor: colors.border,
  };

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onClick={() => {
          if (!isOpen) {
            const position = calculateDropdownPosition();
            setDropdownPosition(position);
          }
          setIsOpen(!isOpen);
        }}
        className="cursor-pointer"
      >
        <NotificationTrigger unreadCount={unreadAppNotificationsCount} />
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="rounded-[10px] shadow-xl z-[60] p-0 border"
          style={dropdownStyle}
        >
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <h2 className="text-sm font-semibold m-0" style={{ color: colors.text }}>
              Notifications
              {unreadAppNotificationsCount > 0 && (
                <span className="ml-2 text-xs" style={{ color: colors.textMuted }}>
                  ({unreadAppNotificationsCount} new)
                </span>
              )}
            </h2>

            {unreadAppNotificationsCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="bg-transparent border-none p-1 text-xs cursor-pointer rounded flex items-center transition-colors duration-200 hover:opacity-80"
                style={{ color: colors.textMuted }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.textMuted;
                }}
              >
                <CheckCheck className="w-3 h-3 mr-1" />
                Mark all read
              </button>
            )}
          </div>

          <div className="h-px mx-4" style={{ backgroundColor: colors.separator }} />

          <div className="max-h-[500px]">
            <NotificationList
              notifications={appNotifications}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={loadMore}
              onNotificationClick={handleNotificationClick}
              isDarkTheme={isDarkTheme}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationControl;
