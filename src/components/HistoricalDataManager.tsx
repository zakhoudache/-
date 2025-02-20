import React, { useState } from "react";
import AITextInput from "./AITextInput";
import ContentTabs from "./ContentTabs";
import { HistoricalItem } from "./types";
import { v4 as uuidv4 } from "uuid";

const HistoricalDataManager = () => {
  const [historicalData, setHistoricalData] = useState<HistoricalItem[]>([]);
  const [activeTab, setActiveTab] = useState("characters");

  const handleExtractedData = (data: {
    characters: Array<{
      title: string;
      description: string;
      year: string;
      connections: Array<{ target: string; relationship: string }>;
    }>;
    events: Array<{
      title: string;
      description: string;
      year: string;
      connections: Array<{ target: string; relationship: string }>;
    }>;
    terms: Array<{
      title: string;
      description: string;
      year: string;
      connections: Array<{ target: string; relationship: string }>;
    }>;
  }) => {
    // Convert the AI extracted data to HistoricalItem format
    const newHistoricalData: HistoricalItem[] = [
      ...data.characters.map((char) => ({
        id: uuidv4(),
        title: char.title,
        description: char.description,
        year: char.year,
        type: "character",
        importance: "medium", // Default value
        relationships: char.connections.map((conn) => ({
          targetId: findOrCreateTargetId(conn.target),
          description: conn.relationship,
        })),
      })),
      ...data.events.map((event) => ({
        id: uuidv4(),
        title: event.title,
        description: event.description,
        year: event.year,
        type: "event",
        importance: "medium", // Default value
        relationships: event.connections.map((conn) => ({
          targetId: findOrCreateTargetId(conn.target),
          description: conn.relationship,
        })),
      })),
      ...data.terms.map((term) => ({
        id: uuidv4(),
        title: term.title,
        description: term.description,
        year: term.year,
        type: "term",
        importance: "medium", // Default value
        relationships: term.connections.map((conn) => ({
          targetId: findOrCreateTargetId(conn.target),
          description: conn.relationship,
        })),
      })),
    ];

    setHistoricalData(newHistoricalData);
  };

  // Helper function to find or create IDs for relationship targets
  const findOrCreateTargetId = (targetTitle: string): string => {
    const existingItem = historicalData.find(
      (item) => item.title === targetTitle,
    );
    return existingItem ? existingItem.id : uuidv4();
  };

  const handleSaveItem = (item: Omit<HistoricalItem, "id">) => {
    const newItem: HistoricalItem = {
      ...item,
      id: uuidv4(),
      relationships: [],
    };
    setHistoricalData([...historicalData, newItem]);
  };

  return (
    <div className="space-y-6">
      <AITextInput onExtractedData={handleExtractedData} />
      <ContentTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        historicalData={historicalData}
        onSaveItem={handleSaveItem}
      />
    </div>
  );
};

export default HistoricalDataManager;
