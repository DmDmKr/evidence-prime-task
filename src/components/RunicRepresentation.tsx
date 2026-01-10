import { getRunicClasses, getRunicPaths } from "../utils/runicNumberUtils";
import "./RunicRepresentation.css";

interface RunicRepresentationProps {
  number: number;
  ref: React.Ref<SVGSVGElement>;
}

const RunicRepresentation = ({ number, ref }: RunicRepresentationProps) => {
  const classes = getRunicClasses(number);
  const paths = getRunicPaths();

  return (
    <svg
      ref={ref}
      width="400"
      height="150"
      viewBox="0 0 39.5 58.8"
      className={`runic-svg ${classes}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="runic-title"
      focusable="false"
      overflow="visible"
    >
      <title id="runic-title">{number}</title>
      <desc>runic numeral representation of {number}</desc>

      {number > 0 && <path d={paths.centralLine} className="centralLine" />}

      {/* Ones (top-right) */}
      <g id="Ones">
        {paths.ones.map((path, idx) => (
          <path key={`c-${idx}`} className={path.classes} d={path.d} />
        ))}
      </g>

      {/* Tens (top-left) */}
      <g id="Tens">
        {paths.tens.map((path, idx) => (
          <path key={`t-${idx}`} className={path.classes} d={path.d} />
        ))}
      </g>

      {/* Hundreds (bottom-right) */}
      <g id="Hundreds">
        {paths.hundreds.map((path, idx) => (
          <path key={`h-${idx}`} className={path.classes} d={path.d} />
        ))}
      </g>

      {/* Thousands (bottom-left) */}
      <g id="Thousands">
        {paths.thousands.map((path, idx) => (
          <path key={`d-${idx}`} className={path.classes} d={path.d} />
        ))}
      </g>
    </svg>
  );
};

export default RunicRepresentation;
