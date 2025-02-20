import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Pencil, Save, X } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { HistoricalItem } from "@/lib/types";

interface HistoricalCardProps {
  item: HistoricalItem;
  isEditable?: boolean;
  onUpdate?: (updatedItem: HistoricalItem) => void;
}

const HistoricalCard = ({
  item,
  isEditable = true,
  onUpdate,
}: HistoricalCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

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

  const handleSave = () => {
    if (onUpdate && item) {
      onUpdate({
        ...item,
        title: item.title,
        description: item.description,
      });
    }
    setIsEditing(false);
  };

  return (
    <Card className="w-[340px] h-[280px] bg-card/90 hover:bg-card hover:shadow-xl transition-all duration-300 border border-border/50">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
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
          {isEditable && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <X className="h-4 w-4" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        {isEditing ? (
          <Input
            value={item.title}
            onChange={(e) => {
              item.title = e.target.value;
            }}
            className="font-bold text-lg"
          />
        ) : (
          <CardTitle className="text-right">{item.title}</CardTitle>
        )}
        <CardDescription className="text-right">{item.year}</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={item.description}
            onChange={(e) => {
              item.description = e.target.value;
            }}
            className="text-right"
            rows={3}
          />
        ) : (
          <p className="text-right">{item.description}</p>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter className="justify-end">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default HistoricalCard;
