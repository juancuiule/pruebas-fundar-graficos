import * as d3 from "d3";
import { BaseType } from "d3";
import { useCallback, useEffect, useState } from "react";
import Grafo from "../components/ToyGraph";
import { letterPalette } from "../constants";
import { LetterAndNode, SimulationLink, Toy, ToyEdge } from "../types";
import { hexOpacity } from "../utils";

const words = ["ruleta", "celular", "satelite", "aceite", "tela", "sal", "cal"];

export default function Graph() {
  const [nodes] = useState<Toy[]>(
    words.map((w) => ({ id: w, name: w, letters: w.split("") as any }))
  );
  const [edges, setEdges] = useState<ToyEdge[]>([]);

  useEffect(() => {
    d3.csv("/toy_nodes.csv").then((csvData) => {
      const data = (csvData as any) as ToyEdge[];
      setEdges(data);
    });
  }, []);

  const rFn = useCallback(
    (d) => d3.scaleLinear([3, 8], [4, 6])(d.data.name.length),
    []
  );

  const edgeFillFn = useCallback(
    (d: SimulationLink<Toy, ToyEdge>) => `${letterPalette[d.data.letter]}`,
    []
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "20px",
        margin: "auto",
        maxWidth: "100%",
        padding: "24px",
        justifyContent: "space-between"
      }}
    >
      {edges.length !== 0 && nodes.length !== 0 ? (
        <Grafo
          dataNodes={nodes}
          dataLinks={edges}
          rFn={rFn}
          edgeFillFn={edgeFillFn}
        />
      ) : (
        "loading..."
      )}
      <div
        style={{
          display: "flex",
          gap: "20px"
        }}
      >
        {nodes.map((node) => {
          return (
            <div
              key={node.id}
              onMouseOver={() => {
                d3.select("svg")
                  .selectAll<BaseType, LetterAndNode<Toy>>(".letter")
                  .transition()
                  .duration(200)
                  .style("opacity", ({ letter }) =>
                    node.letters.includes(letter) ? 1 : 0.1
                  );
                d3.selectAll(".node-link")
                  .transition()
                  .duration(200)
                  .attr("stroke-opacity", (l) =>
                    l.data.source === node.id || l.data.target === node.id
                      ? 1
                      : 0.1
                  );
              }}
              onMouseOut={() => {
                d3.select("svg")
                  .selectAll<BaseType, LetterAndNode<Node>>(".letter")
                  .transition()
                  .duration(200)
                  .style("opacity", 0.5);
                d3.selectAll(".node-link")
                  .transition()
                  .duration(200)
                  .attr("stroke-opacity", 0.4);
              }}
              style={{
                background: `#DCDCDC${hexOpacity(0.2)}`,
                padding: "4px",
                border: `1px solid #000000${hexOpacity(0.2)}`,
                borderRadius: "4px"
              }}
            >
              {node.name.toUpperCase()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
