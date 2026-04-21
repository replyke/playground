import { Bell } from "lucide-react";

interface NotificationTriggerProps {
  unreadCount: number;
}

const NotificationTrigger = ({ unreadCount }: NotificationTriggerProps) => {
  return (
    <button
      className="flex items-center text-gray-600 hover:text-blue-600 group cursor-pointer relative border border-blue-200 p-2 rounded-lg hover:bg-blue-50 transition-all"
      aria-label={"Notifications" + (
        unreadCount > 0 ? " (" + unreadCount + " unread)" : ""
      )}
    >
      <div className="group-hover:text-blue-600">
        <Bell size={14} />
      </div>

      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center border-2 border-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </div>
      )}
    </button>
  );
};

NotificationTrigger.displayName = "NotificationTrigger";

export default NotificationTrigger;
