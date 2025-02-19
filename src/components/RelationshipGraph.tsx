import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Connection,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import DataEntryForm from "./DataEntryForm";
import { v4 as uuidv4 } from "uuid";
import { historicalData } from "@/lib/data";
import { HistoricalItem } from "@/lib/types";

interface RelationshipGraphProps {
  nodes?: Node[];
  edges?: Edge[];
  onNodeClick?: (node: Node) => void;
  onEdgeClick?: (edge: Edge) => void;
}

const typeColors = {
  character: { bg: "#93c5fd", border: "#60a5fa", text: "#1e40af" },
  term: { bg: "#d8b4fe", border: "#c084fc", text: "#6b21a8" },
  event: { bg: "#fdba74", border: "#fb923c", text: "#9a3412" },
};

const RelationshipGraph = ({
  nodes = [],
  edges = [],
  onNodeClick = () => {},
  onEdgeClick = () => {},
}: RelationshipGraphProps) => {
  const [graphNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [graphEdges, setEdges, onEdgesChange] = useEdgesState(edges);
  const [isAddingNode, setIsAddingNode] = useState(false);

  useEffect(() => {
    setNodes(nodes);
    setEdges(edges);
  }, [nodes, edges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        // Find the source and target nodes
        const sourceNode = graphNodes.find((n) => n.id === params.source);
        const targetNode = graphNodes.find((n) => n.id === params.target);

        if (sourceNode && targetNode) {
          // Find the corresponding items in historicalData
          const sourceItem = historicalData.find(
            (item) => item.id === sourceNode.id,
          );
          if (sourceItem) {
            // Add the relationship
            sourceItem.relationships = sourceItem.relationships || [];
            sourceItem.relationships.push({
              targetId: targetNode.id,
              description: "New Relationship",
            });

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
        }
      }
    },
    [graphNodes],
  );

  const onNodeDragStop = useCallback(() => {
    localStorage.setItem(
      "graphLayout",
      JSON.stringify({
        nodes: graphNodes,
      }),
    );
  }, [graphNodes]);

  const handleAddNode = (formData: Omit<HistoricalItem, "id">) => {
    const newId = uuidv4();
    const newNode = {
      id: newId,
      type: "default",
      data: { label: formData.title },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      style: {
        background: typeColors[formData.type].bg,
        color: typeColors[formData.type].text,
        border: `1px solid ${typeColors[formData.type].border}`,
        borderRadius: "8px",
        padding: "10px",
        width: 180,
        textAlign: "center",
      },
    };

    // Add to historicalData
    historicalData.push({
      ...formData,
      id: newId,
      relationships: [],
    });

    setNodes((nds) => [...nds, newNode]);
    setIsAddingNode(false);

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
    <Card className="w-[720px] h-[800px] bg-white p-4">
      <ReactFlow
        nodes={graphNodes}
        edges={graphEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => onNodeClick(node)}
        onEdgeClick={(_, edge) => onEdgeClick(edge)}
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap
          nodeStrokeColor="#374151"
          nodeColor="#e5e7eb"
          nodeBorderRadius={2}
        />
        <Panel position="top-right">
          <Dialog open={isAddingNode} onOpenChange={setIsAddingNode}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Node
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Historical Entry</DialogTitle>
              </DialogHeader>
              <DataEntryForm onSave={handleAddNode} />
            </DialogContent>
          </Dialog>
        </Panel>
      </ReactFlow>
    </Card>
  );
};

export default RelationshipGraph;
