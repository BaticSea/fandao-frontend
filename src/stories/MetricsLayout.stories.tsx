import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Box, Grid } from "@material-ui/core";

import Metric from "../components/Metric/Metric";
import Card from "../components/Card/Card";

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
    <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems={{ xs: "left", sm: "center" }}>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={12} sm={4}>
          <Metric label="APY" metric="5000%" isLoading={true} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Metric label="APY" metric="5000%" isLoading={true} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Metric label="APY" metric="5000%" isLoading={true} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Metric label="APY" metric="5000%" isLoading={false} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Metric label="APY" metric="5000%" isLoading={false} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Metric label="APY" metric="5000%" isLoading={false} />
        </Grid>
      </Grid>
    </Box>
  </Card>
);
