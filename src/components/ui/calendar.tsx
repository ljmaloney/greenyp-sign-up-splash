import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4 sm:gap-6",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 pb-2 relative items-center h-9",
        caption_label: "inline-flex items-center gap-1 text-sm font-semibold text-foreground px-2 py-1 rounded-md pointer-events-none",
        dropdowns: "flex items-center gap-2",
        dropdown_root: "relative inline-flex items-center rounded-md hover:bg-accent transition-colors",
        dropdown:
          "absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer appearance-none bg-transparent border-0",
        nav: "flex items-center justify-between absolute inset-x-0 top-1 px-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-9 font-medium text-[0.75rem] uppercase tracking-wide",
        week: "flex w-full mt-1",
        day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent/40 [&:has(.day-range-start)]:rounded-l-md [&:has(.day-range-end)]:rounded-r-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md"
        ),
        range_start:
          "day-range-start rounded-l-md [&>button]:bg-accent-foreground [&>button]:text-white [&>button]:hover:bg-accent-foreground [&>button]:hover:text-white",
        range_end:
          "day-range-end rounded-r-md [&>button]:bg-accent-foreground [&>button]:text-white [&>button]:hover:bg-accent-foreground [&>button]:hover:text-white",
        range_middle:
          "bg-accent [&>button]:bg-transparent [&>button]:text-accent-foreground [&>button]:hover:bg-accent [&>button]:hover:text-accent-foreground",
        selected:
          "[&>button]:bg-accent-foreground [&>button]:text-white [&>button]:hover:bg-accent-foreground [&>button]:hover:text-white",
        today:
          "[&>button]:border [&>button]:border-accent-foreground [&>button]:text-foreground [&>button]:font-semibold",
        outside:
          "day-outside text-muted-foreground opacity-40 aria-selected:bg-accent/30 aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-40",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }: any) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
