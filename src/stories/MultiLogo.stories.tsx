import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import MultiLogo from "../components/MultiLogo";
import { ReactComponent as CircleZapIcon } from "src/assets/icons/circle-zap.svg";
import avaxImage from "src/assets/tokens/avax.png";
import gOhmImage from "src/assets/tokens/gohm.png";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visualization/MultiLogo",
  component: MultiLogo,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof MultiLogo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MultiLogo> = args => <MultiLogo {...args} />;

export const Default = Template.bind({});
export const SingleIcon = Template.bind({});
export const MultiIcon = Template.bind({});
export const SingleImage = Template.bind({});
export const MultiImage = Template.bind({});
export const IconAndImage = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  images: {},
};

SingleIcon.args = {
  icons: [CircleZapIcon],
};
MultiIcon.args = {
  icons: [CircleZapIcon, CircleZapIcon],
};
MultiImage.args = {
  images: [gOhmImage, avaxImage],
  avatarStyleOverride: { height: "35px", width: "35px", marginInline: "-4px", marginTop: "16px" },
};

SingleImage.args = {
  images: [gOhmImage],
};

IconAndImage.args = {
  images: [
    "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f.png",
  ],
  icons: [CircleZapIcon],
};
