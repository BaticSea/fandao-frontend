import { Button, Typography, SvgIcon, ButtonTypeMap, SvgIconTypeMap } from "@material-ui/core";
import { ReactComponent as ArrowUp } from "src/assets/icons/arrow-up.svg";
import "./Button.scss";

interface ButtonProps {
  template: "default" | "outlined" | "text" | "secondary";
  href?: ButtonTypeMap["props"]["href"];
  text?: string;
  icon?: React.ElementType;
  disabled?: ButtonTypeMap["props"]["disabled"];
  onClick?: anu;
}

/**
 * Primary Button Component for UI.
 */
const ButtonComponent = ({ template = "default", ...props }: ButtonProps) => {
  let variant, color, target;
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
  }
  if (props.href) {
    target = "_blank";
  }

  return (
    <Button
      variant={variant}
      color={color}
      href={props.href}
      target={target}
      className="button"
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.icon && <SvgIcon component={props.icon} color="primary" />}
      <Typography variant="body1">{props.text}</Typography>
      {props.href && <SvgIcon component={ArrowUp} color="primary" />}
    </Button>
  );
};

export default ButtonComponent;
