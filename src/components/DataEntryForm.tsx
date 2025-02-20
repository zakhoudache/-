import React, { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { HistoricalItem } from "@/lib/types";

interface DataEntryFormProps {
  onSave: (item: Omit<HistoricalItem, "id">) => void;
  historicalData?: HistoricalItem[]; // Receive historicalData as a prop
}

const DataEntryForm = ({ onSave, historicalData = [] }: DataEntryFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "character",
    importance: "medium",
    year: "",
    relationships: [] as Array<{ targetId: string; description: string }>,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      title: "",
      description: "",
      type: "character",
      importance: "medium",
      year: "",
    });
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... (rest of the form elements) ... */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-right">العلاقات</label>
            {formData.relationships.map((rel, index) => (
              <div key={index} className="flex gap-2 items-start">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const newRels = [...formData.relationships];
                    newRels.splice(index, 1);
                    setFormData({ ...formData, relationships: newRels });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Select
                  value={rel.targetId}
                  onValueChange={(value) => {
                    const newRels = [...formData.relationships];
                    newRels[index].targetId = value;
                    setFormData({ ...formData, relationships: newRels });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {historicalData.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={rel.description}
                  onChange={(e) => {
                    const newRels = [...formData.relationships];
                    newRels[index].description = e.target.value;
                    setFormData({ ...formData, relationships: newRels });
                  }}
                  placeholder="وصف العلاقة"
                  className="text-right"
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  ...formData,
                  relationships: [
                    ...formData.relationships,
                    { targetId: "", description: "" },
                  ],
                });
              }}
              className="w-full"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة علاقة
            </Button>
          </div>
          <div className="flex justify-end">
            <Button type="submit">إضافة</Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default DataEntryForm;
