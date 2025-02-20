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
import { v4 as uuidv4 } from "uuid";
import AITextInput from "./AITextInput";

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
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <DashboardHeader
        onSearch={setSearchQuery}
        onImportanceFilter={setImportanceFilter}
      />
      <div className="container mx-auto px-4 py-6 space-y-8">
        <AITextInput
          onExtractedData={(data) => {
            // Convert AI output to HistoricalItem format
            // First create all items to get their IDs
            const itemsMap = new Map();

            const newItems = [
              ...data.characters.map((char) => {
                const id = uuidv4();
                const item = {
                  ...char,
                  id,
                  type: "character" as const,
                  importance: "medium" as const,
                  relationships: [],
                  _connections: char.connections || [], // Temporary store connections
                };
                itemsMap.set(char.title, item);
                return item;
              }),
              ...data.events.map((event) => {
                const id = uuidv4();
                const item = {
                  ...event,
                  id,
                  type: "event" as const,
                  importance: "medium" as const,
                  relationships: [],
                  _connections: event.connections || [],
                };
                itemsMap.set(event.title, item);
                return item;
              }),
              ...data.terms.map((term) => {
                const id = uuidv4();
                const item = {
                  ...term,
                  id,
                  type: "term" as const,
                  importance: "medium" as const,
                  relationships: [],
                  _connections: term.connections || [],
                };
                itemsMap.set(term.title, item);
                return item;
              }),
            ];

            // Process connections and create relationships
            newItems.forEach((item) => {
              if (item._connections) {
                item.relationships = item._connections
                  .map((conn) => {
                    const targetItem = itemsMap.get(conn.target);
                    if (targetItem) {
                      return {
                        targetId: targetItem.id,
                        description: conn.relationship,
                      };
                    }
                    return null;
                  })
                  .filter((rel) => rel !== null);
                delete item._connections;
              }
            });

            // Add new items to historicalData
            historicalData.push(...newItems);
          }}
        />
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
