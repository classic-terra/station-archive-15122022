import { useQuery } from "react-query"
import axios from "axios"
import { useNetwork } from "data/wallet"
import { useInterchainLCDClient } from "./lcdClient"
import { queryKey, RefetchOptions } from "../query"

export const useNodeInfo = () => {
  const { lcd } = useNetwork()

  return useQuery(
    [queryKey.tendermint.nodeInfo],
    async () => {
      const { data } = await axios.get("node_info", { baseURL: lcd })
      return data
    },
    { ...RefetchOptions.INFINITY }
  )
}

export const useLatestBlock = (chain: string) => {
  const lcd = useInterchainLCDClient()
  return useQuery(
    [queryKey.tendermint.blockInfo, chain],
    async () => {
      const {
        block: {
          header: { height: latestHeight },
        },
      } = await lcd.tendermint.blockInfo(chain)
      return latestHeight
    },
    { ...RefetchOptions.DEFAULT }
  )
}
