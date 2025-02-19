export interface HistoricalItem {
  id: string;
  title: string;
  description: string;
  type: "character" | "term" | "event";
  importance: "high" | "medium" | "low";
  year: string;
  relationships?: Array<{
    targetId: string;
    description: string;
  }>;
}
