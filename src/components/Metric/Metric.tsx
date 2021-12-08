import { Typography, TypographyTypeMap } from "@material-ui/core";
import { Skeleton, SkeletonTypeMap } from "@material-ui/lab";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip";

interface MetricProps {
  className?: string;
  label?: string;
  metric?: string;
  isLoading?: boolean;
  labelVariant?: TypographyTypeMap["props"]["variant"];
  metricVariant?: TypographyTypeMap["props"]["variant"];
  tooltip?: string;
  loadingWidth?: SkeletonTypeMap["props"]["width"];
}
/**
 * Primary Metric Component for UI. Presents a label and metric with optional tooltip.
 */
const Metric = ({ metricVariant = "h4", labelVariant = "h5", loadingWidth = "50%", ...props }: MetricProps) => {
  return (
    <div className={props.className}>
      <Typography variant={labelVariant} color="textSecondary">
        {props.label}
        {props.tooltip && <InfoTooltip message={props.tooltip} children={undefined} />}
      </Typography>
      <Typography variant={metricVariant} style={{ width: "100%" }}>
        {props.isLoading ? <Skeleton width={loadingWidth} /> : <span>{props.metric}</span>}
      </Typography>
    </div>
  );
};
export default Metric;
