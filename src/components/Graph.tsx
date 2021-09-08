import * as React from "react";
import * as d3 from "d3";
import { useRef, useLayoutEffect } from "react";
import { DataLink, DataNode, Edge, NodeType, SimulationLink, SimulationNode } from "../types";

export default function Grafo<Node extends NodeType, E extends Edge>(props: {
  dataNodes?: Node[];
  dataLinks?: E[];
  fillFn?: (d: SimulationNode<Node>) => string;
  rFn?: (d: SimulationNode<Node>) => number;
  legendTextFn?: (d: SimulationNode<Node>) => string;
  legendFillFn?: (d: SimulationNode<Node>) => string;
  edgeFillFn?: (d: SimulationLink<Node, E>) => string;
  edgeHoverFillFn?: (d: SimulationLink<Node, E>) => string;
  zoom?: boolean;
  style?: React.CSSProperties;
  drawTooltip?: (d: SimulationNode<Node>) => void;
  simulation?: {
    charge: number;
    x: number;
    y: number;
  };
}) {
  const {
    dataNodes = [],
    dataLinks = [],
    fillFn = (d) => "#cccccc",
    rFn = (d) => 0.8,
    legendTextFn = (d) => "",
    legendFillFn = (d) => "transparent",
    edgeFillFn = (d) => "#cccccc",
    edgeHoverFillFn = (d) => "green",
    zoom: useZoom = false,
    style = {},
    drawTooltip = (d) => {},
    simulation: simulationConfig = {
      charge: -0.8,
      x: 0.1 / 2,
      y: 0.15 / 2
    }
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
        linkRef.current.attr("d", (d) => {
          return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`;
        });
        nodeRef.current.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      } catch (e) {}
    }
  };

  useLayoutEffect(() => {
    const svg = d3.select(ref.current);

    if (ref.current !== null) {
      d3.select("#tooltip-template").style("opacity", 0);
      const g = svg.append("g").attr("id", "canvas");
      linkRef.current = g.append("g").selectAll("path");
      nodeRef.current = g.append("g").selectAll("circle");

      const simulation = d3
        .forceSimulation<SimulationNode<Node>>()
        .force("charge", d3.forceManyBody().strength(simulationConfig.charge))
        .force(
          "collide",
          d3.forceCollide<SimulationNode<Node>>().radius((d) => rFn(d) * 1.1)
        )
        .force("x", d3.forceX().strength(simulationConfig.x))
        .force("y", d3.forceY().strength(simulationConfig.y))
        .on("tick", tick);
      simulationRef.current = simulation;

      const r = 1;
      const legendMargin = 2;
      svg
        .append("circle")
        .attr("id", "legend-circle")
        .attr("cx", -80 + legendMargin)
        .attr("cy", -45 + legendMargin)
        .attr("r", r)
        .style("fill", "transparent");

      svg
        .append("text")
        .attr("id", "legend-text")
        .attr("x", -80 + legendMargin + r * 2)
        .attr("y", -45 + legendMargin)
        .style("font-size", "2px")
        .attr("alignment-baseline", "middle");

      if (useZoom) {
        const zoom = d3.zoom().on("zoom", (e) => {
          g.attr("transform", e.transform);
        });

        svg
          .call(zoom)
          .call(zoom.transform, d3.zoomIdentity)
          .on("dblclick.zoom", null);

        const zoomButtons = svg.append("g").attr("id", "zoom-buttons");

        // Zoom In

        const zoomIn = zoomButtons
          .append("g")
          .attr("id", "zoom-in")
          .style("cursor", "pointer")
          .on("mouseover", () => {
            d3.select("#zoom-in-button")
              .transition()
              .duration(100)
              .attr("fill", "#dcdcdc");
          })
          .on("mouseout", () => {
            d3.select("#zoom-in-button")
              .transition()
              .duration(100)
              .attr("fill", "#ffffff");
          })
          .on("click", (e) => {
            const transform = g.attr("transform") || "scale(1)";
            const r1 = /scale\((\d+(.\d+){0,1})\)/g;
            const scale = parseFloat(
              transform.match(r1)[0].replace("scale(", "").replace(")", "")
            );

            svg
              .transition()
              .duration(300)
              .call(zoom.scaleTo, Math.min(scale * 1.5, 3));
          });

        zoomIn
          .append("rect")
          .attr("id", "zoom-in-button")
          .attr("x", 80 - 7.5)
          .attr("y", -50 + 7.5)
          .attr("width", 5)
          .attr("height", 5)
          .attr("stroke", "#dcdcdc")
          .attr("stroke-width", 0.5)
          .attr("fill", "#ffffff");

        zoomIn
          .append("text")
          .attr("id", "zoom-in-text")
          .text("+")
          .attr("x", 80 - 6.25)
          .attr("y", -50 + 11.25)
          .style("font-size", "4px");

        // Zoom Out

        const zoomOut = zoomButtons
          .append("g")
          .attr("id", "zoom-out")
          .style("cursor", "pointer")
          .on("mouseover", () => {
            d3.select("#zoom-out-button")
              .transition()
              .duration(100)
              .attr("fill", "#dcdcdc");
          })
          .on("mouseout", () => {
            d3.select("#zoom-out-button")
              .transition()
              .duration(100)
              .attr("fill", "#ffffff");
          })
          .on("click", (e) => {
            const transform = g.attr("transform") || "scale(1)";
            const r1 = /scale\((\d+(.\d+){0,1})\)/g;
            const scale = parseFloat(
              transform.match(r1)[0].replace("scale(", "").replace(")", "")
            );

            svg
              .transition()
              .duration(300)
              .call(zoom.scaleTo, Math.max(0.5, scale - 0.5));
          });

        zoomOut
          .append("rect")
          .attr("id", "zoom-out-button")
          .attr("x", 80 - 7.5)
          .attr("y", -50 + 7.5 + 5)
          .attr("width", 5)
          .attr("height", 5)
          .attr("stroke", "#dcdcdc")
          .attr("stroke-width", 0.5)
          .attr("fill", "#ffffff");

        zoomOut
          .append("text")
          .attr("id", "zoom-out-text")
          .text("-")
          .attr("x", 80 - 5.8)
          .attr("y", -50 + 11.25 + 5)
          .style("font-size", "4px");

        // Reset

        const zoomReset = zoomButtons
          .append("g")
          .attr("id", "zoom-reset")
          .style("cursor", "pointer")
          .on("mouseover", () => {
            d3.select("#zoom-reset-button")
              .transition()
              .duration(100)
              .attr("fill", "#dcdcdc");
          })
          .on("mouseout", () => {
            d3.select("#zoom-reset-button")
              .transition()
              .duration(100)
              .attr("fill", "#ffffff");
          })
          .on("click", (e) => {
            svg
              .transition()
              .duration(300)
              .call(zoom.transform, d3.zoomIdentity);
          });

        zoomReset
          .append("rect")
          .attr("id", "zoom-reset-button")
          .attr("x", 80 - 7.5)
          .attr("y", -50 + 7.5 + 5 + 5)
          .attr("width", 5)
          .attr("height", 5)
          .attr("stroke", "#dcdcdc")
          .attr("stroke-width", 0.5)
          .attr("fill", "#ffffff");

        zoomReset
          .append("text")
          .attr("id", "zoom-reset-text")
          .text("R")
          .attr("x", 80 - 6.2)
          .attr("y", -50 + 11.25 + 5 + 5)
          .style("font-size", "3px");
      }
    }
    return () => {
      svg.selectAll("#canvas").remove();
      svg.selectAll("#legend-circle").remove();
      svg.selectAll("#legend-text").remove();
      svg.selectAll("#zoom-buttons").remove();
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
      const oldNodes = new Map(theNode.data().map((d) => [d.data.id, d]));

      const newNodes: SimulationNode<Node>[] = dataNodes
        .map((dn) => ({ data: dn }))
        .map((d: DataNode<Node>) => {
          const prev = oldNodes.get(d.data.id) || { x: 0, y: 0 };
          return {
            ...prev,
            ...d,
            x: prev.x,
            y: prev.y
          } as SimulationNode<Node>;
        });

      const findNode = function (id: string) {
        return newNodes.find((n) => n.data.id === id);
      };

      const oldLinks = new Map(
        theLink.data().map((d) => [`${d.data.source}-${d.data.target}`, d])
      );
      const newLinks: SimulationLink<Node, E>[] = dataLinks
        .map((dl) => ({ data: dl }))
        .map((d: DataLink<E>) => {
          const prev = oldLinks.get(`${d.data.source}-${d.data.target}`) || {
            x: 0,
            y: 0
          };
          return {
            ...prev,
            ...d,
            source: findNode(d.data.source),
            target: findNode(d.data.target)
          } as SimulationLink<Node, E>;
        });
      linkRef.current = theLink
        .data(newLinks)
        .join((enter) => enter.append("path"));

      nodeRef.current = theNode
        .data(newNodes, (d) => d.data.id)
        .join((enter) => enter.append("circle"));

      simulationRef.current.nodes(newNodes);
      try {
        simulationRef.current.force(
          "link",
          d3.forceLink(newLinks).distance((d) => 1 - parseFloat(d.data.weight))
        );
      } catch (e) {}
      simulationRef.current.alpha(1).restart().tick();
      tick();
    }
  }, [ref, dataNodes, dataLinks]);

  useLayoutEffect(() => {
    if (nodeRef.current !== null) {
      nodeRef.current
        .transition()
        .duration(200)
        .attr("fill", fillFn)
        .attr("r", rFn);
    }
    if (linkRef.current !== null) {
      linkRef.current
        .attr("stroke-width", 0.2)
        .attr("stroke", edgeFillFn)
        .attr("stroke-opacity", 0.5);
    }
  }, [fillFn, rFn]);

  useLayoutEffect(() => {
    if (nodeRef.current !== null) {
      nodeRef.current
        .on("mousemove", (e, d) => {
          d3.select("#tooltip-template")
            .style("position", "absolute")
            .style("left", e.pageX - 140 / 2 + "px")
            .style("top", (x) => {
              const h =
                parseInt(
                  d3
                    .select("#tooltip-template")
                    .style("height")
                    .replace("px", ""),
                  10
                ) || 120;
              return e.pageY - h - 20 + "px";
            });
        })
        .on("mouseover", (e, d) => {
          d3.select("#tooltip-box").style(
            "border-top",
            `4px solid ${legendFillFn(d)}`
          );
          d3.select("#tooltip-template").style("display", "initial");
          d3.select("#tooltip-template").transition().style("opacity", 1);
          drawTooltip(d);
          if (linkRef.current !== null) {
            linkRef.current
              .transition()
              .duration(100)
              .attr("stroke", (l) =>
                l.data.source === d.data.id || l.data.target === d.data.id
                  ? edgeHoverFillFn(l)
                  : "#cccccc"
              );
          }
        })
        .on("mouseout", (e, d) => {
          if (linkRef.current !== null) {
            d3.select("#tooltip-template").style("display", "none");
            d3.select("#tooltip-template")
              .transition()
              .duration(200)
              .style("opacity", 0);
            const svg = d3.select(ref.current);
            svg.select("#legend-circle").style("fill", "transparent");
            svg.select("#legend-text").text("");
            linkRef.current
              .transition()
              .duration(100)
              .attr("stroke", "#cccccc");
          }
        });
    }
  }, [legendFillFn, legendTextFn, drawTooltip]);

  return (
    <>
      <svg
        ref={ref}
        viewBox="-80 -45 160 90"
        style={{ width: "100%", ...style }}
      ></svg>
      <div id="tooltip-template">
        <div
          style={{
            width: "140px",
            minHeight: "100px",
            borderTop: "4px solid green",
            background: "#f5f5f5",
            padding: "10px 14px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
          id="tooltip-box"
        >
          <span
            style={{
              textTransform: "uppercase",
              fontSize: "10px",
              fontWeight: "bold"
            }}
            id="tooltip-title"
          >
            Alcohol metílico
          </span>
          <div id="tooltip-body">
            <span style={{ fontSize: "14px" }}>
              Cercanía: <b id="tooltip-cercania">0.127</b>
            </span>
            <br />
            <span style={{ fontSize: "14px" }}>
              COG: <b id="tooltip-cog">0.03</b>
            </span>
            <br />
            <span style={{ fontSize: "14px" }}>
              VCR: <b id="tooltip-vcr">0.3</b>
            </span>
          </div>
        </div>
        <div
          style={{
            width: "0px",
            height: "0px",
            borderTop: "10px solid #f5f5f5",
            borderBottom: "none",
            borderRight: "10px solid transparent",
            borderLeft: "10px solid transparent",
            transform: "translateX(calc(140px / 2 - 10px))",
            position: "absolute"
          }}
        ></div>
      </div>
    </>
  );
}
