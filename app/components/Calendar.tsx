"use client";

import { useState } from "react";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface CalendarProps {
  itemCountsByDate: Record<string, number>;
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

export function Calendar({ itemCountsByDate, selectedDate, onDateSelect }: CalendarProps) {
  const today = new Date();
  const todayStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const [viewDate, setViewDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const { year, month } = viewDate;
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array.from<null>({ length: firstDayOfWeek }).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function dateStr(day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function prevMonth() {
    setViewDate((prev) =>
      prev.month === 0
        ? { year: prev.year - 1, month: 11 }
        : { year: prev.year, month: prev.month - 1 }
    );
  }

  function nextMonth() {
    setViewDate((prev) =>
      prev.month === 11
        ? { year: prev.year + 1, month: 0 }
        : { year: prev.year, month: prev.month + 1 }
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1 rounded hover:bg-gray-100 text-gray-600"
          aria-label="Previous month"
        >
          &larr;
        </button>
        <span className="font-semibold text-gray-900">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="p-1 rounded hover:bg-gray-100 text-gray-600"
          aria-label="Next month"
        >
          &rarr;
        </button>
      </div>

      {/* Day-of-week labels */}
      <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-1">
        {DAY_LABELS.map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 text-center text-sm">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`blank-${i}`} />;
          }

          const ds = dateStr(day);
          const isToday = ds === todayStr;
          const isSelected = ds === selectedDate;
          const hasItems = (itemCountsByDate[ds] ?? 0) > 0;

          const baseCls = [
            "relative flex flex-col items-center justify-center py-1 rounded-md",
            isToday && "font-bold ring-2 ring-blue-500",
            isSelected && "bg-blue-100",
            !isToday && !isSelected && "text-gray-800",
          ]
            .filter(Boolean)
            .join(" ");

          if (hasItems) {
            return (
              <button
                key={day}
                type="button"
                onClick={() => onDateSelect(ds)}
                className={`${baseCls} cursor-pointer hover:bg-blue-50`}
              >
                {day}
                <span className="block w-1.5 h-1.5 rounded-full mt-0.5 bg-blue-500" />
              </button>
            );
          }

          return (
            <div key={day} className={baseCls}>
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
