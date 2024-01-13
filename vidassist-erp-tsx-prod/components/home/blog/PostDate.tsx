import cn from "@/lib/cn";
import { format, parseISO } from "date-fns";

export default function PostDate({
  timeString,
  className,
}: {
  timeString: string;
  className?: string;
}) {
  return (
    <span className={cn("text-gray-500", className)}>
      {format(parseISO(timeString), "d MMMM yyyy")}
    </span>
  );
}
