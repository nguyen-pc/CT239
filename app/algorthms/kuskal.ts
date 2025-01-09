interface Edge {
  source: number;
  target: number;
  weight: number;
}

function findRoot(parent: number[], u: number): number {
  while (parent[u] !== u) {
    u = parent[u];
  }
  return u;
}

export const kruskal = (
  edges: [number, number, number][],
  vertexCount: number
): {
  mst: Edge[];
  totalWeight: number;
  steps: Edge[][];
} => {
  const steps: Edge[][] = [];

  // Chuyển đổi định dạng cạnh
  const formattedEdges: Edge[] = edges.map(([u, v, w]) => ({
    source: u,
    target: v,
    weight: w,
  }));

  // Sắp xếp các cạnh theo trọng số tăng dần
  formattedEdges.sort((a, b) => a.weight - b.weight);

  const parent = Array.from({ length: vertexCount }, (_, i) => i);
  const mst: Edge[] = [];
  let totalWeight = 0;

  for (const edge of formattedEdges) {
    const sourceRoot = findRoot(parent, edge.source);
    const targetRoot = findRoot(parent, edge.target);

    if (sourceRoot !== targetRoot) {
      mst.push(edge);
      totalWeight += edge.weight;
      parent[sourceRoot] = targetRoot;
      steps.push([...mst]);
    }
  }

  return {
    mst,
    totalWeight,
    steps,
  };
};
