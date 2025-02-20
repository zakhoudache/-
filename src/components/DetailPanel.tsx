import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { HistoricalItem } from "@/lib/types";

interface DetailPanelProps {
  item?: HistoricalItem;
  relatedItems?: HistoricalItem[];
}

const DetailPanel = ({ item, relatedItems = [] }: DetailPanelProps) => {
  if (!item) return null;

  const importanceColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  const typeColors = {
    character: "bg-blue-100 text-blue-800",
    term: "bg-purple-100 text-purple-800",
    event: "bg-orange-100 text-orange-800",
  };

  return (
    <Card className="w-full bg-card/90 backdrop-blur-sm shadow-sm border border-border/50">
      <CardHeader>
        <div className="flex gap-2 mb-2">
          <Badge variant="secondary" className={typeColors[item.type]}>
            {item.type}
          </Badge>
          <Badge
            variant="secondary"
            className={importanceColors[item.importance]}
          >
            {item.importance}
          </Badge>
        </div>
        <CardTitle className="text-right text-xl">{item.title}</CardTitle>
        <CardDescription className="text-right">{item.year}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-right mb-4">{item.description}</p>
        {relatedItems.length > 0 && (
          <div className="mt-4">
            <h4 className="text-right font-semibold mb-2">
              العلاقات التاريخية
            </h4>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="space-y-4">
                {relatedItems.map((related) => (
                  <div key={related.id} className="text-right">
                    <h5 className="font-medium">{related.title}</h5>
                    <p className="text-sm text-gray-600">
                      {related.description}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DetailPanel;
