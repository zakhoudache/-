import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import DataEntryForm from "./DataEntryForm";
import { HistoricalItem } from "@/lib/types";
import { historicalData } from "@/lib/data";
import { v4 as uuidv4 } from "uuid";

interface ContentTabsProps {
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

const ContentTabs = ({
  activeTab = "characters",
  onTabChange = () => {},
}: ContentTabsProps) => {
  const onSaveItem = (item: Omit<HistoricalItem, "id">) => {
    const newItem: HistoricalItem = {
      ...item,
      id: uuidv4(),
      relationships: [],
    };

    // Add to historicalData
    historicalData.push(newItem);

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
  };
  return (
    <Card className="w-full bg-white p-4">
      <Tabs
        defaultValue={activeTab}
        onValueChange={onTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="characters" className="text-lg">
            الشخصيات
          </TabsTrigger>
          <TabsTrigger value="terms" className="text-lg">
            المصطلحات
          </TabsTrigger>
          <TabsTrigger value="events" className="text-lg">
            الأحداث
          </TabsTrigger>
        </TabsList>

        <TabsContent value="characters" className="mt-2">
          <div className="text-right p-4 space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">الشخصيات التاريخية</h3>
              <p className="text-gray-600">
                استكشف الشخصيات التاريخية المهمة في التاريخ الجزائري
              </p>
            </div>
            <DataEntryForm onSave={onSaveItem} />
          </div>
        </TabsContent>

        <TabsContent value="terms" className="mt-2">
          <div className="text-right p-4 space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                المصطلحات التاريخية
              </h3>
              <p className="text-gray-600">
                تعرف على المصطلحات والمفاهيم الأساسية
              </p>
            </div>
            <DataEntryForm onSave={onSaveItem} />
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-2">
          <div className="text-right p-4 space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">الأحداث التاريخية</h3>
              <p className="text-gray-600">
                اكتشف الأحداث المهمة التي شكلت تاريخ الجزائر
              </p>
            </div>
            <DataEntryForm onSave={onSaveItem} />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ContentTabs;
