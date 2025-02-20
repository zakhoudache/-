import React from "react";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { HistoricalItem } from "@/lib/types";

interface TimelineViewProps {
  items: HistoricalItem[];
  onItemClick?: (item: HistoricalItem) => void;
}

const TimelineView = ({ items = [], onItemClick }: TimelineViewProps) => {
  const sortedItems = [...items].sort((a, b) => {
    const yearA = parseInt((a.year || "").split("-")[0] || "0");
    const yearB = parseInt((b.year || "").split("-")[0] || "0");
    return yearA - yearB;
  });

  const typeColors = {
    character: "bg-blue-100 text-blue-800",
    term: "bg-purple-100 text-purple-800",
    event: "bg-orange-100 text-orange-800",
  };

  return (
    <Card className="w-full bg-card/90 backdrop-blur-sm p-4 shadow-sm border border-border/50 relative overflow-hidden">
      <h3 className="text-xl font-semibold mb-4 text-right">الخط الزمني</h3>
      <ScrollArea className="h-[200px] w-full">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Timeline items */}
          <div className="space-y-4">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="relative pr-8 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                onClick={() => onItemClick?.(item)}
              >
                {/* Timeline dot */}
                <div className="absolute right-3 top-1/2 w-3 h-3 -mt-1.5 rounded-full bg-gray-400 border-2 border-white" />

                <div className="flex flex-col items-end gap-1">
                  <Badge variant="secondary" className={typeColors[item.type]}>
                    {item.year}
                  </Badge>
                  <h4 className="font-medium text-right">{item.title}</h4>
                  <p className="text-sm text-gray-600 text-right">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default TimelineView;
