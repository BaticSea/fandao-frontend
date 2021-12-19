import { useState } from "react";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { NavLink, useLocation } from "react-router-dom";
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box, Fade, Slide } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { ReactComponent as sFanTokenImg } from "../../assets/tokens/token_sFAN.svg";
import { ReactComponent as wsFanTokenImg } from "../../assets/tokens/token_wsFAN.svg";
import { ReactComponent as fanTokenImg } from "../../assets/tokens/token_FAN.svg";
import { ReactComponent as t33TokenImg } from "../../assets/tokens/token_33T.svg";
import "./fanmenu.scss";
import { dai, frax } from "src/helpers/AllBonds";
import { Trans } from "@lingui/macro";
import Grid from "@material-ui/core/Grid";
import FanImg from "src/assets/tokens/token_FAN.svg";
import SFanImg from "src/assets/tokens/token_sFAN.svg";
import WsFanImg from "src/assets/tokens/token_wsFAN.svg";
import token33tImg from "src/assets/tokens/token_33T.svg";
import { segmentUA } from "../../helpers/userAnalyticHelpers";
import { useSelector } from "react-redux";
import { useWeb3Context } from "../../hooks";

const addTokenToWallet = (tokenSymbol, tokenAddress, address) => async () => {
  if (window.ethereum) {
    const host = window.location.origin;
    let tokenPath;
    let tokenDecimals = TOKEN_DECIMALS;
    switch (tokenSymbol) {
      case "FAN":
        tokenPath = FanImg;
        break;
      case "33T":
        tokenPath = token33tImg;
        break;
      case "gFAN":
        tokenPath = WsFanImg;
        tokenDecimals = 18;
        break;
      default:
        tokenPath = SFanImg;
    }
    const imageURL = `${host}/${tokenPath}`;

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: imageURL,
          },
        },
      });
      let uaData = {
        address: address,
        type: "Add Token",
        tokenName: tokenSymbol,
      };
      segmentUA(uaData);
    } catch (error) {
      console.log(error);
    }
  }
};

function FanMenu() {
  const path = useLocation().pathname;
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;
  const { address } = useWeb3Context();
  const networkId = useSelector(state => state.network.networkId);

  const oldAssetsDetected = useSelector(state => {
    return (
      state.account.balances &&
      (Number(state.account.balances.sfanV1) ||
      Number(state.account.balances.fanV1) ||
      Number(state.account.balances.wsfan)
        ? true
        : false)
    );
  });

  const newAssetsDetected = useSelector(state => {
    return (
      state.account.balances &&
      (Number(state.account.balances.gfan) || Number(state.account.balances.sfan) || Number(state.account.balances.fan)
        ? true
        : false)
    );
  });

  const SFAN_ADDRESS = addresses[networkId] && addresses[networkId].SFAN_V2;
  const FAN_ADDRESS = addresses[networkId] && addresses[networkId].FAN_V2;
  const PT_TOKEN_ADDRESS = addresses[networkId] && addresses[networkId].PT_TOKEN_ADDRESS;
  const GFAN_ADDRESS = addresses[networkId] && addresses[networkId].GFAN_ADDRESS;

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = "fan-popper";
  const daiAddress = dai.getAddressForReserve(networkId);
  const fraxAddress = frax.getAddressForReserve(networkId);
  return (
    <Grid
      container
      component="div"
      onMouseEnter={e => handleClick(e)}
      onMouseLeave={e => handleClick(e)}
      id="fan-menu-button-hover"
    >
      <Button id="fan-menu-button" size="large" variant="contained" color="secondary" title="FAN" aria-describedby={id}>
        <SvgIcon component={InfoIcon} color="primary" />
        <Typography className="fan-menu-button-text">FAN</Typography>
      </Button>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper className="fan-menu" elevation={1}>
                <Box component="div" className="buy-tokens">
                  <Link
                    href={`https://app.sushi.com/swap?inputCurrency=${daiAddress}&outputCurrency=${FAN_ADDRESS}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        <Trans>Buy on {new String("Sushiswap")}</Trans>
                        <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link>

                  <Link
                    href={`https://app.uniswap.org/#/swap?inputCurrency=${fraxAddress}&outputCurrency=${FAN_ADDRESS}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        <Trans>Buy on {new String("Uniswap")}</Trans>
                        <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link>

                  {path === "/stake" && oldAssetsDetected && (
                    <Link component={NavLink} to="/v1-stake" style={{ textDecoration: "none" }}>
                      <Button size="large" variant="contained" color="secondary" fullWidth>
                        <Typography align="left">Switch to FAN v1 (Legacy)</Typography>
                      </Button>
                    </Link>
                  )}
                  {path === "/v1-stake" && newAssetsDetected && (
                    <Link component={NavLink} to="/stake" style={{ textDecoration: "none" }}>
                      <Button size="large" variant="contained" color="secondary" fullWidth>
                        <Typography align="left">Switch to FAN v2</Typography>
                      </Button>
                    </Link>
                  )}
                </Box>

                <Box component="div" className="data-links">
                  <Divider color="secondary" className="less-margin" />
                  <Link href={`https://dune.xyz/shadow/Olympus-(FAN)`} target="_blank" rel="noreferrer">
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        Shadow's Dune Dashboard <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link>
                </Box>

                {isEthereumAPIAvailable ? (
                  <Box className="add-tokens">
                    <Divider color="secondary" />
                    <p>
                      <Trans>ADD TOKEN TO WALLET</Trans>
                    </p>
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                      {FAN_ADDRESS && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={addTokenToWallet("FAN", FAN_ADDRESS, address)}
                        >
                          <SvgIcon
                            component={fanTokenImg}
                            viewBox="0 0 32 32"
                            style={{ height: "25px", width: "25px" }}
                          />
                          <Typography variant="body1">FAN</Typography>
                        </Button>
                      )}
                      {SFAN_ADDRESS && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={addTokenToWallet("sFAN", SFAN_ADDRESS, address)}
                        >
                          <SvgIcon
                            component={sFanTokenImg}
                            viewBox="0 0 100 100"
                            style={{ height: "25px", width: "25px" }}
                          />
                          <Typography variant="body1">sFAN</Typography>
                        </Button>
                      )}
                      {GFAN_ADDRESS && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={addTokenToWallet("gFAN", GFAN_ADDRESS, address)}
                        >
                          <SvgIcon
                            component={wsFanTokenImg}
                            viewBox="0 0 180 180"
                            style={{ height: "25px", width: "25px" }}
                          />
                          <Typography variant="body1">gFAN</Typography>
                        </Button>
                      )}
                      {PT_TOKEN_ADDRESS && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={addTokenToWallet("33T", PT_TOKEN_ADDRESS, address)}
                        >
                          <SvgIcon
                            component={t33TokenImg}
                            viewBox="0 0 1000 1000"
                            style={{ height: "25px", width: "25px" }}
                          />
                          <Typography variant="body1">33T</Typography>
                        </Button>
                      )}
                    </Box>
                  </Box>
                ) : null}

                <Divider color="secondary" />
                <Link
                  href="https://docs.olympusdao.finance/using-the-website/unstaking_lp"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button size="large" variant="contained" color="secondary" fullWidth>
                    <Typography align="left">
                      <Trans>Unstake Legacy LP Token</Trans>
                    </Typography>
                  </Button>
                </Link>
                <Link
                  href="https://synapseprotocol.com/?inputCurrency=gFAN&outputCurrency=gFAN&outputChain=43114"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button size="large" variant="contained" color="secondary" fullWidth>
                    <Typography align="left">
                      <Trans>Bridge Tokens</Trans>
                    </Typography>
                  </Button>
                </Link>
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </Grid>
  );
}

export default FanMenu;
