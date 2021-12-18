import { BigNumber } from 'ethers';
import { TransactionResponse } from '@ethersproject/abstract-provider';

import { transactionType, EthereumTransactionTypeExtended } from '@aave/protocol-js';

const handleTX = async (extendedTxData: transactionType | undefined, provider: any) => {
  if (!extendedTxData) return;

  const { from, ...txData } = extendedTxData;
  const signer = provider.getSigner(from);
  let txResponse: TransactionResponse | undefined;
  try {
    txResponse = await signer.sendTransaction({
      ...txData,
      value: txData.value ? BigNumber.from(txData.value) : undefined,
    });
  } catch (e) {
    console.error('send-ethereum-tx', e);
    return;
  }
  const txHash = txResponse?.hash;
  if (txResponse) {
    try {
      const txReceipt = await txResponse.wait(1);
      console.log(txReceipt);
    } catch (e) {
      // let error = 'network error has occurred, please check tx status in an explorer';
      // try {
      // let tx = await provider.getTransaction(txResponse.hash);
      // // @ts-ignore TODO: need think about "tx" type
      // const code = await provider.call(tx, tx.blockNumber);
      // error = hexToAscii(code.substr(138));
      // } catch (e) {
      //   console.log('network error', e);
      // }
    }
  }
};

export const handleSend = async (
  txs: EthereumTransactionTypeExtended[],
  provider: any
): Promise<void> => {
  const approvalTx = txs.find((tx) => tx.txType === 'ERC20_APPROVAL');
  const actionTx = txs.find((tx) =>
    [
      'DLP_ACTION',
      'GOVERNANCE_ACTION',
      'STAKE_ACTION',
      'GOV_DELEGATION_ACTION',
      'REWARD_ACTION',
      'FAUCET_MINT',
    ].includes(tx.txType)
  );
  if (approvalTx) {
    try {
      let extendedTxData: transactionType = {};
      extendedTxData = await approvalTx.tx();
      await handleTX(extendedTxData, provider);
    } catch (e) {
      console.log('approval error', e);
      return;
    }
  }
  if (actionTx) {
    try {
      let extendedTxData: transactionType = {};
      extendedTxData = await actionTx.tx();
      await handleTX(extendedTxData, provider);
    } catch (e) {
      console.log('action error', e);
      return;
    }
  }
};
