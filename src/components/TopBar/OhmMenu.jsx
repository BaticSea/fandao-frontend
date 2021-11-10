import { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";

import { addresses, TOKEN_DECIMALS } from "../../constants";
import { getTokenImage } from "../../helpers";
import { useSelector } from "react-redux";
import { Link, SvgIcon, Drawer, IconButton, Button, Paper, Typography, Divider, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { ReactComponent as sOhmTokenImg } from "../../assets/tokens/token_sOHM.svg";
import { ReactComponent as OhmTokenImg } from "../../assets/tokens/token_OHM.svg";
import { ReactComponent as t33TokenImg } from "../../assets/tokens/token_33T.svg";
import { ReactComponent as WETHTokenImg } from "../../assets/tokens/wETH.svg";
import { ReactComponent as FRAXTokenImg } from "../../assets/tokens/FRAX.svg";
import { ReactComponent as AbracadabraTokenImg } from "../../assets/tokens/MIM.svg";
import RariTokenImg from "../../assets/tokens/RARI.png";

import "./ohmmenu.scss";
import { dai, frax } from "src/helpers/AllBonds";
import { useWeb3Context } from "../../hooks/web3Context";
import { trim, formatCurrency } from "../../helpers";

import OhmImg from "src/assets/tokens/token_OHM.svg";
import SOhmImg from "src/assets/tokens/token_sOHM.svg";
import token33tImg from "src/assets/tokens/token_33T.svg";

import Chart from "../../components/Chart/WalletChart.jsx";
import apollo from "../../lib/apolloClient";

import { rebasesDataQuery, bulletpoints, tooltipItems, tooltipInfoMessages, itemType } from "./treasuryData.js";

const useStyles = makeStyles({
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
});

const ExternalLinkIcon = ({ size = 20 }) => (
  <SvgIcon component={ArrowUpIcon} style={{ height: `${size}px`, width: `${size}px` }} htmlColor="#A3A3A3" />
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

function OhmMenu() {
  const [apy, setApy] = useState(null);
  const [walletView, setWalletView] = useState(false);
  const [ohmView, setOhmView] = useState(false);
  const [returnToMainView, setReturnToMainView] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const theme = useTheme();
  const styles = useStyles();
  apollo(rebasesDataQuery).then(r => {
    let apy = r.data.rebases.map(entry => ({
      apy: Math.pow(parseFloat(entry.percentage) + 1, 365 * 3) * 100,
      timestamp: entry.timestamp,
    }));

    apy = apy.filter(pm => pm.apy < 300000);

    setApy(apy);
  });
  const isEthereumAPIAvailable = window.ethereum;
  const { chainID } = useWeb3Context();

  const networkID = chainID;

  const SOHM_ADDRESS = addresses[networkID].SOHM_ADDRESS;
  const OHM_ADDRESS = addresses[networkID].OHM_ADDRESS;
  const PT_TOKEN_ADDRESS = addresses[networkID].PT_TOKEN_ADDRESS;

  const ohmViewFunc = info => async () => {
    if (info === "Return") {
      setReturnToMainView(!returnToMainView);
      setOhmView(!ohmView);
    } else {
      setOhmView(!ohmView);
      setWalletView(!walletView);
    }
  };

  const walletViewFunc = () => async () => {
    setWalletView(!walletView);
  };

  const id = "ohm-popper";
  const daiAddress = dai.getAddressForReserve(networkID);
  const fraxAddress = frax.getAddressForReserve(networkID);
  return (
    <>
      <Button
        onClick={() => setIsMenuOpen(true)}
        id="ohm-menu-button"
        size="large"
        variant="contained"
        color="secondary"
        title="OHM"
        aria-describedby={id}
      >
        <SvgIcon component={InfoIcon} color="primary" />
        <Typography>OHM</Typography>
      </Button>
      <Drawer anchor="right" open={isMenuOpen} classes={{ paper: styles.menuContainer }}>
        <IconButton
          size="small"
          color="primary"
          variant="contained"
          aria-label="close ohm wallet"
          onClick={() => setIsMenuOpen(false)}
          className={styles.closeMenuButton}
        >
          <SvgIcon component={XIcon} color="primary" />
        </IconButton>
        <Chart
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
        />
        <Box>
          <Button variant="contained" color="secondary" onClick={walletViewFunc()}>
            <Typography align="left">
              {" "}
              <SvgIcon component={OhmTokenImg} viewBox="0 0 32 32" style={{ height: "15px", width: "15px" }} />
              sOHM
            </Typography>
          </Button>
        </Box>
        <Box className="ohm-pairs">
          <Button variant="contained" color="secondary" onClick={ohmViewFunc()}>
            <Typography align="left">
              {" "}
              <SvgIcon component={OhmTokenImg} viewBox="0 0 32 32" style={{ height: "15px", width: "15px" }} />
              OHM
            </Typography>
          </Button>
        </Box>
        <Box className="ohm-pairs">
          <Button variant="contained" color="secondary" onClick={ohmViewFunc()}>
            <Typography align="left">
              {" "}
              <SvgIcon component={OhmTokenImg} viewBox="0 0 32 32" style={{ height: "15px", width: "15px" }} />
              wsOHM
            </Typography>
          </Button>
        </Box>
        <Box className="ohm-pairs">
          <Button variant="contained" color="secondary" onClick={ohmViewFunc()}>
            <Typography align="left">
              {" "}
              <SvgIcon component={OhmTokenImg} viewBox="0 0 32 32" style={{ height: "15px", width: "15px" }} />
              3TT
            </Typography>
          </Button>
        </Box>

        <Divider color="secondary" className="less-margin" />

        <Box className={styles.menuItem}>
          <MenuItemBond Icon1={WETHTokenImg} Icon2={WETHTokenImg} lpName={`BANK-ETH SLP`} />
          <Typography align="right" variant="body2" className={styles.viewAllBonds}>
            View all bond discounts
          </Typography>
        </Box>

        <Divider color="secondary" className="less-margin" />

        <MenuItemBorrow borrowOn="Abracadabra" Icon1={OhmTokenImg} Icon2={AbracadabraTokenImg} />
        <MenuItemBorrow borrowOn="Rari" Icon1={OhmTokenImg} Icon2={props => <img src={RariTokenImg} {...props} />} />

        <Divider color="secondary" className="less-margin" />
        <Box component="div" sx={{ flexWrap: "nowrap", display: "flex" }}>
          <ExternalLink href={`https://app.sushi.com/swap?inputCurrency=${daiAddress}&outputCurrency=${OHM_ADDRESS}`}>
            <Button size="large" variant="contained" color="secondary">
              <Typography style={{ lineHeight: "20px" }}>
                Buy on Sushiswap <ExternalLinkIcon />
              </Typography>
            </Button>
          </ExternalLink>

          <ExternalLink
            href={`https://app.uniswap.org/#/swap?inputCurrency=${fraxAddress}&outputCurrency=${OHM_ADDRESS}`}
          >
            <Button size="large" variant="contained" color="secondary">
              <Typography style={{ lineHeight: "20px" }}>
                Buy on Uniswap <ExternalLinkIcon />
              </Typography>
            </Button>
          </ExternalLink>

          <ExternalLink href={`https://dune.xyz/shadow/Olympus-(OHM)`}>
            <Button size="large" variant="contained" color="secondary">
              <Typography style={{ lineHeight: "20px" }}>
                View on Dune Analytics <ExternalLinkIcon />
              </Typography>
            </Button>
          </ExternalLink>
        </Box>

        <Divider color="secondary" className="less-margin" />

        <Typography>View Transaction History</Typography>
      </Drawer>
    </>
  );
}

export default OhmMenu;
