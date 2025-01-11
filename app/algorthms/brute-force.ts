interface Edge {
  source: number;
  target: number;
  weight: number;
}

export function bruteForce(edges: Edge[], vertexCount: number) {
  // Tạo ma trận kề với kích thước chính xác
  const graph: number[][] = [];
  for (let i = 0; i <= vertexCount; i++) {
    graph[i] = new Array(vertexCount + 1).fill(0);
  }

  // Dien thong tin vao ma tran ke
  edges.forEach((edge) => {
    if (edge.source <= vertexCount && edge.target <= vertexCount) {
      graph[edge.source][edge.target] = edge.weight;
      // graph[edge.target][edge.source] = edge.weight;   //Do thi co huong
    }
  });

  //   Generate all permutation of the vertices
  const vertices = Array.from({ length: vertexCount }, (_, i) => i);
  let minPath: number[] = [];
  let minDistance = Infinity;

  //   Array to store the result nodes and edge
  const resultNode: any[] = [];
  const resultEdges: any[] = [];

  const permute = (arr: number[], start: number) => {
    if (start === arr.length - 1) {
      //Tinh toan tong khoan cach
      let currentDistance = 0;
      const path: number[] = [];
      for (let i = 0; i < arr.length; i++) {
        path.push(arr[i]);
        if (i > 0) {
          currentDistance += graph[arr[i - 1]][arr[i]];
          resultEdges.push({
            from: `${path.slice(0, 1).join("->")}`,
            to: `${path.slice(0, i + 1).join("->")}`,
            cost: graph[arr[i - 1]][arr[i]],
          });
        }
      }
      // add distance from last vertex back to the firs vertex
      currentDistance += graph[arr[arr.length - 1]][arr[0]];
      resultEdges.push({
        from: `${path.join("->")}`,
        to: `${path[0]}`,
        cost: graph[arr[arr.length - 1]][arr[0]],
      });

      // update minium distance and path if current is better
      if (currentDistance < minDistance) {
        minDistance = currentDistance;
        minPath = [...arr]; //Store the current best path
      }

      // add node top resultNode
      resultNode.push({
        id: `${path.join("->")}`,
        node: path[path[length - 1]],
        path: [...path],
        cost: currentDistance,
        isLeaf: true,
      });
    } else {
      for (let i = start; i < arr.length; i++) {
        [arr[start], arr[i]] = [arr[i], arr[start]]; //swap
        permute(arr, start + 1);
        [arr[start], arr[i]] = [arr[i], arr[start]];
      }
    }
  };
  permute(vertices, 1); // Start permutation

  // Add the final node for the minimum path
  if (minPath.length > 0) {
    resultNode.push({
      id: `${minPath.join("->")}`,
      node: minPath[minPath.length - 1],
      path: [...minPath],
      cost: minDistance,
      isLeaf: true,
    });
  }

  return {
    path: minPath,
    distance: minDistance,
    resultEdges,
    resultNode,
  };
}
