import { ThemeProvider, makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { dark as darkTheme } from "../src/themes/dark.js";
import { light as lightTheme } from "../src/themes/light.js";
import "../src/style.scss";
import "./style.scss";
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story, options) => {
    const { parameters } = options;
    const theme = parameters.theme === "dark" ? darkTheme : lightTheme;
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    );
  },
];
