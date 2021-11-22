import { useEffect, useState } from "react";
import { useAppSelector } from "src/hooks";
import { Box, Button, SvgIcon, Typography, Popper, Paper, Divider, Link, Slide, Fade } from "@material-ui/core";
import { ReferenceObject } from "popper.js";
import { ReactComponent as ArrowUpIcon } from "src/assets/icons/arrow-up.svg";
import { ReactComponent as CaretDownIcon } from "src/assets/icons/caret-down.svg";
import { useWeb3Context } from "src/hooks/web3Context";
import { Trans } from "@lingui/macro";

interface ConnectMenuProps {
  theme: string;
}

function ConnectMenu({ theme }: ConnectMenuProps) {
  const { connect, disconnect, connected, chainID } = useWeb3Context();
  const [anchorEl, setAnchorEl] = useState<ReferenceObject | null>(null);
  const [isConnected, setConnected] = useState(connected);
  const [isHovering, setIsHovering] = useState(false);

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  let buttonText = <Trans>Connect Wallet</Trans>;
  let clickFunc: React.MouseEventHandler<HTMLElement> = connect;

  const handleClick: React.MouseEventHandler<HTMLElement> = e => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  if (isConnected) {
    buttonText = <Trans>Disconnect</Trans>;
    clickFunc = disconnect;
  }

  if (pendingTransactions && pendingTransactions.length > 0) {
    buttonText = <Trans>In progress</Trans>;
    clickFunc = handleClick;
  }

  const open = Boolean(anchorEl);
  const id = open ? "ohm-popper-pending" : undefined;

  const primaryColor = theme === "light" ? "#49A1F2" : "#F8CC82";
  const buttonStyles =
    "pending-txn-container" + (isHovering && pendingTransactions.length > 0 ? " hovered-button" : "");

  const getEtherscanUrl = (txnHash: string) => {
    return chainID === 4 ? "https://rinkeby.etherscan.io/tx/" + txnHash : "https://etherscan.io/tx/" + txnHash;
  };

  useEffect(() => {
    if (pendingTransactions.length === 0) {
      setAnchorEl(null);
    }
  }, [pendingTransactions]);

  useEffect(() => {
    setConnected(connected);
  }, [connected]);

  return (
    <div
      onMouseEnter={e => (pendingTransactions && pendingTransactions.length > 0 ? handleClick(e) : null)}
      onMouseLeave={e => (pendingTransactions && pendingTransactions.length > 0 ? handleClick(e) : null)}
      className="wallet-menu"
      id="wallet-menu"
    >
      <Button
        id="wallet-button"
        className={buttonStyles}
        variant="contained"
        color="secondary"
        size="large"
        style={pendingTransactions.length > 0 ? { color: primaryColor } : {}}
        onClick={clickFunc}
        onMouseOver={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        key={1}
      >
        {buttonText}
        {pendingTransactions.length > 0 && (
          <Slide direction="left" in={isHovering} {...{ timeout: 333 }}>
            <SvgIcon className="caret-down" component={CaretDownIcon} htmlColor={primaryColor} />
          </Slide>
        )}
      </Button>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-end" transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper className="ohm-menu" elevation={1}>
                {pendingTransactions.map((x, i) => (
                  <Box key={i}>
                    <Link key={x.txnHash} href={getEtherscanUrl(x.txnHash)} target="_blank" rel="noreferrer">
                      <Button size="large" variant="contained" color="secondary" fullWidth>
                        <Typography align="left">
                          {x.text} <SvgIcon component={ArrowUpIcon} />
                        </Typography>
                      </Button>
                    </Link>
                  </Box>
                ))}
                <Box className="add-tokens">
                  <Divider color="secondary" />
                  <Button
                    size="large"
                    variant="contained"
                    color="secondary"
                    onClick={disconnect}
                    style={{ marginBottom: "0px" }}
                    fullWidth
                  >
                    <Typography>
                      <Trans>Disconnect</Trans>
                    </Typography>
                  </Button>
                </Box>
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </div>
  );
}

export default ConnectMenu;
