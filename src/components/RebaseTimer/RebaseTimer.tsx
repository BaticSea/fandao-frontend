import { Skeleton } from "@material-ui/lab";
import { useDispatch } from "react-redux";
import { Box, Typography } from "@material-ui/core";
import { Trans } from "@lingui/macro";
import { useEffect, useMemo, useState } from "react";
import { getRebaseBlock, secondsUntilBlock, prettifySeconds } from "../../helpers";

import { useAppSelector } from "../../hooks";
import { loadAppDetails } from "../../slices/AppSlice";
import { useWeb3Context } from "../../hooks/web3Context";

import "./rebasetimer.scss";

const SECONDS_TO_REFRESH = 60;

function RebaseTimer() {
  const dispatch = useDispatch();
  const { provider, chainID } = useWeb3Context();

  const [rebaseString, setRebaseString] = useState<unknown>("");
  const [secondsToRebase, setSecondsToRebase] = useState<number>(0);
  const [secondsToRefresh, setSecondsToRefresh] = useState<number>(SECONDS_TO_REFRESH);

  const currentBlock = useAppSelector(state => state.app.currentBlock);

  function initializeTimer() {
    if (currentBlock) {
      const rebaseBlock = getRebaseBlock(currentBlock);
      const seconds = secondsUntilBlock(currentBlock, rebaseBlock);
      setSecondsToRebase(seconds);
      const prettified = prettifySeconds(seconds);
      setRebaseString(prettified !== "" ? prettified : <Trans>Less than a minute</Trans>);
    }
  }

  // This initializes secondsToRebase as soon as currentBlock becomes available
  useMemo(() => {
    if (currentBlock) {
      initializeTimer();
    }
  }, [currentBlock]);

  // After every period SECONDS_TO_REFRESH, decrement secondsToRebase by SECONDS_TO_REFRESH,
  // keeping the display up to date without requiring an on chain request to update currentBlock.
  useEffect(() => {
    let interval: number = 0;
    if (secondsToRefresh > 0) {
      interval = window.setInterval(() => {
        setSecondsToRefresh(secondsToRefresh => secondsToRefresh - 1);
      }, 1000);
    } else {
      // When the countdown goes negative, reload the app details and reinitialize the timer
      if (secondsToRebase < 0) {
        async function reload() {
          await dispatch(loadAppDetails({ networkID: chainID, provider: provider }));
        }
        reload();
        setRebaseString("");
      } else {
        window.clearInterval(interval);
        setSecondsToRebase(secondsToRebase => secondsToRebase - SECONDS_TO_REFRESH);
        setSecondsToRefresh(SECONDS_TO_REFRESH);
        const prettified = prettifySeconds(secondsToRebase);
        setRebaseString(prettified !== "" ? prettified : <Trans>Less than a minute</Trans>);
      }
    }
    return () => window.clearInterval(interval);
  }, [secondsToRebase, secondsToRefresh]);

  return (
    <Box className="rebase-timer">
      <Typography variant="body2">
        {currentBlock ? (
          secondsToRebase > 0 ? (
            <>
              <strong>{rebaseString}&nbsp;</strong>
              <Trans>to next rebase</Trans>
            </>
          ) : (
            <strong>rebasing</strong>
          )
        ) : (
          <Skeleton width="155px" />
        )}
      </Typography>
    </Box>
  );
}

export default RebaseTimer;
