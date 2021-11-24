import { Box, SvgIcon } from "@material-ui/core";
import { Bond, BondOpts } from "../lib/Bond";
import { IBondDetails } from "../slices/BondSlice";

type IBondLogoProps = {
  bond: Partial<IBondDetails & BondOpts & Bond>;
};

function BondLogo({ bond }: IBondLogoProps) {
  let viewBox = "0 0 32 32";
  let style = { height: "32px", width: "32px" };

  // Need more space if its an LP token
  if (bond.isLP) {
    viewBox = "0 0 64 32";
    style = { height: "32px", width: "62px" };
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" width="64px">
      <SvgIcon component={bond.bondIconSvg as React.ElementType} viewBox={viewBox} style={style} />
    </Box>
  );
}

export default BondLogo;
