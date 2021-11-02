import { renderRoute, setup, screen, waitFor, render } from "../../../tests/unit/utils";
import handlers from "../../../tests/unit/handlers";
import "@testing-library/jest-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { getByTestId } from "@testing-library/dom";
import Stake from "./Stake.jsx";
import App from "../../App";

// setup();
const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

jest.setTimeout(20000);
jest.setTimeout(60000);
test("the stake page APY, TVL, and Index", async () => {
  // we should probably just be rendering the <Stake /> component
  render(<App />);
  renderRoute("/stake");
  // TODO figure out why multiple elements are being rendered and breaking test. getAllBy is temp fix.
  console.log(screen.getAllByTestId("apy-loading")[0]);
  expect(screen.getAllByTestId("apy-loading")[0]).toBeInTheDocument();
  expect(screen.getAllByTestId("tvl-loading")[0]).toBeInTheDocument();
  expect(screen.getAllByTestId("index-loading")[0]).toBeInTheDocument();
  await waitFor(
    () => {
      // we should check for the correct numbers being rendered here too
      expect(screen.getByTestId("apy-value")).toHaveTextContent("7,340.2%");
      expect(screen.getByTestId("tvl-value")).toBeInTheDocument("$2,617,724,251");
      expect(screen.getByTestId("index-value")).toBeInTheDocument("21.5 OHM");
    },
    { timeout: 30000 },
  );
});
