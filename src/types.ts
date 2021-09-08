import { SimulationLinkDatum, SimulationNodeDatum } from "d3";
import { letterPalette } from "./constants";

export type Product = {
  id: string;
  code: string;
  rca_arg: string;
  rca_bra: string;
  rca_deu: string;
  rca_chn: string;
  pci: string;
  cog: string;
  category: string;
  description: string;
};

export type Toy = {
  id: string;
  name: string;
  letters: (keyof typeof letterPalette)[];
};

export type Edge = {
  id: string;
  target: string;
  source: string;
  weight: string;
};

export interface NodeType {
  id: string;
}
export type DataNode<T> = {
  data: T;
};
export type SimulationNode<T> = Required<SimulationNodeDatum & DataNode<T>>;

export type DataLink<E extends Edge> = {
  data: E;
};
export interface RefinedLink<T> extends SimulationLinkDatum<SimulationNode<T>> {
  source: SimulationNode<T>;
  target: SimulationNode<T>;
}
export type SimulationLink<T, E extends Edge> = Required<
  RefinedLink<T> & DataLink<E>
>;

export interface ToyEdge extends Edge {
  letter: keyof typeof letterPalette;
  coincidences: string[];
  letterIndex: number;
}

export interface LetterAndNode<N> {
  node: SimulationNode<N>;
  letter: keyof typeof letterPalette;
}
