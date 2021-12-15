import { Button, SvgIcon, ButtonProps } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as ArrowUp } from "src/assets/icons/arrow-up.svg";

const useStyles = makeStyles({
  root: {
    fontSize: "0.875rem",
    "&.MuiButton-sizeLarge": {
      fontSize: "1.2857rem",
      padding: "8px 60px",
      height: "40px",
    },
    "&.MuiButton-sizeSmall": {
      fontSize: "0.75rem",
    },
  },
});

interface props extends ButtonProps {
  template?: "default" | "outlined" | "text" | "secondary" | "outlinedSecondary";
  text?: string;
  icon?: React.ElementType;
  onClick?: any;
}

/**
 * Primary Button Component for UI.
 */
const ButtonComponent = ({ template = "default", ...props }: props) => {
  const classes = useStyles();
  let variant = props.variant;
  let color = props.color;
  let target;
  switch (template) {
    case "default":
      variant = "contained";
      color = "primary";
      break;
    case "outlined":
      variant = "outlined";
      color = "secondary";
      break;
    case "text":
      variant = "text";
      color = "primary";
      break;
    case "secondary":
      variant = "contained";
      color = "secondary";
      break;
    case "outlinedSecondary":
      variant = "outlined";
      break;
  }
  if (props.href) {
    target = "_blank";
  }

  return (
    <Button
      variant={variant}
      color={color}
      className={`${classes.root} ${props.className}`}
      {...props}
      startIcon={props.icon && props.children ? <SvgIcon component={props.icon} color="primary" /> : null}
      endIcon={props.href ? <SvgIcon component={ArrowUp} color="primary" /> : props.endIcon}
    >
      {props.icon && !props.children ? <SvgIcon component={props.icon} color="primary" /> : null}
      {/* {<Typography variant="body1">{props.text}</Typography>} */}
      {props.children}
    </Button>
  );
};

export default ButtonComponent;
