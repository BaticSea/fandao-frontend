import { useCallback, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Social from "./Social";
import externalUrls from "./externalUrls";
import { ReactComponent as StakeIcon } from "../../assets/icons/stake.svg";
import { ReactComponent as BondIcon } from "../../assets/icons/bond.svg";
import { ReactComponent as DashboardIcon } from "../../assets/icons/dashboard.svg";
import { ReactComponent as OlympusIcon } from "../../assets/icons/olympus-nav-header.svg";
import { ReactComponent as PoolTogetherIcon } from "../../assets/icons/33-together.svg";
import { Trans } from "@lingui/macro";
import { trim, shorten } from "../../helpers";
import { useAddress, useWeb3Context } from "../../hooks/web3Context";
import useBonds, { IAllBondData } from "../../hooks/Bonds";
import { Paper, Link, Box, Typography, SvgIcon } from "@material-ui/core";
import { NetworkID } from "../../lib/Bond";
import { Skeleton } from "@material-ui/lab";
import "./sidebar.scss";
import { Bond } from "src/lib/Bond";

function NavContent() {
  const [isActive] = useState();
  const address = useAddress();
  const { chainID }: { chainID: NetworkID } = useWeb3Context();
  const { bonds }: { bonds: IAllBondData[] | Bond[] } = useBonds(chainID);
  const { pathname } = useLocation();

  const checkPage = useCallback(
    page => {
      const currentPath = pathname.replace("/", "");
      if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
        return true;
      }
      if (currentPath.indexOf("stake") >= 0 && page === "stake") {
        return true;
      }
      if ((currentPath.indexOf("bonds") >= 0 || currentPath.indexOf("choose_bond") >= 0) && page === "bonds") {
        return true;
      }
      if (currentPath.indexOf("33-together") >= 0 && page === "33-together") {
        return true;
      }
      return false;
    },
    [pathname],
  );

  const mapBondDiscount = () => {
    const newBonds: IAllBondData[] = bonds as IAllBondData[];
    return newBonds.forEach((bond, index) => {
      return (
        <Link component={NavLink} to={`/bonds/${bond.name}`} key={index} className={"bond"}>
          {!bond.bondDiscount ? (
            <Skeleton variant="text" width={"150px"} />
          ) : (
            <Typography variant="body2">
              {bond.displayName}

              <span className="bond-pair-roi">
                {!bond.isAvailable[chainID] ? "Sold Out" : `${bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%`}
              </span>
            </Typography>
          )}
        </Link>
      );
    });
  };

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://olympusdao.finance" target="_blank">
              <SvgIcon
                color="primary"
                component={OlympusIcon}
                viewBox="0 0 151 100"
                style={{ minWidth: "151px", minHeight: "98px", width: "151px" }}
              />
            </Link>

            {address && (
              <div className="wallet-link">
                <Link href={`https://etherscan.io/address/${address}`} target="_blank">
                  {shorten(address)}
                </Link>
              </div>
            )}
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              <Link
                component={NavLink}
                id="dash-nav"
                to="/dashboard"
                isActive={() => checkPage("dashboard")}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={DashboardIcon} />
                  <Trans>Dashboard</Trans>
                </Typography>
              </Link>

              <Link
                component={NavLink}
                id="stake-nav"
                to="/"
                isActive={() => checkPage("stake")}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={StakeIcon} />
                  <Trans>Stake</Trans>
                </Typography>
              </Link>

              <Link
                component={NavLink}
                id="33-together-nav"
                to="/33-together"
                isActive={() => checkPage("33-together")}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={PoolTogetherIcon} />
                  3,3 Together
                </Typography>
              </Link>

              <Link
                component={NavLink}
                id="bond-nav"
                to="/bonds"
                isActive={() => checkPage("bonds")}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={BondIcon} />
                  <Trans>Bond</Trans>
                </Typography>
              </Link>

              <div className="dapp-menu-data discounts">
                <div className="bond-discounts">
                  <Typography variant="body2">
                    <Trans>Bond discounts</Trans>
                  </Typography>
                  {mapBondDiscount}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Box className="dapp-menu-bottom" display="flex" justifyContent="space-between" flexDirection="column">
          <div className="dapp-menu-external-links">
            {Object.keys(externalUrls).map((link: any, i: number) => (
              <Link key={i} href={`${externalUrls[link].url}`} target="_blank">
                <Typography variant="h6">{externalUrls[link].icon}</Typography>
                <Typography variant="h6">{externalUrls[link].title}</Typography>
              </Link>
            ))}
          </div>
          <div className="dapp-menu-social">
            <Social />
          </div>
        </Box>
      </Box>
    </Paper>
  );
}

export default NavContent;
