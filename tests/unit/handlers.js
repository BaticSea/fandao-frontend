import { rest } from "msw";

// We use msw to intercept the network request during the test
const handlers = [
  rest.post("https://eth-mainnet.alchemyapi.io/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC", (req, res, ctx) => {
    return res(
      ctx.json({
        jsonrpc: "2.0",
        id: 42,
        result: "0x1",
      }),
    );
  }),
  rest.get("https://api.coingecko.com/api/v3/simple/price", (req, res, ctx) => {
    return res(ctx.json({ olympus: { usd: 945.14 } }));
  }),
  rest.post("https://ipaddress/:port", (req, res, ctx) => {
    return res(ctx.json({}));
  }),
  rest.post("https://api.thegraph.com/subgraphs/name/drondin/olympus-graph", (req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          _meta: {
            __typename: "_Meta_",
            block: {
              __typename: "_Block_",
              number: 13501406,
            },
          },
          protocolMetrics: [
            {
              __typename: "ProtocolMetric",
              marketCap: "3577146993.657302231430339754242565",
              nextDistributedOhm: "12181.552453984",
              nextEpochRebase: "0.405307196296169827615596591007931",
              ohmCirculatingSupply: "3303059.158951933",
              ohmPrice: "1082.979995669329103554871387716231",
              sOhmCirculatingSupply: "3005511.02109783",
              timestamp: "1635292805",
              totalSupply: "4114932.918240082",
              totalValueLocked: "3254908312.612648825386546700219469",
              treasuryMarketValue: "607996117.2114430432380503355515384",
            },
          ],
        },
      }),
      // ctx.delay(150),
    );
  }),
];

// override render method
export default handlers;
