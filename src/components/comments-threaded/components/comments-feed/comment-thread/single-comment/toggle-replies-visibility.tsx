import { cn } from "@/lib/utils";

interface ToggleRepliesVisibilityProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

function ToggleRepliesVisibility({
  isCollapsed,
  onToggleCollapse,
}: ToggleRepliesVisibilityProps) {
  return (
    <button
      onClick={onToggleCollapse}
      className={cn(
        "ml-1 w-4 h-4",
        "flex items-center justify-center",
        "text-gray-500 dark:text-gray-400",
        "bg-gray-50 dark:bg-gray-700",
        "rounded-sm",
        "transition-all duration-150",
        "text-sm font-bold",
        "cursor-pointer",
        "hover:text-gray-700 dark:hover:text-gray-300",
        "hover:bg-gray-200 dark:hover:bg-gray-600",
        isCollapsed && "border border-gray-300 dark:border-gray-500"
      )}
      title={isCollapsed ? "Expand thread" : "Collapse thread"}
    >
      {isCollapsed ? "+" : "−"}
    </button>
  );
}

export default ToggleRepliesVisibility;
