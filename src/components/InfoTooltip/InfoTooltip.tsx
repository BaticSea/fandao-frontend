import { useState } from "react";
import { ReferenceObject } from "popper.js";
import { ReactComponent as Info } from "../../assets/icons/info.svg";
import { SvgIcon, Paper, Typography, Box, Popper } from "@material-ui/core";
import "./infotooltip.scss";

interface Props {
  message: string;
}

function InfoTooltip({ message }: Props) {
  const [anchorEl, setAnchorEl] = useState<ReferenceObject | null>(null);

  const handleHover: React.MouseEventHandler<SVGSVGElement> = e => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "info-tooltip" : undefined;

  return (
    <Box style={{ display: "inline-flex", justifyContent: "center", alignSelf: "center" }}>
      <SvgIcon
        component={Info}
        onMouseOver={handleHover}
        onMouseOut={handleHover}
        style={{ margin: "0 5px", fontSize: "1em" }}
        className="info-icon"
      />
      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom" className="tooltip">
        <Paper className="info-tooltip ohm-card">
          <Typography variant="body2" className="info-tooltip-text">
            {message}
          </Typography>
        </Paper>
      </Popper>
    </Box>
  );
}

export default InfoTooltip;
