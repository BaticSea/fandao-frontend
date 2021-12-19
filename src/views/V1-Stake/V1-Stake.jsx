import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { t, Trans } from "@lingui/macro";
import NewReleases from "@material-ui/icons/NewReleases";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TabPanel from "../../components/TabPanel";
import { MigrateButton, LearnMoreButton } from "src/components/CallToAction/CallToAction";
import { getFanTokenImage, getTokenImage, trim } from "../../helpers";
import { changeApproval, changeStake } from "../../slices/StakeThunk";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "../Stake/stake.scss";
import "./v1stake.scss";
import StakeRow from "../Stake/StakeRow";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import ExternalStakePool from "../Stake/ExternalStakePool";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";
import { getMigrationAllowances } from "src/slices/AccountSlice";
import { useAppSelector } from "src/hooks";
import { useHistory } from "react-router-dom";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const sFanImg = getTokenImage("sfan");
const fanImg = getFanTokenImage(16, 16);

function V1Stake({ oldAssetsDetected, setMigrationModalOpen, hasActiveV1Bonds }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { provider, address, connect } = useWeb3Context();

  const chainID = useAppSelector(state => state.network.networkId);

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");

  const isAppLoading = useSelector(state => state.app.loading);
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });
  const fiveDayRate = useSelector(state => {
    return state.app.fiveDayRate;
  });
  const fanBalance = useSelector(state => {
    return state.account.balances && state.account.balances.fanV1;
  });
  const sfanBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sfanV1;
  });
  const fsfanBalance = useSelector(state => {
    return state.account.balances && state.account.balances.fsfan;
  });
  const wsfanBalance = useSelector(state => {
    return state.account.balances && state.account.balances.wsfan;
  });
  const stakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.fanStakeV1;
  });
  const unstakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.fanUnstakeV1;
  });
  const stakingRebase = useSelector(state => {
    return state.app.stakingRebase;
  });
  const stakingAPY = useSelector(state => {
    return state.app.stakingAPY;
  });
  const stakingTVL = useSelector(state => {
    return state.app.stakingTVL;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const fiatDaowsfanBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.fiatDaowsfan;
  });

  const gFanBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.gfan;
  });
  const sfanV2Balance = useSelector(state => {
    return state.account.balances && state.account.balances.sfan;
  });

  const calculateWrappedAsSfan = balance => {
    return Number(balance) * Number(currentIndex);
  };
  const fiatDaoAsSfan = calculateWrappedAsSfan(fiatDaowsfanBalance);
  const gFanAsSfan = calculateWrappedAsSfan(gFanBalance);
  const wsfanAsSfan = calculateWrappedAsSfan(wsfanBalance);

  const setMax = () => {
    if (view === 0) {
      setQuantity(fanBalance);
    } else {
      setQuantity(sfanBalance);
    }
  };

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID, version2: false }));
  };

  const onChangeStake = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity, "gwei");
    if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(fanBalance, "gwei"))) {
      return dispatch(error("You cannot stake more than your FAN balance."));
    }

    if (action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(sfanBalance, "gwei"))) {
      return dispatch(error("You cannot unstake more than your sFAN balance."));
    }

    await dispatch(
      changeStake({ address, action, value: quantity.toString(), provider, networkID: chainID, version2: false }),
    );
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "fan") return stakeAllowance > 0;
      if (token === "sfan") return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance],
  );

  const isAllowanceDataLoading = (stakeAllowance == null && view === 0) || (unstakeAllowance == null && view === 1);

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const changeView = (event, newView) => {
    setView(newView);
  };

  const trimmedBalance = Number(
    [sfanBalance, gFanAsSfan, sfanV2Balance, wsfanAsSfan, fiatDaoAsSfan, fsfanBalance]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );
  const trimmedStakingAPY = trim(stakingAPY * 100, 1);
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((stakingRebasePercentage / 100) * trimmedBalance, 4);

  const goToV2Stake = () => {
    history.push("/stake");
  };

  const goToBonds = () => {
    history.push("/bonds");
  };

  return (
    <div id="v1-stake-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className={`fan-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">
                  <Trans>Single Stake</Trans> (3, 3)
                </Typography>
                <RebaseTimer />
              </div>
            </Grid>

            <Grid item>
              <div className="stake-top-metrics">
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-apy">
                      <Typography variant="h5" color="textSecondary">
                        <Trans>APY</Trans> (v1)
                      </Typography>
                      <Typography variant="h4">
                        {stakingAPY ? (
                          <>{new Intl.NumberFormat("en-US").format(trimmedStakingAPY)}%</>
                        ) : (
                          <Skeleton width="150px" />
                        )}
                      </Typography>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-tvl">
                      <Typography variant="h5" color="textSecondary">
                        <Trans>TVL</Trans> (v1)
                      </Typography>
                      <Typography variant="h4">
                        {stakingTVL ? (
                          new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0,
                          }).format(stakingTVL)
                        ) : (
                          <Skeleton width="150px" />
                        )}
                      </Typography>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-index">
                      <Typography variant="h5" color="textSecondary">
                        <Trans>Current Index</Trans> (v1)
                      </Typography>
                      <Typography variant="h4">
                        {currentIndex ? <>{trim(currentIndex, 1)} FAN</> : <Skeleton width="150px" />}
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
                  <Typography variant="h6">
                    <Trans>Connect your wallet to stake FAN</Trans>
                  </Typography>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                    <Tabs
                      key={String(zoomed)}
                      centered
                      value={view}
                      textColor="primary"
                      indicatorColor="primary"
                      className="stake-tab-buttons"
                      onChange={changeView}
                      aria-label="stake tabs"
                    >
                      <Tab label={t`Stake`} {...a11yProps(0)} />
                      <Tab label={t`Unstake`} {...a11yProps(1)} />
                    </Tabs>

                    <Box className="help-text">
                      <Typography variant="body1" className="stake-note" color="textSecondary">
                        {view === 0 ? (
                          <>
                            {hasActiveV1Bonds
                              ? t`Once your current bonds have been claimed, you can migrate your assets to stake more FAN`
                              : !oldAssetsDetected
                              ? t`All your assets are migrated`
                              : t`You must complete the migration of your assets to stake additional FAN`}
                          </>
                        ) : (
                          <br />
                        )}
                      </Typography>
                    </Box>

                    <Box className="stake-action-row v1-row " display="flex" alignItems="center">
                      {address && !isAllowanceDataLoading ? (
                        !hasAllowance("sfan") && view === 1 ? (
                          <Box className="help-text">
                            <Typography variant="body1" className="stake-note" color="textSecondary">
                              <>
                                <Trans>First time unstaking</Trans> <b>sFAN</b>?
                                <br />
                                <Trans>Please approve Olympus Dao to use your</Trans> <b>sFAN </b>
                                <Trans> for unstaking</Trans>.
                              </>
                            </Typography>
                          </Box>
                        ) : (
                          <>
                            {view === 1 && (
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
                            )}

                            {view === 0 && <LearnMoreButton />}
                          </>
                        )
                      ) : (
                        <Skeleton width="150px" />
                      )}

                      {!hasActiveV1Bonds && oldAssetsDetected ? (
                        <TabPanel value={view} index={0} className="stake-tab-panel">
                          {isAllowanceDataLoading ? (
                            <Skeleton />
                          ) : (
                            <MigrateButton setMigrationModalOpen={setMigrationModalOpen} btnText={t`Migrate`} />
                          )}
                        </TabPanel>
                      ) : hasActiveV1Bonds ? (
                        <TabPanel value={view} index={0} className="stake-tab-panel call-to-action">
                          <Button
                            className="migrate-button"
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              goToBonds();
                            }}
                          >
                            <Trans>Go to Bonds</Trans>
                          </Button>
                        </TabPanel>
                      ) : (
                        <TabPanel value={view} index={0} className="stake-tab-panel call-to-action">
                          <Button
                            className="migrate-button"
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              goToV2Stake();
                            }}
                          >
                            <Trans>Go to Stake V2</Trans>
                          </Button>
                        </TabPanel>
                      )}

                      <TabPanel value={view} index={1} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && hasAllowance("sfan") ? (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "unstaking")}
                            onClick={() => {
                              onChangeStake("unstake");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "unstaking", t`Unstake FAN`)}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                            onClick={() => {
                              onSeekApproval("sfan");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_unstaking", t`Approve`)}
                          </Button>
                        )}
                      </TabPanel>
                    </Box>
                  </Box>
                  <div className="stake-user-data">
                    <StakeRow
                      title={`${t`Unstaked Balance`} (v1)`}
                      id="user-balance"
                      balance={`${trim(Number(fanBalance), 4)} FAN`}
                      {...{ isAppLoading }}
                    />
                    <Accordion className="stake-accordion" square>
                      <AccordionSummary expandIcon={<ExpandMore className="stake-expand" />}>
                        <StakeRow
                          title={t`Staked Balance`}
                          id="user-staked-balance"
                          balance={`${trimmedBalance} sFAN`}
                          {...{ isAppLoading }}
                        />
                      </AccordionSummary>
                      <AccordionDetails>
                        <StakeRow
                          title={`${t`Single Staking`} (v1)`}
                          balance={`${trim(Number(sfanBalance), 4)} sFAN`}
                          indented
                          {...{ isAppLoading }}
                        />
                        {Number(fsfanBalance) > 0.00009 && (
                          <StakeRow
                            title={`${t`Staked Balance in Fuse`} (v2)`}
                            balance={`${trim(Number(fsfanBalance), 4)} fsFAN`}
                            indented
                            {...{ isAppLoading }}
                          />
                        )}
                        {Number(wsfanBalance) > 0.0 && (
                          <StakeRow
                            title={`${t`Wrapped Balance`} (v1)`}
                            balance={`${trim(Number(wsfanBalance), 4)} wsFAN`}
                            {...{ isAppLoading }}
                            indented
                          />
                        )}
                        {Number(fiatDaowsfanBalance) > 0.00009 && (
                          <StakeRow
                            title={`${t`Wrapped Balance in FiatDAO`} (v1)`}
                            balance={`${trim(Number(fiatDaowsfanBalance), 4)} wsFAN`}
                            {...{ isAppLoading }}
                            indented
                          />
                        )}
                        <StakeRow
                          title={`${t`Single Staking`} (v2)`}
                          balance={`${trim(Number(sfanV2Balance), 4)} sFAN`}
                          indented
                          {...{ isAppLoading }}
                        />
                        <StakeRow
                          title={`${t`Wrapped Balance`} (v2)`}
                          balance={`${trim(Number(gFanBalance), 4)} gFAN`}
                          indented
                          {...{ isAppLoading }}
                        />
                      </AccordionDetails>
                    </Accordion>
                    <Divider color="secondary" />
                    <StakeRow title={t`Next Reward Amount`} balance={`${nextRewardValue} sFAN`} {...{ isAppLoading }} />
                    <StakeRow
                      title={t`Next Reward Yield`}
                      balance={`${stakingRebasePercentage}%`}
                      {...{ isAppLoading }}
                    />
                    <StakeRow
                      title={t`ROI (5-Day Rate)`}
                      balance={`${trim(Number(fiveDayRate) * 100, 4)}%`}
                      {...{ isAppLoading }}
                    />
                  </div>
                </>
              )}
            </div>
          </Grid>
        </Paper>
      </Zoom>

      <ExternalStakePool />
    </div>
  );
}

export default V1Stake;
