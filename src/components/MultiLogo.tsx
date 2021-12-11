import { Avatar, Box, SvgIcon } from "@material-ui/core";
import { ElementType } from "react";

const avatarStyle = { height: "35px", width: "35px", marginInline: "-4px" };
const defaultImages = [
  "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
  "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x6b175474e89094c44da98b954eedeac495271d0f.png",
  "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png",
];

export default function MultiLogo({
  images,
  icons,
  avatarStyleOverride,
  isLP,
}: {
  images?: string[];
  icons?: ElementType[];
  avatarStyleOverride?: Record<string, string | number>;
  isLP?: boolean;
}) {
  let iconStyle = { height: "35px", width: "35px", marginInline: "-4px", zIndex: 1 };
  let viewBox = "0 0 32 32";
  if (images && !images.length) {
    images = defaultImages;
  }
  if (isLP) {
    viewBox = "0 0 64 32";
    iconStyle = { ...iconStyle, height: "32px", width: "62px" };
  }
  return (
    <Box display="flex" alignItems="center" justifyContent="center" width={"64px"}>
      {images?.map(image => (
        <Avatar src={image} style={avatarStyleOverride ?? avatarStyle} />
      ))}

      {icons?.map(icon => (
        <SvgIcon component={icon} viewBox={viewBox} style={iconStyle} />
      ))}
    </Box>
  );
}
