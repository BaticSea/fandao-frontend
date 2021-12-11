import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Box, Grid } from "@material-ui/core";

import Metric from "../components/Metric/Metric";
import Card from "../components/Card/Card";
import MetricCollection from "../components/Metric/MetricCollection";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Layout/Metrics",
  component: Metric,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Metric>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Metric> = args => <Metric {...args} />;

// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const MetricsCollection = () => (
  <Card>
    <MetricCollection>
      <Metric label="APY" metric="5000%" isLoading={true} />
      <Metric label="APY" metric="5000%" isLoading={true} />
      <Metric label="APY" metric="5000%" isLoading={true} />
      <Metric label="APY" metric="5000%" isLoading={false} />
      <Metric label="APY" metric="5000%" isLoading={false} />
      <Metric label="APY" metric="5000%" isLoading={false} />
    </MetricCollection>
  </Card>
);
