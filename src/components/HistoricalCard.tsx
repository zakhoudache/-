import React, { useState } from "react";
import { historicalData } from "@/lib/data";
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

interface HistoricalCardProps {
  id?: string;
  title?: string;
  description?: string;
  type?: "character" | "term" | "event";
  importance?: "high" | "medium" | "low";
  year?: string;
  isEditable?: boolean;
}

const HistoricalCard = ({
  id = "1",
  title = "عبد القادر الجزائري",
  description = "قائد عسكري وسياسي جزائري قاد المقاومة ضد الاستعمار الفرنسي",
  type = "character",
  importance = "high",
  year = "1808-1883",
  isEditable = true,
}: HistoricalCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);

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
    const index = historicalData.findIndex((item) => item.id === id);
    if (index !== -1) {
      historicalData[index] = {
        ...historicalData[index],
        title: editedTitle,
        description: editedDescription,
      };

      // Save to file
      const blob = new Blob([JSON.stringify(historicalData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "historical_data.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    setIsEditing(false);
  };

  return (
    <Card className="w-[340px] h-[280px] bg-card/90 hover:bg-card hover:shadow-xl transition-all duration-300 border border-border/50">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <Badge variant="secondary" className={typeColors[type]}>
              {type}
            </Badge>
            <Badge variant="secondary" className={importanceColors[importance]}>
              {importance}
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
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="font-bold text-lg"
          />
        ) : (
          <CardTitle className="text-right">{editedTitle}</CardTitle>
        )}
        <CardDescription className="text-right">{year}</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="text-right"
            rows={3}
          />
        ) : (
          <p className="text-right">{editedDescription}</p>
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
