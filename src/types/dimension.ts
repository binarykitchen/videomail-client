type AbsoluteUnit = "px" | "pt" | "pc" | "in" | "cm" | "mm" | "Q";
type RelativeUnit = "em" | "rem" | "%" | "vw" | "vh" | "vmin" | "vmax" | "ex" | "ch";

type CSSUnit = AbsoluteUnit | RelativeUnit;

export interface Dimension {
  unit: CSSUnit;
  value?: number | undefined;
}
