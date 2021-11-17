import { useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";

import { ReactComponent as ArrowUpIcon } from "src/assets/icons/arrow-up.svg";
import { ReactComponent as sOhmTokenImg } from "src/assets/tokens/token_sOHM.svg";
import { ReactComponent as ohmTokenImg } from "src/assets/tokens/token_OHM.svg";
import { ReactComponent as t33TokenImg } from "src/assets/tokens/token_33T.svg";
import { ReactComponent as wethTokenImg } from "src/assets/tokens/wETH.svg";
import { ReactComponent as abracadabraTokenImg } from "src/assets/tokens/MIM.svg";
import rariTokenImg from "src/assets/tokens/RARI.png";

import SOhmLearnView from "./SOhm/SOhmLearnView";
import SOhmTxView from "./SOhm/SOhmTxView";
import SOhmZapView from "./SOhm/SOhmTxView";
import Chart from "src/components/Chart/WalletChart.jsx";
import apollo from "src/lib/apolloClient";
import { rebasesDataQuery, bulletpoints, tooltipItems, tooltipInfoMessages, itemType } from "../../treasuryData.js";
import { useWeb3Context } from "src/hooks";
import {
  SvgIcon,
  Button,
  Typography,
  Box,
  Drawer,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Link,
} from "@material-ui/core";

import { addresses } from "src/constants";
import { dai, frax } from "src/helpers/AllBonds";

const useStyles = makeStyles(theme => ({
  menuContainer: {
    padding: "16px",
    width: "400px",
  },
  closeMenuButton: {
    marginLeft: "auto",
  },
  menuItem: {
    padding: "6px 16px",
  },
  viewAllBonds: {
    marginTop: "6px",
  },
  menuSection: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    padding: theme.spacing(1, 0),
  },
}));

const ExternalLinkIcon = ({ size = 20 }) => (
  <SvgIcon
    component={ArrowUpIcon}
    style={{ height: `${size}px`, width: `${size}px`, verticalAlign: "sub" }}
    htmlColor="#A3A3A3"
  />
);
const ExternalLink = props => <Link target="_blank" rel="noreferrer" {...props} />;

const MenuItemBond = ({ Icon1, Icon2, lpName }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Icon1 style={{ height: "25px", width: "25px" }} />
        <Icon2 style={{ height: "25px", width: "25px" }} />
        <Box sx={{ display: "flex", flexDirection: "column", ml: "8px" }}>
          <Typography>{lpName}</Typography>
          <ExternalLink href="#">
            <Typography variant="body2" color="textSecondary">
              Get LP <ExternalLinkIcon size={16} />
            </Typography>
          </ExternalLink>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", textAlign: "right" }}>
        <Button size="small" color="secondary" variant="outlined">
          <Typography>Bond to Save 12%</Typography>
        </Button>
      </Box>
    </Box>
  );
};

const MenuItemBorrow = ({ Icon1, Icon2, borrowOn, totalAvailable }) => (
  <Button size="large" variant="contained" color="secondary" fullWidth>
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Icon1 style={{ height: "25px", width: "25px" }} />
        <Icon2 style={{ height: "25px", width: "25px" }} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ display: "flex", flexDirection: "column", textAlign: "right" }}>
          <Typography>Borrow on {borrowOn}</Typography>
          {totalAvailable && (
            <Typography variant="body2" color="textSecondary">
              {totalAvailable} Available
            </Typography>
          )}
        </Box>
        <Box component={ExternalLinkIcon} sx={{ ml: "6px" }} />
      </Box>
    </Box>
  </Button>
);

const MenuItemUserToken = ({
  name,
  icon,
  userBalance,
  userBalanceUSD,
  onExpandedChange,
  expanded,
  toggleDrawer /* TODO better routing */,
}) => {
  return (
    <Accordion expanded={expanded} onChange={onExpandedChange}>
      <AccordionSummary
        expandIcon={<SvgIcon component={ArrowUpIcon} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />}
      >
        <Button variant="contained" style={{ width: "100%", flexDirection: "row" }} color="secondary">
          <Typography align="left" style={{ width: "100%", flexDirection: "row" }}>
            <SvgIcon component={icon} viewBox="0 0 32 32" style={{ height: "25px", width: "25px" }} />
            {name}
          </Typography>
          <Box>
            <Typography align="left">{userBalance}</Typography>
            <Typography align="left">${userBalanceUSD /* format currency blabla */}</Typography>
          </Box>
        </Button>
      </AccordionSummary>
      <AccordionDetails margin="auto" style={{ margin: "auto", padding: 0 }}>
        <Box className="ohm-pairs" style={{ width: "100%" }}>
          <Button
            variant="contained"
            style={{ backgroundColor: "#272D36", color: "#386794", width: "33%", minHeight: "50px" }}
            onClick={toggleDrawer("sOHMtx")}
            color="secondary"
          >
            <Typography align="left"> Transaction History</Typography>
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: "#272D36", color: "#386794", width: "33%", minHeight: "50px" }}
            min-height="60px"
            onClick={toggleDrawer("sOHMLHIW")}
            color="secondary"
          >
            <Typography align="left"> Learn how it works</Typography>
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: "#272D36", color: "#386794", width: "33%", minHeight: "50px" }}
            color="secondary"
            onClick={toggleDrawer("sOHMZaps")}
          >
            <Typography align="left"> Zap</Typography>
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

function InitialWalletView() {
  const theme = useTheme();
  const styles = useStyles();

  const { chainID } = useWeb3Context();

  const [apy, setApy] = useState(null);
  const [anchor, setAnchor] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const SOHM_ADDRESS = addresses[chainID].SOHM_ADDRESS;
  const OHM_ADDRESS = addresses[chainID].OHM_ADDRESS;
  const PT_TOKEN_ADDRESS = addresses[chainID].PT_TOKEN_ADDRESS;
  const WSOHM_ADDRESS = addresses[chainID].WSOHM_ADDRESS;
  const ohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });
  const sohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const wsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.wsohm;
  });
  const fsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.fsohm;
  });

  const poolBalance = useSelector(state => {
    return state.account.balances && parseFloat(state.account.balances.pool);
  });

  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });

  const toggleDrawer = data => () => {
    setAnchor(data);
  };
  const handleChange = panel => (event, isExpanded) => {
    if (isExpanded) {
      setExpanded(isExpanded ? panel : false);
    }
  };
  // apollo(rebasesDataQuery).then(r => {
  //   let apy = r.data.rebases.map(entry => ({
  //     apy: Math.pow(parseFloat(entry.percentage) + 1, 365 * 3) * 100,
  //     timestamp: entry.timestamp,
  //   }));
  //   [
  //     {
  //       "apy": 7857.424722561997,
  //       "timestamp": "1636797374"
  //     }
  //   ]
  //   apy = apy.filter(pm => pm.apy < 300000);
  //   setApy(apy);
  //   √
  // });
  return (
    <Paper style={{ width: "500px", padding: theme.spacing(1) }}>
      {/* <Chart
        type="line"
        scale="log"
        data={apy}
        dataKey={["apy"]}
        color={theme.palette.text.primary}
        stroke={[theme.palette.text.primary]}
        headerText="APY over time"
        dataFormat="percent"
        headerSubText={`${apy && trim(apy[0].apy, 2)}%`}
        bulletpointColors={bulletpoints.apy}
        itemNames={tooltipItems.apy}
        itemType={itemType.percentage}
        infoTooltipMessage={tooltipInfoMessages.apy}
        expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      /> */}
      <MenuItemUserToken
        name="sOHM"
        icon={ohmTokenImg}
        userBalance={0}
        userBalanceUSD={0}
        expanded={expanded === "sOHM"}
        onExpandedChange={handleChange("sOHM")}
        toggleDrawer={toggleDrawer}
      />
      <MenuItemUserToken
        name="wsOHM"
        icon={ohmTokenImg}
        userBalance={0}
        userBalanceUSD={0}
        expanded={expanded === "wsOHM"}
        onExpandedChange={handleChange("wsOHM")}
        toggleDrawer={toggleDrawer}
      />
      <MenuItemUserToken
        name="OHM"
        icon={ohmTokenImg}
        userBalance={0}
        userBalanceUSD={0}
        expanded={expanded === "OHM"}
        onExpandedChange={handleChange("OHM")}
        toggleDrawer={toggleDrawer}
      />
      <MenuItemUserToken
        name="3TT"
        icon={ohmTokenImg}
        userBalance={0}
        userBalanceUSD={0}
        expanded={expanded === "3TT"}
        onExpandedChange={handleChange("3TT")}
        toggleDrawer={toggleDrawer}
      />

      <Divider color="secondary" className="less-margin" />

      <Box className={styles.menuSection}>
        <MenuItemBond Icon1={wethTokenImg} Icon2={wethTokenImg} lpName={`BANK-ETH SLP`} />
        <Typography align="right" variant="body2" className={styles.viewAllBonds}>
          View all bond discounts
        </Typography>
      </Box>

      <Divider color="secondary" className="less-margin" />

      <Box className={styles.menuSection}>
        <MenuItemBorrow borrowOn="Abracadabra" Icon1={ohmTokenImg} Icon2={abracadabraTokenImg} />
        <MenuItemBorrow borrowOn="Rari" Icon1={ohmTokenImg} Icon2={props => <img src={rariTokenImg} {...props} />} />
      </Box>

      <Divider color="secondary" className="less-margin" />

      <Box className={styles.menuSection}>
        <Box sx={{ flexWrap: "nowrap", flexDirection: "row" }}>
          <ExternalLink
            href={`https://app.sushi.com/swap?inputCurrency=${dai.getAddressForReserve(chainID)}&outputCurrency=${
              addresses[chainID].OHM_ADDRESS
            }`}
          >
            <Button size="large" variant="contained" color="secondary">
              <Typography style={{ lineHeight: "20px", whiteSpace: "break-spaces" }}>
                Buy on Sushiswap <ExternalLinkIcon />
              </Typography>
            </Button>
          </ExternalLink>

          <ExternalLink
            href={`https://app.uniswap.org/#/swap?inputCurrency=${frax.getAddressForReserve(chainID)}&outputCurrency=${
              addresses[chainID].OHM_ADDRESS
            }`}
          >
            <Button size="large" variant="contained" color="secondary">
              <Typography style={{ lineHeight: "20px", whiteSpace: "break-spaces" }}>
                Buy on Uniswap <ExternalLinkIcon />
              </Typography>
            </Button>
          </ExternalLink>

          <ExternalLink href={`https://dune.xyz/shadow/Olympus-(OHM)`}>
            <Button size="large" variant="contained" color="secondary">
              <Typography style={{ lineHeight: "20px", whiteSpace: "break-spaces" }}>
                View on Dune Analytics <ExternalLinkIcon />
              </Typography>
            </Button>
          </ExternalLink>
        </Box>
      </Box>

      <Drawer style={{ width: "55%" }} anchor={"right"} open={anchor === "sOHMtx"} onClose={toggleDrawer("OG")}>
        {" "}
        <SOhmTxView></SOhmTxView>
      </Drawer>
      <Drawer style={{ width: "55%" }} anchor={"right"} open={anchor === "sOHMLHIW"} onClose={toggleDrawer("OG")}>
        <SOhmLearnView></SOhmLearnView>
      </Drawer>
      <Drawer style={{ width: "55%" }} anchor={"right"} open={anchor === "sOHMZaps"} onClose={toggleDrawer("OG")}>
        <SOhmZapView></SOhmZapView>
      </Drawer>
    </Paper>
  );
}

export default InitialWalletView;
