import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import DataEntryForm from "./DataEntryForm";
import { HistoricalItem } from "@/lib/types";

interface ContentTabsProps {
  activeTab?: string;
  onTabChange?: (value: string) => void;
  historicalData?: HistoricalItem[];
  onSaveItem?: (item: Omit<HistoricalItem, "id">) => void;
}

const ContentTabs = ({
  activeTab = "characters",
  onTabChange = () => {},
  historicalData = [], // Receive the data as a prop
  onSaveItem = () => {},
}: ContentTabsProps) => {
  const filteredData = (type: string) => {
    if (!Array.isArray(historicalData)) return [];
    return historicalData.filter((item) => item?.type === type) || [];
  };

  return (
    <Card className="w-full bg-card/90 backdrop-blur-sm p-4 shadow-sm border border-border/50">
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
            <div className="space-y-4">
              {filteredData("character").map((item) => (
                <div key={item.id} className="p-4 border rounded">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p>{item.description}</p>
                  <p className="text-sm text-gray-600">{item.year}</p>
                </div>
              ))}
            </div>
            <DataEntryForm
              onSave={onSaveItem}
              historicalData={historicalData}
            />
          </div>
        </TabsContent>
        {/* Similar updates for terms and events tabs */}
      </Tabs>
    </Card>
  );
};

export default ContentTabs;
