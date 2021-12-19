import { useSelector } from "react-redux";
import { trim, formatCurrency } from "../../../../helpers";
import { Metric } from "src/components/Metric";
import { t } from "@lingui/macro";

const sharedProps = {
  labelVariant: "h6",
  metricVariant: "h5",
};

export const MarketCap = () => {
  const marketCap = useSelector(state => state.app.marketCap || 0);
  return (
    <Metric
      label={t`Market Cap`}
      metric={formatCurrency(marketCap, 0)}
      isLoading={marketCap ? false : true}
      {...sharedProps}
    />
  );
};

export const FANPrice = () => {
  const marketPrice = useSelector(state => state.app.marketPrice);
  return (
    <Metric
      label={t`FAN Price`}
      metric={marketPrice && formatCurrency(marketPrice, 2)}
      isLoading={marketPrice ? false : true}
      {...sharedProps}
    />
  );
};

export const CircSupply = () => {
  const circSupply = useSelector(state => state.app.circSupply);
  const totalSupply = useSelector(state => state.app.totalSupply);
  const isDataLoaded = circSupply && totalSupply;
  return (
    <Metric
      label={t`Circulating Supply (total)`}
      metric={isDataLoaded && parseInt(circSupply) + " / " + parseInt(totalSupply)}
      isLoading={isDataLoaded ? false : true}
      {...sharedProps}
    />
  );
};

export const BackingPerFAN = () => {
  const backingPerFan = useSelector(state => state.app.treasuryMarketValue / state.app.circSupply);
  return (
    <Metric
      label={t`Backing per FAN`}
      metric={!isNaN(backingPerFan) && formatCurrency(backingPerFan, 2)}
      isLoading={backingPerFan ? false : true}
      {...sharedProps}
    />
  );
};

export const CurrentIndex = () => {
  const currentIndex = useSelector(state => state.app.currentIndex);
  return (
    <Metric
      label={t`Current Index`}
      metric={currentIndex && trim(currentIndex, 2) + " sFAN"}
      isLoading={currentIndex ? false : true}
      {...sharedProps}
      tooltip="The current index tracks the amount of sFAN accumulated since the beginning of staking. Basically, how much sFAN one would have if they staked and held a single FAN from day 1."
    />
  );
};

export const GFANPrice = () => {
  const gFanPrice = useSelector(state => state.app.marketPrice * state.app.currentIndex);
  return (
    <Metric
      className="metric wsoprice"
      label={t`gFAN Price`}
      metric={gFanPrice && formatCurrency(gFanPrice, 2)}
      isLoading={gFanPrice ? false : true}
      {...sharedProps}
      tooltip={`gFAN = sFAN * index\n\nThe price of gFAN is equal to the price of FAN multiplied by the current index`}
    />
  );
};
