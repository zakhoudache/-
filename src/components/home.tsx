import React, { useState, useMemo } from "react";
import DashboardHeader from "./DashboardHeader";
import ContentTabs from "./ContentTabs";
import DataGrid from "./DataGrid";
import RelationshipGraph from "./RelationshipGraph";
import DetailPanel from "./DetailPanel";
import TimelineView from "./TimelineView";
import { historicalData } from "@/lib/data";
import { generateGraphData } from "@/lib/graph";
import { HistoricalItem } from "./lib/types";

const Home = () => {
  const [activeTab, setActiveTab] = useState("characters");
  const [searchQuery, setSearchQuery] = useState("");
  const [importanceFilter, setImportanceFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<
    HistoricalItem | undefined
  >();

  const filteredItems = useMemo(() => {
    return historicalData.filter((item) => {
      const matchesTab = activeTab === item.type + "s";
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesImportance =
        importanceFilter === "all" || item.importance === importanceFilter;

      return matchesTab && matchesSearch && matchesImportance;
    });
  }, [activeTab, searchQuery, importanceFilter]);

  const { nodes, edges } = useMemo(
    () => generateGraphData(filteredItems),
    [filteredItems],
  );

  const relatedItems = useMemo(() => {
    if (!selectedItem?.relationships) return [];
    return selectedItem.relationships
      .map((rel) => historicalData.find((item) => item.id === rel.targetId))
      .filter((item): item is HistoricalItem => item !== undefined);
  }, [selectedItem]);

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader
        onSearch={setSearchQuery}
        onImportanceFilter={setImportanceFilter}
      />
      <div className="container mx-auto px-4 py-6">
        <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-6 space-y-6">
          <TimelineView items={filteredItems} onItemClick={setSelectedItem} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="w-full space-y-6">
              <DataGrid items={filteredItems} />
            </div>
            <div className="w-full space-y-6">
              <RelationshipGraph
                nodes={nodes}
                edges={edges}
                onNodeClick={(node) => {
                  const item = filteredItems.find((i) => i.id === node.id);
                  setSelectedItem(item);
                }}
                onEdgeClick={(edge) => {
                  console.log("Relationship:", edge);
                }}
              />
              {selectedItem && (
                <DetailPanel item={selectedItem} relatedItems={relatedItems} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
