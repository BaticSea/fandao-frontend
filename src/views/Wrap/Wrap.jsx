import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
  SvgIcon,
  makeStyles,
  Select,
  MenuItem,
} from "@material-ui/core";
import InfoTooltip from "../../components/InfoTooltip/InfoTooltip.jsx";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";

import { getFanTokenImage, getTokenImage, trim, formatCurrency } from "../../helpers";
import { changeApproval, changeWrap, changeWrapV2 } from "../../slices/WrapThunk";
import { migrateWithType, migrateCrossChainWSFAN } from "../../slices/MigrateThunk";
import { switchNetwork } from "../../slices/NetworkSlice";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText, txnButtonTextMultiType } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { NETWORKS } from "../../constants";
import { ethers } from "ethers";
import "../Stake/stake.scss";
import { Metric, MetricCollection } from "src/components/Metric";
import { t } from "@lingui/macro";
import { useAppSelector } from "src/hooks/index.ts";
import WrapCrossChain from "./WrapCrossChain.tsx";
import { loadAccountDetails } from "src/slices/AccountSlice";

const useStyles = makeStyles(theme => ({
  textHighlight: {
    color: theme.palette.highlight,
  },
}));

function Wrap() {
  const dispatch = useDispatch();
  const { provider, address, connect } = useWeb3Context();
  const networkId = useSelector(state => state.network.networkId);
  const networkName = useSelector(state => state.network.networkName);

  const [zoomed, setZoomed] = useState(false);
  const [assetFrom, setAssetFrom] = useState("sFAN");
  const [assetTo, setAssetTo] = useState("gFAN");
  const [quantity, setQuantity] = useState("");

  const chooseCurrentAction = () => {
    if (assetFrom === "sFAN") return "Wrap from";
    if (assetTo === "sFAN") return "Unwrap from";
    return "Transform";
  };
  const currentAction = chooseCurrentAction();

  const classes = useStyles();

  const isAppLoading = useSelector(state => state.app.loading);
  const isAccountLoading = useSelector(state => state.account.loading);
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });

  const sFanPrice = useSelector(state => {
    return state.app.marketPrice;
  });

  const gFanPrice = useSelector(state => {
    return state.app.marketPrice * state.app.currentIndex;
  });

  const sfanBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.sfan;
  });

  const gfanBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.gfan;
  });

  const unwrapGfanAllowance = useAppSelector(state => {
    return state.account.wrapping && state.account.wrapping.gFanUnwrap;
  });

  const wrapSfanAllowance = useAppSelector(state => {
    return state.account.wrapping && state.account.wrapping.sfanWrap;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const avax = NETWORKS[43114];
  const arbitrum = NETWORKS[42161];

  const isAvax = useMemo(() => networkId != 1 && networkId != 4 && networkId != -1, [networkId]);

  const wrapButtonText =
    assetTo === "gFAN" ? (assetFrom === "wsFAN" ? "Migrate" : "Wrap") + " to gFAN" : `${currentAction} ${assetFrom}`;

  const setMax = () => {
    if (assetFrom === "sFAN") setQuantity(sfanBalance);
    if (assetFrom === "gFAN") setQuantity(gfanBalance);
  };

  const handleSwitchChain = id => {
    return () => {
      dispatch(switchNetwork({ provider: provider, networkId: id }));
      dispatch(loadAccountDetails({ address, provider, networkID: id }));
    };
  };

  const hasCorrectAllowance = useCallback(() => {
    if (assetFrom === "sFAN" && assetTo === "gFAN") return wrapSfanAllowance > Number(sfanBalance);
    if (assetFrom === "gFAN" && assetTo === "sFAN") return unwrapGfanAllowance > Number(gfanBalance);

    return 0;
  }, [unwrapGfanAllowance, wrapSfanAllowance, assetTo, assetFrom, sfanBalance, gfanBalance]);

  const isAllowanceDataLoading = currentAction === "Unwrap";
  // const convertedQuantity = 0;
  const convertedQuantity = useMemo(() => {
    if (assetFrom === "sFAN") {
      return quantity / currentIndex;
    } else if (assetTo === "sFAN") {
      return quantity * currentIndex;
    } else {
      return quantity;
    }
  }, [quantity]);

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const changeAssetFrom = event => {
    setQuantity("");
    setAssetFrom(event.target.value);
  };

  const changeAssetTo = event => {
    setQuantity("");
    setAssetTo(event.target.value);
  };

  const approveWrap = token => {
    dispatch(changeApproval({ address, token: token.toLowerCase(), provider, networkID: networkId }));
  };

  const unwrapGfan = () => {
    dispatch(changeWrapV2({ action: "unwrap", value: quantity, provider, address, networkID: networkId }));
  };

  const wrapSfan = () => {
    dispatch(changeWrapV2({ action: "wrap", value: quantity, provider, address, networkID: networkId }));
  };

  const approveCorrectToken = () => {
    if (assetFrom === "sFAN" && assetTo === "gFAN") approveWrap("sFAN");
    if (assetFrom === "gFAN" && assetTo === "sFAN") approveWrap("gFAN");
  };

  const chooseCorrectWrappingFunction = () => {
    if (assetFrom === "sFAN" && assetTo === "gFAN") wrapSfan();
    if (assetFrom === "gFAN" && assetTo === "sFAN") unwrapGfan();
  };

  const chooseInputArea = () => {
    if (!address || isAllowanceDataLoading) return <Skeleton width="150px" />;
    if (assetFrom === assetTo) return "";
    if (!hasCorrectAllowance() && assetTo === "gFAN")
      return (
        <div className="no-input-visible">
          First time wrapping to <b>gFAN</b>?
          <br />
          Please approve Olympus to use your <b>{assetFrom}</b> for this transaction.
        </div>
      );
    else if (!hasCorrectAllowance() && assetTo === "sFAN")
      return (
        <div className="no-input-visible">
          First time unwrapping <b>{assetFrom}</b>?
          <br />
          Please approve Olympus to use your <b>{assetFrom}</b> for unwrapping.
        </div>
      );

    return (
      <FormControl className="fan-input" variant="outlined" color="primary">
        <InputLabel htmlFor="amount-input"></InputLabel>
        <OutlinedInput
          id="amount-input"
          type="number"
          placeholder="Enter an amount"
          className="stake-input"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          labelWidth={0}
          endAdornment={
            <InputAdornment position="end">
              <Button variant="text" onClick={setMax} color="inherit">
                Max
              </Button>
            </InputAdornment>
          }
        />
      </FormControl>
    );
  };

  const chooseButtonArea = () => {
    if (!address) return "";
    if (assetFrom === assetTo) return "";
    if (!hasCorrectAllowance())
      return (
        <Button
          className="stake-button wrap-page"
          variant="contained"
          color="primary"
          disabled={
            isPendingTxn(pendingTransactions, "approve_wrapping") ||
            isPendingTxn(pendingTransactions, "approve_migration")
          }
          onClick={approveCorrectToken}
        >
          {txnButtonTextMultiType(pendingTransactions, ["approve_wrapping", "approve_migration"], "Approve")}
        </Button>
      );

    if (hasCorrectAllowance())
      return (
        <Button
          className="stake-button wrap-page"
          variant="contained"
          color="primary"
          disabled={isPendingTxn(pendingTransactions, "wrapping") || isPendingTxn(pendingTransactions, "migrate")}
          onClick={chooseCorrectWrappingFunction}
        >
          {txnButtonTextMultiType(pendingTransactions, ["wrapping", "migrate"], wrapButtonText)}
        </Button>
      );
  };

  if (!isAvax) {
    return (
      <div id="stake-view" className="wrapper">
        <Zoom in={true} onEntered={() => setZoomed(true)}>
          <Paper className={`fan-card`}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <div className="card-header">
                  <Typography variant="h5">Wrap / Unwrap</Typography>
                  <Link
                    className="migrate-sfan-button"
                    style={{ textDecoration: "none" }}
                    href={
                      assetTo === "wsFAN"
                        ? "https://docs.olympusdao.finance/main/contracts/tokens#wsfan"
                        : "https://docs.olympusdao.finance/main/contracts/tokens#gfan"
                    }
                    aria-label="wsfan-wut"
                    target="_blank"
                  >
                    <Typography>gFAN</Typography>{" "}
                    <SvgIcon component={ArrowUp} color="primary" style={{ marginLeft: "5px", width: ".8em" }} />
                  </Link>
                </div>
              </Grid>
              <Grid item>
                <MetricCollection>
                  <Metric
                    label={`sFAN ${t`Price`}`}
                    metric={formatCurrency(sFanPrice, 2)}
                    isLoading={sFanPrice ? false : true}
                  />
                  <Metric
                    label={t`Current Index`}
                    metric={trim(currentIndex, 1)}
                    isLoading={currentIndex ? false : true}
                  />
                  <Metric
                    label={`${assetTo} ${t`Price`}`}
                    metric={formatCurrency(gFanPrice, 2)}
                    isLoading={gFanPrice ? false : true}
                    tooltip={`${assetTo} = sFAN * index\n\nThe price of ${assetTo} is equal to the price of FAN multiplied by the current index`}
                  />
                </MetricCollection>
              </Grid>
              <div className="staking-area">
                {!address ? (
                  <div className="stake-wallet-notification">
                    <div className="wallet-menu" id="wallet-menu">
                      {modalButton}
                    </div>
                    <Typography variant="h6">Connect your wallet</Typography>
                  </div>
                ) : (
                  <>
                    <Box className="stake-action-area">
                      <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <>
                          <Typography>
                            <span className="asset-select-label">{currentAction}</span>
                          </Typography>
                          <FormControl
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              margin: "0 10px",
                              height: "33px",
                              minWidth: "69px",
                            }}
                          >
                            <Select
                              id="asset-select"
                              value={assetFrom}
                              label="Asset"
                              onChange={changeAssetFrom}
                              disableUnderline
                            >
                              <MenuItem value={"sFAN"}>sFAN</MenuItem>
                              <MenuItem value={"gFAN"}>gFAN</MenuItem>
                            </Select>
                          </FormControl>

                          <Typography>
                            <span className="asset-select-label"> to </span>
                          </Typography>
                          <FormControl
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              margin: "0 10px",
                              height: "33px",
                              minWidth: "69px",
                            }}
                          >
                            <Select
                              id="asset-select"
                              value={assetTo}
                              label="Asset"
                              onChange={changeAssetTo}
                              disableUnderline
                            >
                              <MenuItem value={"gFAN"}>gFAN</MenuItem>
                              <MenuItem value={"sFAN"}>sFAN</MenuItem>
                            </Select>
                          </FormControl>
                        </>
                      </Box>
                      <Box display="flex" alignItems="center" style={{ paddingBottom: 0 }}>
                        <div className="stake-tab-panel wrap-page">
                          {chooseInputArea()}
                          {chooseButtonArea()}
                        </div>
                      </Box>
                    </Box>
                    <div className={`stake-user-data`}>
                      <>
                        <div className="data-row">
                          <Typography variant="body1">sFAN Balance</Typography>
                          <Typography variant="body1">
                            {isAppLoading ? <Skeleton width="80px" /> : <>{trim(sfanBalance, 4)} sFAN</>}
                          </Typography>
                        </div>
                        <div className="data-row">
                          <Typography variant="body1">gFAN Balance</Typography>
                          <Typography variant="body1">
                            {isAppLoading ? <Skeleton width="80px" /> : <>{trim(gfanBalance, 4)} gFAN</>}
                          </Typography>
                        </div>

                        <Divider />
                        <Box width="100%" align="center" p={1}>
                          <Typography variant="body1" style={{ margin: "15px 0 10px 0" }}>
                            Got wsFAN on Avalanche or Arbitrum? Click below to switch networks and migrate to gFAN (no
                            bridge required!)
                          </Typography>
                          <Button
                            onClick={handleSwitchChain(43114)}
                            variant="outlined"
                            p={1}
                            style={{ margin: "0.3rem" }}
                          >
                            <img height="28px" width="28px" src={avax.image} alt={avax.imageAltText} />
                            <Typography variant="h6" style={{ marginLeft: "8px" }}>
                              {avax.chainName}
                            </Typography>
                          </Button>
                          <Button
                            onClick={handleSwitchChain(42161)}
                            variant="outlined"
                            p={1}
                            style={{ margin: "0.3rem" }}
                          >
                            <img height="28px" width="28px" src={arbitrum.image} alt={arbitrum.imageAltText} />
                            <Typography variant="h6" style={{ marginLeft: "8px" }}>
                              {arbitrum.chainName}
                            </Typography>
                          </Button>
                        </Box>
                      </>
                    </div>
                  </>
                )}
              </div>
            </Grid>
          </Paper>
        </Zoom>
      </div>
    );
  } else {
    return <WrapCrossChain />;
  }
}

export default Wrap;
