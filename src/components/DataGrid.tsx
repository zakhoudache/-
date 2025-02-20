import React from "react";
import HistoricalCard from "./HistoricalCard";

interface DataGridProps {
  items?: Array<{
    id: string;
    title: string;
    description: string;
    type: "character" | "term" | "event";
    importance: "high" | "medium" | "low";
    year: string;
  }>;
}

const DataGrid = ({
  items = [
    {
      id: "1",
      title: "عبد القادر الجزائري",
      description: "قائد عسكري وسياسي جزائري قاد المقاومة ضد الاستعمار الفرنسي",
      type: "character",
      importance: "high",
      year: "1808-1883",
    },
    {
      id: "2",
      title: "معركة سطاوالي",
      description: "معركة تاريخية مهمة في تاريخ الجزائر",
      type: "event",
      importance: "medium",
      year: "1830",
    },
    {
      id: "3",
      title: "الباي",
      description: "لقب حاكم المقاطعة في العهد العثماني",
      type: "term",
      importance: "low",
      year: "1516-1830",
    },
  ],
}: DataGridProps) => {
  return (
    <div className="bg-transparent p-6 w-full h-full overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center">
        {items.map((item) => (
          <HistoricalCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            type={item.type}
            importance={item.importance}
            year={item.year}
            isEditable={true}
          />
        ))}
      </div>
    </div>
  );
};

export default DataGrid;
