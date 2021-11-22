import { AppBar, Toolbar, Box, Button, SvgIcon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ReactComponent as MenuIcon } from "src/assets/icons/hamburger.svg";
import OhmMenu from "./OhmMenu";
import ThemeSwitcher from "./ThemeSwitch";
import LocaleSwitcher from "./LocaleSwitch";
import ConnectMenu from "./ConnectMenu";
import { ToggleThemeHandler } from "src/hooks/useTheme";
import "./topbar.scss";

const useStyles = makeStyles(theme => ({
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      padding: "10px",
    },
    justifyContent: "flex-end",
    alignItems: "flex-end",
    background: "transparent",
    backdropFilter: "none",
    zIndex: 10,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(981)]: {
      display: "none",
    },
  },
}));

interface TopBarProps {
  theme: string;
  toggleTheme: ToggleThemeHandler;
  handleDrawerToggle: () => void;
}

function TopBar({ theme, toggleTheme, handleDrawerToggle }: TopBarProps) {
  const classes = useStyles();
  const isVerySmallScreen = useMediaQuery("(max-width: 355px)");

  return (
    <AppBar position="sticky" className={classes.appBar} elevation={0}>
      <Toolbar disableGutters className="dapp-topbar">
        <Button
          id="hamburger"
          aria-label="open drawer"
          size="large"
          variant="contained"
          color="secondary"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <SvgIcon component={MenuIcon} />
        </Button>

        <Box display="flex">
          {!isVerySmallScreen && <OhmMenu />}

          <ConnectMenu theme={theme} />

          <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />

          <LocaleSwitcher />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
