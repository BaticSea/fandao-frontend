import { Button, SvgIcon, ButtonProps, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as ArrowUp } from "src/assets/icons/arrow-up.svg";

type Styles = {
  icon: boolean;
};
const useStyles = makeStyles<Theme, Styles>(theme => ({
  root: {
    fontSize: "0.875rem",
    height: "39px",
    borderRadius: "4px",
    padding: ({ icon }) => (icon ? "0px 8px" : "0px 47px"),
    "&.MuiButton-sizeLarge": {
      padding: "0px 120px",
    },
    "&.MuiButton-sizeSmall": {
      //fontSize: "0.75rem",
      padding: "0px 23px",
    },
    "& .MuiButton-endIcon, & .MuiButton-startIcon": {
      marginTop: "-2px",
    },
    "& .MuiButton-endIcon": {
      marginLeft: "5px",
    },
    "& .MuiButton-startIcon": {
      marginRight: "5px",
    },
    "& .MuiButton-iconSizeMedium > *:first-child, & .MuiSvgIcon-fontSizeSmall": {
      fontSize: "1.4rem",
    },
  },
}));

interface props extends ButtonProps {
  template?: "primary" | "secondary" | "tertiary";
  text?: string;
  icon?: React.ElementType;
  onClick?: any;
  startIcon: any;
  endIcon: any;
}

/**
 * Primary Button Component for UI.
 */
const ButtonComponent = ({ template = "primary", ...props }: props) => {
  const icon = props.icon && !props.children ? true : false;
  const classes = useStyles({ icon });
  let variant = props.variant;
  let color = props.color;
  let target;
  switch (template) {
    case "primary":
      variant = "contained";
      color = "primary";
      break;
    case "secondary":
      variant = "outlined";
      color = "secondary";
      break;
    case "tertiary":
      variant = "outlined";
      color = "primary";
      break;
  }
  if (props.href) {
    target = "_blank";
  }
  const endIcon = props.endIcon || (props.href && ArrowUp) || null;

  return (
    <Button
      variant={variant}
      color={color}
      className={`${classes.root} ${props.className}`}
      {...props}
      startIcon={props.startIcon ? <SvgIcon component={props.startIcon} fontSize="large" /> : null}
      endIcon={endIcon && <SvgIcon component={endIcon} fontSize="large" />}
    >
      {props.icon && !props.children ? <SvgIcon component={props.icon} /> : null}
      {/* {<Typography variant="body1">{props.text}</Typography>} */}
      {props.children}
    </Button>
  );
};

export default ButtonComponent;
