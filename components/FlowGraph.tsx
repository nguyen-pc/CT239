"use client";

import { ReactFlow, Controls, Background, OnNodesChange, applyNodeChanges } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React from "react";
import { useGraph } from "@/context/GraphContext";
import CircleNode from "./CircleNode";

// Định nghĩa nodeTypes
const nodeTypes = {
  circle: CircleNode,
};

export function FlowGraph() {
  const { edges: graphEdges, vertexCount, algorithmResult } = useGraph();
  const [nodes, setNodes] = React.useState([]);
  const [edges, setEdges] = React.useState([]);

  // Xử lý sự kiện khi nodes thay đổi (kéo thả)
  const onNodesChange: OnNodesChange = React.useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  // Vẽ đồ thị ban đầu khi có dữ liệu edges mới
  React.useEffect(() => {
    if (graphEdges && graphEdges.length > 0) {
      // Tạo nodes cho tất cả các đỉnh
      const newNodes = Array.from({ length: vertexCount }, (_, i) => ({
        id: `${i}`,
        type: "circle",
        // Sắp xếp nodes theo hình tròn
        position: {
          x: 300 + 200 * Math.cos((2 * Math.PI * i) / vertexCount),
          y: 300 + 200 * Math.sin((2 * Math.PI * i) / vertexCount),
        },
        data: { label: `${i}` },
        draggable: true,
      }));

      // Tạo edges với style mặc định
      const newEdges = graphEdges.map((edge) => ({
        id: `${edge.source}-${edge.target}`,
        source: `${edge.source}`,
        target: `${edge.target}`,
        label: `${edge.weight}`,
        type: "smoothstep",
        style: { stroke: "#666" },
        labelStyle: { fill: "#666" },
        markerEnd: {
          type: "arrow",
          width: 20,
          height: 20,
          color: "#666",
        },
      }));

      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [graphEdges, vertexCount]);

  // Cập nhật style khi có kết quả thuật toán
  React.useEffect(() => {
    if (algorithmResult && edges.length > 0) {
      const updatedEdges = edges.map((edge) => {
        const isInMST = algorithmResult.mst.some(
          (mstEdge) =>
            `${mstEdge.source}-${mstEdge.target}` === edge.id ||
            `${mstEdge.target}-${mstEdge.source}` === edge.id
        );

        if (isInMST) {
          return {
            ...edge,
            style: { stroke: "#000", strokeWidth: 3 },
            labelStyle: { fill: "#2563eb" },
            markerEnd: {
              ...edge.markerEnd,
              color: "#000",
            },
          };
        }
        return edge;
      });

      setEdges(updatedEdges);
    }
  }, [algorithmResult]);

  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        onNodesChange={onNodesChange}
        defaultEdgeOptions={{
          style: { strokeWidth: 2 },
          // type: "smoothstep",
          markerEnd: {
            type: "arrow",
            width: 20,
            height: 20,
            color: "#666",
          },
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default FlowGraph;
