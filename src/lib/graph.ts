import { HistoricalItem } from "./types";
import { Node, Edge } from "reactflow";

const typeColors = {
  character: { bg: "#93c5fd", border: "#60a5fa", text: "#1e40af" },
  term: { bg: "#d8b4fe", border: "#c084fc", text: "#6b21a8" },
  event: { bg: "#fdba74", border: "#fb923c", text: "#9a3412" },
};

export const generateGraphData = (items: HistoricalItem[]) => {
  const nodes: Node[] = items.map((item, index) => ({
    id: item.id,
    type: "default",
    data: { label: item.title },
    position: { x: 100 + index * 200, y: 100 + index * 100 },
    style: {
      background: typeColors[item.type].bg,
      color: typeColors[item.type].text,
      border: `1px solid ${typeColors[item.type].border}`,
      borderRadius: "8px",
      padding: "10px",
      width: 180,
      textAlign: "center",
    },
  }));

  const edges: Edge[] = items.flatMap((item) =>
    (item.relationships || []).map((rel) => ({
      id: `e${item.id}-${rel.targetId}`,
      source: item.id,
      target: rel.targetId,
      animated: true,
      style: { stroke: "#94a3b8" },
      label: rel.description,
    })),
  );

  return { nodes, edges };
};
