import React, {
  useCallback,
  useEffect,
  useState,
  useLayoutEffect,
} from "react";
import dagre from "dagre";
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
import { HistoricalItem } from "@/lib/types";

interface RelationshipGraphProps {
  nodes?: Node[];
  edges?: Edge[];
  onNodeClick?: (node: Node) => void;
  onEdgeClick?: (edge: Edge) => void;
  historicalData: HistoricalItem[];
  onHistoricalDataUpdate: (data: HistoricalItem[]) => void;
}

const typeColors = {
  character: { bg: "#93c5fd", border: "#60a5fa", text: "#1e40af" },
  term: { bg: "#d8b4fe", border: "#c084fc", text: "#6b21a8" },
  event: { bg: "#fdba74", border: "#fb923c", text: "#9a3412" },
};

const RelationshipGraph = ({
  nodes: initialNodes = [],
  edges: initialEdges = [],
  onNodeClick = () => {},
  onEdgeClick = () => {},
  historicalData,
  onHistoricalDataUpdate,
}: RelationshipGraphProps) => {
  const [graphNodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [graphEdges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isAddingNode, setIsAddingNode] = useState(false);

  const getLayoutedElements = (
    nodes: Node[],
    edges: Edge[],
    direction = "TB",
  ) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 180, height: 40 });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - 90,
          y: nodeWithPosition.y - 20,
        },
      };
    });

    return { nodes: layoutedNodes, edges };
  };

  useLayoutEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      graphNodes,
      graphEdges,
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [graphNodes, graphEdges, historicalData]);

  useEffect(() => {
    if (!Array.isArray(historicalData)) {
      console.warn("historicalData is not an array. Skipping graph update.");
      return;
    }

    const newNodes = historicalData.map((item) => ({
      id: item.id,
      type: "default",
      data: { label: item.title },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
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

    const newEdges = historicalData.reduce((edges: Edge[], item) => {
      if (item.relationships) {
        item.relationships.forEach((rel) => {
          edges.push({
            id: `${item.id}-${rel.targetId}`,
            source: item.id,
            target: rel.targetId,
            animated: true,
          });
        });
      }
      return edges;
    }, []);

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      newNodes,
      newEdges,
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [historicalData]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        const sourceNode = graphNodes.find((n) => n.id === params.source);
        const targetNode = graphNodes.find((n) => n.id === params.target);

        if (sourceNode && targetNode) {
          const updatedData = historicalData.map((item) => {
            if (item.id === sourceNode.id) {
              const existingRelationship = item.relationships?.find(
                (rel) => rel.targetId === targetNode.id,
              );
              if (!existingRelationship) {
                return {
                  ...item,
                  relationships: [
                    ...(item.relationships || []),
                    {
                      targetId: targetNode.id,
                      description: "New Relationship",
                    },
                  ],
                };
              }
            }
            return item;
          });

          onHistoricalDataUpdate(updatedData);
        }
      }
    },
    [graphNodes, historicalData, onHistoricalDataUpdate],
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

    const newItem: HistoricalItem = {
      ...formData,
      id: newId,
      relationships: [],
    };

    onHistoricalDataUpdate([...historicalData, newItem]);
    setIsAddingNode(false);
  };

  return (
    <Card className="w-[720px] h-[800px] bg-card/90 backdrop-blur-sm p-4 shadow-sm border border-border/50">
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
