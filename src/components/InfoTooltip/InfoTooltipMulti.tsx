import { useState } from "react";
import { ReferenceObject } from "popper.js";
import { ReactComponent as Info } from "../../assets/icons/info.svg";
import { SvgIcon, Paper, Typography, Box, Popper } from "@material-ui/core";
import "./infotooltip.scss";

interface Props {
  messagesArray: Array<string>;
}

/**
 * InfoTooltipMulti allows passing an Array of message strings w each Array Element on a new line
 * @param {*} messagesArray = Array of Message Strings
 * @returns MUI Popover on document.body
 */
function InfoTooltipMulti({ messagesArray }: Props) {
  const [anchorEl, setAnchorEl] = useState<ReferenceObject | null>(null);

  const handleHover: React.MouseEventHandler<SVGSVGElement> = e => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "info-tooltip" : undefined;

  return (
    <Box>
      <SvgIcon
        component={Info}
        onMouseOver={handleHover}
        onMouseOut={handleHover}
        style={{ margin: "0 5px", fontSize: 16 }}
        className="info-icon"
      />
      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom" className="tooltip">
        <Paper className="info-tooltip ohm-card" style={{ padding: "1.33rem" }}>
          {messagesArray?.map((message: string, i: number) => (
            <div key={i} style={i > 0 ? { marginTop: "1rem" } : {}}>
              <Typography variant="body2">{message}</Typography>
            </div>
          ))}
        </Paper>
      </Popper>
    </Box>
  );
}

export default InfoTooltipMulti;
