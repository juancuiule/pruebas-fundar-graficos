import * as d3 from "d3";
import { BaseType } from "d3";
import * as React from "react";
import { useLayoutEffect, useRef } from "react";
import { letterPalette } from "../constants";
import { calcTranslation, hexOpacity } from "../utils";
import {
  DataLink,
  DataNode,
  LetterAndNode,
  SimulationLink,
  SimulationNode,
  Toy,
  ToyEdge
} from "../types";

export default function Grafo<Node extends Toy, E extends ToyEdge>(props: {
  dataNodes?: Node[];
  dataLinks?: E[];
  rFn?: (d: SimulationNode<Node>) => number;
  edgeFillFn?: (d: SimulationLink<Node, E>) => string;
  style?: React.CSSProperties;
  simulation?: {
    charge: number;
    x: number;
    y: number;
  };
}) {
  const {
    dataNodes = [],
    dataLinks = [],
    rFn = (d) => 0.8,
    edgeFillFn = (d) => "#cccccc",
    style = {}
  } = props;

  const ref = useRef<SVGSVGElement | null>(null);

  const nodeRef = useRef<d3.Selection<
    d3.BaseType,
    SimulationNode<Node>,
    SVGGElement,
    unknown
  > | null>(null);

  const linkRef = useRef<d3.Selection<
    d3.BaseType,
    SimulationLink<Node, E>,
    SVGGElement,
    unknown
  > | null>(null);

  const simulationRef = useRef<d3.Simulation<
    SimulationNode<Node>,
    SimulationLink<Node, E>
  > | null>(null);

  const tick = () => {
    if (nodeRef.current !== null && linkRef.current !== null) {
      try {
        linkRef.current
          .attr(
            "d",
            (d) => `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`
          )
          .attr("transform", function (d) {
            const minR = d3.min([rFn(d.target), rFn(d.source)]) as number;
            var translation = calcTranslation(
              (d.data.letterIndex / minR) * 2,
              d.source,
              d.target
            );
            return `translate (${translation.dx}, ${translation.dy})`;
          });
        nodeRef.current
          .selectAll<BaseType, SimulationNode<Node>>("circle")
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y);
        nodeRef.current
          .selectAll<BaseType, SimulationNode<Node>>("text")
          .attr("x", (d) => d.x)
          .attr("y", (d) => d.y + 0.5);
      } catch (e) {}
    }
  };

  useLayoutEffect(() => {
    const svg = d3.select(ref.current);
    if (ref.current !== null) {
      const canvas = svg.append("g").attr("id", "canvas");
      linkRef.current = canvas.append("g").selectAll(".node-link");
      nodeRef.current = canvas.append("g").selectAll(".node");

      const simulation = d3
        .forceSimulation<SimulationNode<Node>>()
        .force("x", d3.forceX(0))
        .force("y", d3.forceY(0))
        .force("charge", d3.forceManyBody().strength(-50))
        .on("tick", tick);
      simulationRef.current = simulation;
    }
    return () => {
      svg.selectAll("g").remove();
    };
  }, []);

  useLayoutEffect(() => {
    const theNode = nodeRef.current;
    const theLink = linkRef.current;

    if (
      theNode !== null &&
      theLink !== null &&
      simulationRef.current !== null
    ) {
      const newNodes: SimulationNode<Node>[] = dataNodes
        .map((dn) => ({ data: dn }))
        .map((d: DataNode<Node>) => {
          return {
            ...d
          } as SimulationNode<Node>;
        });

      const findNode = function (id: string) {
        return newNodes.find((n) => n.data.id === id);
      };
      const newLinks: SimulationLink<Node, E>[] = dataLinks
        .map((dl) => ({ data: dl }))
        .map((d: DataLink<E>) => {
          return {
            ...d,
            source: findNode(d.data.source),
            target: findNode(d.data.target)
          } as SimulationLink<Node, E>;
        });

      linkRef.current = theLink
        .data(newLinks, (d) => d.data.id)
        .join((enter) => enter.append("path").attr('class', 'node-link'));

      nodeRef.current = theNode
        .data(newNodes, (d) => d.data.id)
        .join((enter) => {
          const x = enter.append("g");
          x.append("circle").attr("class", "node-circle");
          const text = x
            .append("text")
            .attr("class", (d) => `node-label node-label-${d.data.id}`);
          text.data().forEach((t) => {
            t.data.letters.forEach((l) => {
              d3.select(`.node-label-${t.data.id}`)
                .append("tspan")
                .data([{ node: t, letter: l }])
                .text(l);
            });
          });
          return x.attr("class", "node");
        });

      simulationRef.current.nodes(newNodes);
      try {
        simulationRef.current.force(
          "link",
          d3.forceLink(newLinks).distance((d) => {
            return (8 - parseFloat(d.data.weight)) * 8;
          })
        );
      } catch (e) {}
      simulationRef.current.alpha(1).restart().tick();
      tick();
    }
  }, []);

  useLayoutEffect(() => {
    if (nodeRef.current !== null) {
      nodeRef.current
        .selectAll<BaseType, SimulationNode<Node>>("circle")
        .attr("fill", "white")
        .attr("stroke", "#cccccc")
        .attr("stroke-width", 0.2)
        .attr("r", rFn);
      nodeRef.current
        .selectAll<BaseType, SimulationNode<Node>>("text")
        .attr("text-anchor", "middle")
        .style("text-transform", "uppercase")
        .style("font-family", "Gotham")
        .attr("fill", "black")
        .style("cursor", "default")
        .style("user-select", "none");

      nodeRef.current
        .selectAll<BaseType, LetterAndNode<Node>>("text tspan")
        .attr("fill", ({ letter }) => `${letterPalette[letter]}`)
        .style("opacity", 0.5)
        .attr("class", ({ letter }) => `letter letter-${letter}`)
        .attr("font-size", ({ node }) => rFn(node) / 3);
    }
    if (linkRef.current !== null) {
      linkRef.current
        .attr("stroke", (l) => edgeFillFn(l))
        .attr("stroke-width", 0.2)
        .attr("stroke-opacity", 0.4);
    }
  }, []);

  useLayoutEffect(() => {
    if (nodeRef.current !== null) {
      nodeRef.current
        .on("mouseover", (e, d) => {
          if (linkRef.current !== null && nodeRef.current !== null) {
            nodeRef.current
              .selectAll<BaseType, LetterAndNode<Node>>(".letter")
              .transition()
              .duration(200)
              .style("opacity", ({ letter }) =>
                d.data.letters.includes(letter) ? 1 : 0.1
              );
            linkRef.current
              .transition()
              .duration(200)
              .attr("stroke-opacity", (l) =>
                l.data.source === d.data.id || l.data.target === d.data.id
                  ? 1
                  : 0.1
              );
          }
        })
        .on("mouseout", (e, d) => {
          if (linkRef.current !== null && nodeRef.current !== null) {
            nodeRef.current
              .selectAll<BaseType, LetterAndNode<Node>>(".letter")
              .transition()
              .duration(200)
              .style("opacity", 0.5);
            linkRef.current
              .transition()
              .duration(200)
              .attr("stroke-opacity", 0.4);
          }
        });
    }
  }, []);

  return (
    <>
      <svg
        ref={ref}
        viewBox="-50 -50 100 100"
        style={{ width: "100%", ...style }}
      ></svg>
    </>
  );
}
