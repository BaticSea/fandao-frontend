import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Button from "../components/Button";
import { ReactComponent as InfoIcon } from "src/assets/icons/info-fill.svg";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visualization/Button",
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {
    actions: { argTypesRegex: null },
  },
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = args => <Button {...args} />;
export const Primary = Template.bind({});
export const Secondary = Template.bind({});
export const Tertiary = Template.bind({});
export const PrimarySmall = Template.bind({});
export const PrimaryLarge = Template.bind({});
export const PrimaryIconLeft = Template.bind({});
export const PrimaryIconRight = Template.bind({});
export const PrimaryIcon = Template.bind({});
export const DefaultWithExternalLink = Template.bind({});

Primary.args = { children: "Label" };
PrimarySmall.args = { ...Primary.args, size: "small" };
PrimaryLarge.args = { ...Primary.args, size: "large" };
Secondary.args = { ...Primary.args, template: "secondary" };
Tertiary.args = { ...Primary.args, template: "tertiary" };
PrimaryIconLeft.args = { ...Primary.args, startIcon: InfoIcon };
PrimaryIconRight.args = { ...Primary.args, endIcon: InfoIcon };
PrimaryIcon.args = { icon: InfoIcon };
DefaultWithExternalLink.args = { ...Primary.args, href: "https://www.google.com" };
