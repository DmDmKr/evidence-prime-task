import { saveAs } from "file-saver";

/**
 * Downloads the SVG as a file by extracting only visible paths from the rendered component
 * @param svgRef - Ref to the SVG element
 * @param number - The converted number for the filename
 */
export const downloadSVG = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  number: number
): void => {
  if (!svgRef.current) return;

  const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement;

  const paths = svgClone.querySelectorAll("path");
  paths.forEach((path) => {
    const originalPath = svgRef.current!.querySelector(
      `path[d="${path.getAttribute("d")}"]`
    );
    if (!originalPath) return;

    const stroke = window.getComputedStyle(originalPath).stroke;
    const isVisible =
      stroke !== "transparent" &&
      stroke !== "none" &&
      !stroke.includes("rgba(0, 0, 0, 0)");

    if (isVisible) {
      path.setAttribute("stroke", "#000");
      path.setAttribute("stroke-width", "2");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      path.removeAttribute("class");
    } else {
      path.remove();
    }
  });

  svgClone.setAttribute("viewBox", "-2 -8 43.5 74.8");
  svgClone.removeAttribute("class");

  const blob = new Blob([svgClone.outerHTML], {
    type: "image/svg+xml;charset=utf-8",
  });
  saveAs(blob, `runic-${number}.svg`);
};
