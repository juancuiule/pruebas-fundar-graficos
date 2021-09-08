import * as d3 from "d3";
import { useEffect, useState } from "react";
import Unit from "../components/Unit";
import { palette } from "../constants";
import { Product } from "../types";

export default function UnitCategory() {
  const [categories, setCategories] = useState<[string, Product[]][]>([]);

  useEffect(() => {
    d3.csv("/green_products_categories.csv").then((csvData) => {
      const productsByCategory = d3.group(
        (csvData as any) as Product[],
        (d) => d.category
      );
      setCategories(Array.from(productsByCategory));
    });
  }, []);

  const [hovered, setHovered] = useState<
    { product: Product; event: React.MouseEvent } | undefined
  >(undefined);

  return (
    <>
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
          <h2>Pensar en productos verdes</h2>
          <p>
            ¿Qué son los productos verdes? Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Curabitur laoreet velit ut nibh viverra
            lobortis. Donec tincidunt justo et justo luctus pharetra. In
            sollicitudin condimentum elementum. Nunc id turpis vestibulum,
            sollicitudin libero quis, viverra diam. Integer posuere facilisis
            lectus. Proin convallis euismod ligula non scelerisque. Fusce
            sodales sit amet diam a pharetra. Curabitur vel rhoncus metus.
          </p>
          {hovered !== undefined ? (
            <div>
              <div
                style={{
                  width: "140px",
                  minHeight: "100px",
                  borderTop:
                    "4px solid " +
                    palette[
                      categories
                        .map((x) => x[0])
                        .indexOf(hovered.product.category)
                    ],
                  background: "#f5f5f5",
                  padding: "10px 14px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <span
                  style={{
                    textTransform: "uppercase",
                    fontSize: "10px",
                    fontWeight: "bold"
                  }}
                >
                  {hovered.product.description}
                </span>
                <div>
                  <span style={{ fontSize: "14px" }}>
                    Cercanía: <b>---</b>
                  </span>
                  <br />
                  <span style={{ fontSize: "14px" }}>
                    COG: <b>{parseFloat(hovered.product.cog).toFixed(3)}</b>
                  </span>
                  <br />
                  <span style={{ fontSize: "14px" }}>
                    VCR: <b>{parseFloat(hovered.product.rca_arg).toFixed(3)}</b>
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "20px",
            width: "calc(60% - 20px)"
          }}
        >
          {categories.map(([category, products], i) => (
            <div
              key={category}
              style={{
                width: "calc(50% - 20px)",
                display: "flex",
                flexDirection: "column",
                fontWeight: 600
              }}
            >
              <p>{category}</p>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  gap: "5px",
                  flexWrap: "wrap",
                  maxWidth: "500px"
                }}
              >
                {products.map((product) => (
                  <Unit
                    key={product.code}
                    color={palette[i]}
                    onMouseLeave={(e) => {
                      setHovered(undefined);
                    }}
                    onMouseOver={(e) => {
                      setHovered({ product, event: e });
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
