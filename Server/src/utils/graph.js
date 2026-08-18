/**
 * Minimal in-memory undirected graph.
 *
 * In the reference architecture this stands in for the "Graph DB" in the
 * Data Layer. It's swappable: replace this module with a Neo4j / Amazon
 * Neptune / TigerGraph client behind the same interface
 * (addNode, addEdge, neighbors, degree, connectedComponents) without
 * touching the Network Analysis service that consumes it.
 */
class Graph {
  constructor() {
    this.adjacency = new Map(); // nodeId -> Set(neighborId)
    this.nodeMeta = new Map(); // nodeId -> { type, ...attrs }
  }

  addNode(id, meta = {}) {
    if (!this.adjacency.has(id)) {
      this.adjacency.set(id, new Set());
      this.nodeMeta.set(id, meta);
    }
    return id;
  }

  addEdge(a, b) {
    this.addNode(a);
    this.addNode(b);
    this.adjacency.get(a).add(b);
    this.adjacency.get(b).add(a);
  }

  neighbors(id) {
    return this.adjacency.get(id) || new Set();
  }

  degree(id) {
    return this.neighbors(id).size;
  }

  hasNode(id) {
    return this.adjacency.has(id);
  }

  /** Connected components via BFS - used to surface potential collusion clusters. */
  connectedComponents() {
    const visited = new Set();
    const components = [];
    for (const start of this.adjacency.keys()) {
      if (visited.has(start)) continue;
      const queue = [start];
      const component = [];
      visited.add(start);
      while (queue.length) {
        const node = queue.shift();
        component.push(node);
        for (const neighbor of this.neighbors(node)) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      components.push(component);
    }
    return components;
  }

  toJSON() {
    return {
      nodes: [...this.adjacency.keys()].map((id) => ({
        id,
        ...this.nodeMeta.get(id),
        degree: this.degree(id),
      })),
      edges: [...this.adjacency.entries()].flatMap(([a, neighbors]) =>
        [...neighbors].filter((b) => a < b).map((b) => ({ source: a, target: b }))
      ),
    };
  }
}

module.exports = Graph;
