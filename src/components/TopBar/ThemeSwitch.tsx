import ToggleButton from "@material-ui/lab/ToggleButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as SunIcon } from "src/assets/icons/sun.svg";
import { ReactComponent as MoonIcon } from "src/assets/icons/moon.svg";
import { ToggleThemeHandler } from "src/hooks/useTheme";
import { t } from "@lingui/macro";

interface ThemeSwitcherProps {
  theme: string;
  toggleTheme: ToggleThemeHandler;
}

function ThemeSwitcher({ theme, toggleTheme }: ThemeSwitcherProps) {
  return (
    <ToggleButton
      className="toggle-button"
      type="button"
      title={t`Change Theme`}
      value="check"
      onClick={e => toggleTheme(e)}
    >
      {theme === "dark" ? (
        <SvgIcon component={MoonIcon} color="primary" />
      ) : (
        <SvgIcon component={SunIcon} color="primary" />
      )}
    </ToggleButton>
  );
}

export default ThemeSwitcher;
