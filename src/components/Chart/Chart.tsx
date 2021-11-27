import CustomTooltip from "./CustomTooltip";
import InfoTooltip from "../InfoTooltip/InfoTooltip";
import ExpandedChart from "./ExpandedChart";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { useEffect, useState } from "react";
import { ReactComponent as Fullscreen } from "../../assets/icons/fullscreen.svg";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Area,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Typography, Box, SvgIcon, CircularProgress } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { trim, formatCurrency } from "../../helpers";
import { ScaleType } from "recharts/types/util/types";
import { format } from "date-fns";
import "./chart.scss";

const tickCount = 3;
const expandedTickCount = 5;

const renderExpandedChartStroke = (isExpanded: boolean, color: string) =>
  isExpanded ? <CartesianGrid vertical={false} stroke={color} /> : "";

export interface ITreasuryData {
  currentAPY: number;
  holders: number;
  id: number;
  marketCap: number;
  nextDistributedOhm: number;
  nextEpochRebase: number;
  ohmCirculatingSupply: number;
  ohmPrice: number;
  runway2dot5k: number;
  runway5k: number;
  runway7dot5k: number;
  runway10k: number;
  runway20k: number;
  runway50k: number;
  runwayCurrent: number;
  sOhmCirculatingSupply: number;
  timestamp: number;
  totalSupply: number;
  totalValueLocked: number;
  treasuryDaiMarketValue: number;
  treasuryDaiRiskFreeValue: number;
  treasuryFraxMarketValue: number;
  treasuryFraxRiskFreeValue: number;
  treasuryLusdMarketValue: number;
  treasuryLusdRiskFreeValue: number;
  treasuryMarketValue: number;
  treasuryOhmDaiPOL: number;
  treasuryOhmFraxPOL: number;
  treasuryRiskFreeValue: number;
  treasuryWETHMarketValue: number;
  treasuryXsushiMarketValue: number;
}

interface IChartProps {
  data: Array<ITreasuryData>;
  dataKey: string;
  stopColor?: string[][];
  color?: string;
  stroke: string;
  dataFormat: string;
  bulletpointColors: Array<CSSProperties | undefined>;
  itemNames: Array<string>;
  itemType: string;
  isStaked?: boolean;
  isExpanded: boolean;
  expandedGraphStrokeColor: string;
  isPOL?: boolean;
  scale?: Function | ScaleType;
}

type IChart = IChartProps & {
  type: string;
  headerText: string;
  headerSubText: string;
  infoTooltipMessage: string;
};

const renderAreaChart = ({
  data,
  dataKey,
  stopColor,
  dataFormat,
  bulletpointColors,
  itemNames,
  itemType,
  isStaked,
  isExpanded,
  expandedGraphStrokeColor,
  isPOL,
}: IChartProps) => (
  <AreaChart data={data}>
    <defs>
      <linearGradient id={`color-${dataKey[0]}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stopColor?.[0][0]} stopOpacity={1} />
        <stop offset="90%" stopColor={stopColor?.[0][1]} stopOpacity={0.9} />
      </linearGradient>
    </defs>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tickLine={false}
      tickFormatter={str => format(new Date(str * 1000), "MMM dd")}
      reversed={true}
      padding={{ right: 20 }}
    />
    <YAxis
      tickCount={isExpanded ? expandedTickCount : tickCount}
      axisLine={false}
      tickLine={false}
      width={dataFormat === "percent" ? 33 : 55}
      tickFormatter={number =>
        number !== 0
          ? dataFormat !== "percent"
            ? `${formatCurrency(parseFloat(number) / 1000000)}M`
            : `${trim(parseFloat(number), 2)}%`
          : ""
      }
      domain={[0, "auto"]}
      dx={3}
      allowDataOverflow={false}
    />
    <Tooltip
      content={
        <CustomTooltip
          bulletpointColors={bulletpointColors}
          itemNames={itemNames}
          itemType={itemType}
          isStaked={isStaked}
          isPOL={isPOL}
        />
      }
    />
    <Area dataKey={dataKey[0]} stroke="none" fill={`url(#color-${dataKey[0]})`} fillOpacity={1} />
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </AreaChart>
);

const renderStackedAreaChart = ({
  data,
  dataKey,
  stopColor,
  stroke,
  dataFormat,
  bulletpointColors,
  itemNames,
  itemType,
  isExpanded,
  expandedGraphStrokeColor,
}: IChartProps) => (
  <AreaChart data={data}>
    <defs>
      <linearGradient id={`color-${dataKey[0]}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stopColor?.[0][0]} stopOpacity={1} />
        <stop offset="90%" stopColor={stopColor?.[0][1]} stopOpacity={0.9} />
      </linearGradient>
      <linearGradient id={`color-${dataKey[1]}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stopColor?.[1][0]} stopOpacity={1} />
        <stop offset="90%" stopColor={stopColor?.[1][1]} stopOpacity={0.9} />
      </linearGradient>
      <linearGradient id={`color-${dataKey[2]}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stopColor?.[2][0]} stopOpacity={1} />
        <stop offset="90%" stopColor={stopColor?.[2][1]} stopOpacity={0.9} />
      </linearGradient>
      <linearGradient id={`color-${dataKey[3]}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stopColor?.[3][0]} stopOpacity={1} />
        <stop offset="90%" stopColor={stopColor?.[3][1]} stopOpacity={0.9} />
      </linearGradient>
      <linearGradient id={`color-${dataKey[4]}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stopColor?.[4][0]} stopOpacity={1} />
        <stop offset="90%" stopColor={stopColor?.[4][1]} stopOpacity={0.9} />
      </linearGradient>
    </defs>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tickLine={false}
      tickFormatter={str => format(new Date(str * 1000), "MMM dd")}
      reversed={true}
      padding={{ right: 20 }}
    />
    <YAxis
      tickCount={isExpanded ? expandedTickCount : tickCount}
      axisLine={false}
      tickLine={false}
      width={dataFormat === "percent" ? 33 : 55}
      tickFormatter={number => {
        if (number !== 0) {
          if (dataFormat === "percent") {
            return `${trim(parseFloat(number), 2)}%`;
          } else if (dataFormat === "k") return `${formatCurrency(parseFloat(number) / 1000)}k`;
          else return `${formatCurrency(parseFloat(number) / 1000000)}M`;
        }
        return "";
      }}
      domain={[0, "auto"]}
      allowDataOverflow={false}
    />
    <Tooltip
      formatter={(value: string) => trim(parseFloat(value), 2)}
      content={<CustomTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />}
    />
    <Area
      dataKey={dataKey[0]}
      stroke={stroke ? stroke[0] : "none"}
      fill={`url(#color-${dataKey[0]})`}
      fillOpacity={1}
      stackId="1"
    />
    <Area
      dataKey={dataKey[1]}
      stroke={stroke ? stroke[1] : "none"}
      fill={`url(#color-${dataKey[1]})`}
      fillOpacity={1}
      stackId="1"
    />
    <Area
      dataKey={dataKey[2]}
      stroke={stroke ? stroke[2] : "none"}
      fill={`url(#color-${dataKey[2]})`}
      fillOpacity={1}
      stackId="1"
    />
    <Area
      dataKey={dataKey[3]}
      stroke={stroke ? stroke[3] : "none"}
      fill={`url(#color-${dataKey[3]})`}
      fillOpacity={1}
      stackId="1"
    />
    <Area
      dataKey={dataKey[4]}
      stroke={stroke ? stroke[4] : "none"}
      fill={`url(#color-${dataKey[4]})`}
      fillOpacity={1}
      stackId="1"
    />
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </AreaChart>
);

const renderLineChart = ({
  data,
  dataKey,
  stroke,
  color,
  dataFormat,
  bulletpointColors,
  itemNames,
  itemType,
  isExpanded,
  expandedGraphStrokeColor,
  scale,
}: IChartProps) => (
  <LineChart data={data}>
    <XAxis
      dataKey="timestamp"
      interval={100}
      axisLine={false}
      tickCount={3}
      tickLine={false}
      reversed={true}
      tickFormatter={str => format(new Date(str * 1000), "MMM dd")}
      padding={{ right: 20 }}
    />
    <YAxis
      tickCount={scale == "log" ? 1 : isExpanded ? expandedTickCount : tickCount}
      axisLine={false}
      tickLine={false}
      width={32}
      scale={scale}
      tickFormatter={number =>
        number !== 0 ? (dataFormat !== "percent" ? `${number}` : `${parseFloat(number) / 1000}k`) : ""
      }
      domain={[scale == "log" ? "dataMin" : 0, "auto"]}
      allowDataOverflow={false}
    />
    <Tooltip
      content={<CustomTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />}
    />
    <Line type="monotone" dataKey={dataKey[0]} stroke={stroke ? stroke : "none"} color={color} dot={false} />;
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </LineChart>
);

const renderMultiLineChart = ({
  data,
  dataKey,
  stroke,
  bulletpointColors,
  itemNames,
  itemType,
  isExpanded,
  expandedGraphStrokeColor,
}: IChartProps) => (
  <LineChart data={data}>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tickCount={3}
      tickLine={false}
      reversed={true}
      tickFormatter={str => format(new Date(str * 1000), "MMM dd")}
      padding={{ right: 20 }}
    />
    <YAxis
      tickCount={isExpanded ? expandedTickCount : tickCount}
      axisLine={false}
      tickLine={false}
      width={25}
      tickFormatter={number => (number !== 0 ? `${trim(parseFloat(number), 2)}` : "")}
      domain={[0, "auto"]}
      allowDataOverflow={false}
    />
    <Tooltip
      content={<CustomTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />}
    />
    <Line dataKey={dataKey[0]} stroke={stroke[0]} dot={false} />;
    <Line dataKey={dataKey[1]} stroke={stroke[1]} dot={false} />;
    <Line dataKey={dataKey[2]} stroke={stroke[2]} dot={false} />;
    <Line dataKey={dataKey[3]} stroke={stroke[3]} dot={false} />;
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </LineChart>
);

// JTBD: Bar chart for Holders
const renderBarChart = ({
  data,
  dataKey,
  stroke,
  bulletpointColors,
  itemNames,
  itemType,
  isExpanded,
  expandedGraphStrokeColor,
}: IChartProps) => (
  <BarChart data={data}>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tickCount={tickCount}
      tickLine={false}
      reversed={true}
      tickFormatter={str => format(new Date(str * 1000), "MMM dd")}
      padding={{ right: 20 }}
    />
    <YAxis
      axisLine={false}
      tickLine={false}
      tickCount={isExpanded ? expandedTickCount : tickCount}
      width={33}
      domain={[0, "auto"]}
      allowDataOverflow={false}
      tickFormatter={number => (number !== 0 ? number : "")}
    />
    <Tooltip
      content={<CustomTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />}
    />
    <Bar dataKey={dataKey[0]} fill={stroke[0]} />
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </BarChart>
);

function Chart({
  type,
  data,
  scale,
  dataKey,
  color,
  stopColor,
  stroke,
  headerText,
  dataFormat,
  headerSubText,
  bulletpointColors,
  itemNames,
  itemType,
  isStaked,
  infoTooltipMessage,
  expandedGraphStrokeColor,
  isPOL,
}: IChart) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderChart = (type: string, isExpanded: boolean) => {
    if (type === "line")
      return renderLineChart({
        data,
        dataKey,
        color,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        expandedGraphStrokeColor,
        scale,
      });
    if (type === "area")
      return renderAreaChart({
        data,
        dataKey,
        stopColor,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isStaked,
        isExpanded,
        expandedGraphStrokeColor,
        isPOL,
      });
    if (type === "stack")
      return renderStackedAreaChart({
        data,
        dataKey,
        stopColor,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        expandedGraphStrokeColor,
      });
    if (type === "multi")
      return renderMultiLineChart({
        data,
        dataKey,
        color,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        expandedGraphStrokeColor,
      });

    if (type === "bar")
      return renderBarChart({
        data,
        dataKey,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        expandedGraphStrokeColor,
      });
  };

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  return loading ? (
    <Box style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  ) : (
    <Box style={{ width: "100%", height: "100%", paddingRight: "10px" }}>
      <div className="chart-card-header">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          style={{ width: "100%", overflow: "hidden" }}
        >
          <Box display="flex" width="90%" alignItems="center">
            <Typography
              variant="h6"
              color="textSecondary"
              className="card-title-text"
              style={{ fontWeight: 400, overflow: "hidden" }}
            >
              {headerText}
            </Typography>
            <InfoTooltip message={infoTooltipMessage}>
              <></>
            </InfoTooltip>
          </Box>
          {/* could make this svgbutton */}

          <SvgIcon
            component={Fullscreen}
            color="primary"
            onClick={handleOpen}
            style={{ fontSize: "1rem", cursor: "pointer" }}
          />
          <ExpandedChart
            open={open}
            handleClose={handleClose}
            renderChart={renderChart(type, true)}
            uid={dataKey}
            data={data}
            infoTooltipMessage={infoTooltipMessage}
            headerText={headerText}
            headerSubText={headerSubText}
          />
        </Box>
        {loading ? (
          <Skeleton variant="text" width={100} />
        ) : (
          <Box display="flex">
            <Typography variant="h4" style={{ fontWeight: 600, marginRight: 5 }}>
              {headerSubText}
            </Typography>
            <Typography variant="h4" color="textSecondary" style={{ fontWeight: 400 }}>
              {type !== "multi" && "Today"}
            </Typography>
          </Box>
        )}
      </div>
      <Box width="100%" minHeight={260} minWidth={310} className="ohm-chart">
        {loading || (data && data.length > 0) ? (
          <ResponsiveContainer minHeight={260} width="100%">
            {renderChart(type, false) as any}
          </ResponsiveContainer>
        ) : (
          <Skeleton variant="rect" width="100%" height={260} />
        )}
      </Box>
    </Box>
  );
}

export default Chart;
