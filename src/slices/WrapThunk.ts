import { ethers, BigNumber } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20ABI } from "../abi/IERC20.json";
import { abi as v2sFAN } from "../abi/v2sFanNew.json";
import { clearPendingTxn, fetchPendingTxns, getWrappingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { error, info } from "../slices/MessagesSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import { IERC20, OlympusStakingv2__factory } from "src/typechain";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

export const changeApproval = createAsyncThunk(
  "wrap/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const sfanContract = new ethers.Contract(addresses[networkID].SFAN_V2 as string, ierc20ABI, signer) as IERC20;
    const gfanContract = new ethers.Contract(addresses[networkID].GFAN_ADDRESS as string, ierc20ABI, signer) as IERC20;
    let approveTx;
    let wrapAllowance = await sfanContract.allowance(address, addresses[networkID].STAKING_V2);
    let unwrapAllowance = await gfanContract.allowance(address, addresses[networkID].STAKING_V2);

    try {
      if (token === "sfan") {
        // won't run if wrapAllowance > 0
        approveTx = await sfanContract.approve(
          addresses[networkID].STAKING_V2,
          ethers.utils.parseUnits("1000000000", "gwei"),
        );
      } else if (token === "gfan") {
        approveTx = await gfanContract.approve(
          addresses[networkID].STAKING_V2,
          ethers.utils.parseUnits("1000000000", "ether"),
        );
      }

      const text = "Approve " + (token === "sfan" ? "Wrapping" : "Unwrapping");
      const pendingTxnType = token === "sfan" ? "approve_wrapping" : "approve_unwrapping";
      if (approveTx) {
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
        await approveTx.wait();
        dispatch(info("Successfully Approved!"));
      }
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    // go get fresh allowances
    wrapAllowance = await sfanContract.allowance(address, addresses[networkID].STAKING_V2);
    unwrapAllowance = await gfanContract.allowance(address, addresses[networkID].STAKING_V2);

    return dispatch(
      fetchAccountSuccess({
        wrapping: {
          sfanWrap: Number(ethers.utils.formatUnits(wrapAllowance, "gwei")),
          gFanUnwrap: Number(ethers.utils.formatUnits(unwrapAllowance, "ether")),
        },
      }),
    );
  },
);

export const changeWrapV2 = createAsyncThunk(
  "wrap/changeWrapV2",
  async ({ action, value, provider, address, networkID }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();

    const stakingContract = OlympusStakingv2__factory.connect(addresses[networkID].STAKING_V2, signer);

    let wrapTx;
    let uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };

    try {
      if (action === "wrap") {
        const formattedValue = ethers.utils.parseUnits(value, "gwei");
        uaData.type = "wrap";
        wrapTx = await stakingContract.wrap(address, formattedValue);
        dispatch(fetchPendingTxns({ txnHash: wrapTx.hash, text: getWrappingTypeText(action), type: "wrapping" }));
      } else if (action === "unwrap") {
        const formattedValue = ethers.utils.parseUnits(value, "ether");
        uaData.type = "unwrap";
        wrapTx = await stakingContract.unwrap(address, formattedValue);
        dispatch(fetchPendingTxns({ txnHash: wrapTx.hash, text: getWrappingTypeText(action), type: "wrapping" }));
      }
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to wrap more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (wrapTx) {
        uaData.txHash = wrapTx.hash;
        await wrapTx.wait();
        segmentUA(uaData);
        console.log("getBalances");
        dispatch(getBalances({ address, networkID, provider }));
        dispatch(clearPendingTxn(wrapTx.hash));
      }
    }
  },
);
