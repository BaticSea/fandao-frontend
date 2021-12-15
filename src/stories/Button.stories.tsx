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
export const TextButton = Template.bind({});
export const IconButton = Template.bind({});
export const IconButtonWithText = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  children: "Learn More",
};
export const Small = () => <Button size="small">Small Button</Button>;
export const Medium = () => <Button size="medium">Medium Button</Button>;
export const Large = () => <Button size="large">Large Button</Button>;
export const SmallOutlined = () => (
  <Button size="small" template="outlined">
    Small Button
  </Button>
);
export const DefaultOutlined = () => <Button template="outlined">Learn More</Button>;
export const LargeOutlined = () => (
  <Button size="large" template="outlined">
    Learn More
  </Button>
);
export const SecondarySmall = () => (
  <Button template="secondary" size="small">
    Learn More
  </Button>
);
export const SecondaryDefault = () => (
  <Button template="secondary" size="medium">
    Learn More
  </Button>
);
export const SecondaryLarge = () => (
  <Button template="secondary" size="large">
    Learn More
  </Button>
);
DefaultWithExternalLink.args = {
  children: "Learn More",
  href: "https://docs.olympusdao.finance/main/basics/migration",
};
TextButton.args = {
  children: "Text Button",
  template: "text",
  disabled: true,
};

IconButton.args = {
  icon: InfoIcon,
};
IconButtonWithText.args = {
  icon: InfoIcon,
  children: "Click to Learn More",
};
