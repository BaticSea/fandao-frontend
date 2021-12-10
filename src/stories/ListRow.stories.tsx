import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Typography } from "@material-ui/core";

import ListRow from "../components/ListRow/ListRow";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visualization/ListRow",
  component: ListRow,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof ListRow>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ListRow> = args => (
  <div style={{ width: "25%" }}>
    <ListRow {...args} />{" "}
  </div>
);

export const Primary = Template.bind({});
export const SubItem = Template.bind({});
export const Loading = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  title: "Unstaked Balance",
  balance: "23.32",
  isLoading: false,
};
SubItem.args = {
  title: "Unstaked Balance",
  balance: "23.32",
  indented: true,
  isLoading: false,
};

Loading.args = {
  title: "Unstaked Balance",
  balance: "23.32",
  indented: true,
  isLoading: true,
};
