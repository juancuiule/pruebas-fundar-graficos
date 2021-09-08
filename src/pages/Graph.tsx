import * as d3 from "d3";
import { useEffect, useState } from "react";
import { categories, palette } from "../constants";
import { Edge, Product } from "../types";

import Grafo from "../components/Graph";

export default function Graph() {
  const [nodes, setNodes] = useState<Product[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    d3.csv("/green_products_categories.csv").then((csvData) => {
      const data = (csvData as any) as Product[];
      setNodes(data);
    });
  }, []);

  useEffect(() => {
    d3.csv("/green_products_edges.csv").then((csvData) => {
      const data = (csvData as any) as Edge[];
      setEdges(data);
    });
  }, []);

  const [country, setCountry] = useState<
    "deu" | "bra" | "arg" | "chn" | "category"
  >("deu");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "20px",
        margin: "auto",
        maxWidth: "1500px",
        padding: "24px",
        justifyContent: "space-between"
      }}
    >
      <div style={{ width: "calc(30% - 20px)" }}>
        <h2>Diferentes países, diferentes conocimientos</h2>
        <p>
          Diferentes países saben producir diferentes cosas, y esto marca como
          habitan el espacio de producto verde. <br />
          <br /> Veamos los siguientes paises:
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            gap: "var(--sp-2)"
          }}
        >
          <button
            className={`pill-btn ${country === "deu" ? "active" : ""}`}
            onClick={(e) => {
              setCountry((prev) => (prev === "deu" ? "category" : "deu"));
            }}
          >
            Alemania
          </button>
          <button
            className={`pill-btn ${country === "chn" ? "active" : ""}`}
            onClick={(e) => {
              setCountry((prev) => (prev === "chn" ? "category" : "chn"));
            }}
          >
            China
          </button>
          <button
            className={`pill-btn ${country === "bra" ? "active" : ""}`}
            onClick={(e) => {
              setCountry((prev) => (prev === "bra" ? "category" : "bra"));
            }}
          >
            Brasil
          </button>
          <button
            className={`pill-btn ${country === "arg" ? "active" : ""}`}
            onClick={(e) => {
              setCountry((prev) => (prev === "arg" ? "category" : "arg"));
            }}
          >
            Argentina
          </button>
        </div>
      </div>
      <div style={{ width: "calc(70%)" }}>
        <Grafo
          zoom
          dataNodes={nodes}
          dataLinks={edges}
          legendFillFn={(d) => palette[categories.indexOf(d.data.category)]}
          legendTextFn={(d) =>
            `(${d.data.code}) ${d.data.category} - ${d.data.description}`
          }
          fillFn={(d) =>
            country === "category"
              ? palette[categories.indexOf(d.data.category)]
              : parseFloat(d.data[`rca_${country}` as keyof typeof d.data]) >= 1
              ? "green"
              : "#cccccc"
          }
          drawTooltip={(d) => {
            d3.select("#tooltip-title").html(d.data.description);
            d3.select("#tooltip-cercania").html("---");
            d3.select("#tooltip-cog").html(parseFloat(d.data.cog).toFixed(3));
            d3.select("#tooltip-vcr").html(
              parseFloat(d.data.rca_arg).toFixed(3)
            );
          }}
        />
      </div>

      {/* <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px"
        }}
      >
        {palette.map((color, i) => (
          <div
            key={`${color}-${i}`}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "5px"
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                background: color
              }}
            ></div>
            <span>{categories[i]}</span>
          </div>
        ))}
      </div> */}
    </div>
  );
}
