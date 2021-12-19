import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
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
import { changeApproval, changeWrapV2 } from "../../slices/WrapThunk";
import { migrateWithType, migrateCrossChainWSFAN, changeMigrationApproval } from "../../slices/MigrateThunk";
import { switchNetwork } from "../../slices/NetworkSlice";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText, txnButtonTextMultiType } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { NETWORKS } from "../../constants";
import "../Stake/stake.scss";
import { useAppSelector } from "src/hooks/index";
import { getBalances, loadAccountDetails } from "src/slices/AccountSlice";

function WrapCrossChain() {
  const dispatch = useDispatch();
  const { provider, address, connect } = useWeb3Context();
  const networkId = useAppSelector(state => state.network.networkId);
  const networkName = useAppSelector(state => state.network.networkName);
  const [quantity, setQuantity] = useState("");
  const assetFrom = "wsFAN";
  const assetTo = "gFAN";

  const isAppLoading = useAppSelector(state => state.app.loading || state.account.loading);
  const currentIndex =
    useAppSelector(state => {
      return Number(state.app.currentIndex);
    }) ?? 1;

  const marketPrice =
    useAppSelector(state => {
      return state.app.marketPrice;
    }) ?? 0;

  const sFanPrice = marketPrice;

  const gFanPrice = marketPrice * currentIndex;

  const gfanBalance = useAppSelector(state => {
    return state.account.balances && Number(state.account.balances.gfan);
  });

  const wsFanAllowance = useAppSelector(state => state.account.migration.wsfan);
  const wsFanBalance = useAppSelector(state => Number(state.account.balances.wsfan));

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const ethereum = NETWORKS[1];

  const wrapButtonText = "Migrate";

  const setMax = () => {
    setQuantity(wsFanBalance.toString());
  };

  const handleSwitchChain = (id: any) => {
    return () => {
      dispatch(switchNetwork({ provider, networkId: id }));
      dispatch(loadAccountDetails({ address, provider, networkID: id }));
    };
  };

  const hasCorrectAllowance = useCallback(() => {
    return wsFanAllowance > wsFanBalance;
  }, [wsFanBalance, wsFanAllowance]);

  const isDataLoading = useAppSelector(state => state.account.loading);

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const migrateToGfan = () =>
    dispatch(
      migrateCrossChainWSFAN({
        provider,
        address,
        networkID: networkId,
        value: quantity,
      }),
    );

  const approveWrap = () => {
    dispatch(
      changeMigrationApproval({
        token: "wsfan",
        displayName: "wsFAN",
        insertName: true,
        address,
        networkID: networkId,
        provider,
      }),
    );
  };

  const chooseInputArea = () => {
    if (!address || isAppLoading) return <Skeleton width="80%" />;
    if (!hasCorrectAllowance() && assetTo === "gFAN")
      return (
        <div className="no-input-visible">
          First time wrapping to <b>gFAN</b>?
          <br />
          Please approve Olympus to use your <b>{assetFrom}</b> for this transaction.
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
          onClick={approveWrap}
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
          onClick={migrateToGfan}
        >
          {txnButtonTextMultiType(pendingTransactions, ["wrapping", "migrate"], wrapButtonText)}
        </Button>
      );
  };

  return (
    <div id="stake-view" className="wrapper">
      <Zoom in={true}>
        <Paper className={`fan-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">Wrap / Unwrap</Typography>
                <Link
                  className="migrate-sfan-button"
                  style={{ textDecoration: "none" }}
                  href={"https://docs.olympusdao.finance/main/contracts/tokens#gfan"}
                  aria-label="wsfan-wut"
                  target="_blank"
                >
                  <Typography>gFAN</Typography>{" "}
                  <SvgIcon component={ArrowUp} color="primary" style={{ marginLeft: "5px", width: ".8em" }} />
                </Link>
              </div>
            </Grid>

            <Grid item>
              <div className="stake-top-metrics">
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="wrap-sFAN">
                      <Typography variant="h5" color="textSecondary">
                        sFAN Price
                      </Typography>
                      <Typography variant="h4">
                        {sFanPrice ? formatCurrency(sFanPrice, 2) : <Skeleton width="150px" />}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="wrap-index">
                      <Typography variant="h5" color="textSecondary">
                        Current Index
                      </Typography>
                      <Typography variant="h4">
                        {currentIndex ? <>{trim(currentIndex, 1)} FAN</> : <Skeleton width="150px" />}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="wrap-wsFAN">
                      <Typography variant="h5" color="textSecondary">
                        {`${assetTo} Price`}
                        <InfoTooltip
                          message={`${assetTo} = sFAN * index\n\nThe price of ${assetTo} is equal to the price of FAN multiplied by the current index`}
                          children={undefined}
                        />
                      </Typography>
                      <Typography variant="h4">
                        {gFanPrice ? formatCurrency(gFanPrice, 2) : <Skeleton width="150px" />}
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </div>
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
                      <Box height="32px">
                        <Typography>
                          Transform <b>wsFAN</b> to <b>gFAN</b>
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" style={{ paddingBottom: 0 }}>
                      <div className="stake-tab-panel wrap-page">
                        {chooseInputArea()}
                        {chooseButtonArea()}
                      </div>
                    </Box>
                  </Box>
                  <div className={`stake-user-data`}>
                    <div className="data-row">
                      <Typography variant="body1">wsFAN Balance ({networkName})</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(wsFanBalance, 4) + " wsFAN"}</>}
                      </Typography>
                    </div>
                    <div className="data-row">
                      <Typography variant="body1">gFAN Balance ({networkName})</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(gfanBalance, 4) + " gFAN"}</>}
                      </Typography>
                    </div>
                    <Divider />
                    <Box width="100%" alignItems={"center"} display="flex" flexDirection="column" p={1}>
                      <Typography variant="h6" style={{ margin: "15px 0 10px 0" }}>
                        Back to Ethereum Mainnet
                      </Typography>
                      <Button onClick={handleSwitchChain(1)} variant="outlined">
                        <img height="28px" width="28px" src={String(ethereum.image)} alt={ethereum.imageAltText} />
                        <Typography variant="h6" style={{ marginLeft: "8px" }}>
                          {ethereum.chainName}
                        </Typography>
                      </Button>
                    </Box>
                  </div>
                </>
              )}
            </div>
          </Grid>
        </Paper>
      </Zoom>
    </div>
  );
}

export default WrapCrossChain;
