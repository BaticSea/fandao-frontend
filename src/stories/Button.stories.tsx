import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Button from "../components/Button";
import { ReactComponent as InfoIcon } from "src/assets/icons/info-fill.svg";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visualization/Button",
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = args => <Button {...args} />;

export const Default = Template.bind({});
export const DefaultWithExternalLink = Template.bind({});
export const Outlined = Template.bind({});
export const OutlinedWithExternalLink = Template.bind({});
export const TextButton = Template.bind({});
export const IconButton = Template.bind({});
export const IconButtonWithText = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  text: "Learn More",
};
DefaultWithExternalLink.args = {
  text: "Learn More",
  href: "https://docs.olympusdao.finance/main/basics/migration",
};
Outlined.args = {
  text: "Learn More",
  template: "outlined",
};
OutlinedWithExternalLink.args = {
  text: "Learn More",
  template: "outlined",
  href: "https://docs.olympusdao.finance/main/basics/migration",
};
TextButton.args = {
  text: "Text Button",
  template: "text",
  disabled: true,
};

IconButton.args = {
  icon: InfoIcon,
};
IconButtonWithText.args = {
  icon: InfoIcon,
  text: "Click to Learn More",
};
