import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
/**
 *  @notice useMoralis 是 Moralis 框架中的一个钩子函数（Hook），它可以帮助我们在 React 组件中访问
 *          Moralis 后端服务的实例，并进行各种操作，例如查询数据库、调用云函数、执行智能合约等.
 *          通过 useMoralis 返回的 Moralis 实例，我们可以访问 Moralis 提供的各种功能和方法
 */
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "@web3uikit/core"
import { Bell } from '@web3uikit/icons'


export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: enterRaffle, isLoading, isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee
    })

    /**
     * @dev useWeb3Contract 是 React Moralis 中的一个钩子函数，
     *      它可以帮助我们创建和管理 Web3 智能合约的实例，并与之进行交互，以便实现各种区块链操作和功能开发
     */
    const { runContractFunction: getEntranceFee } =  useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {}
    })

    const updateUI = async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if(isWeb3Enabled) {
            updateUI()
        }   
    }, [isWeb3Enabled])

    const handleSuccess = async function(tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = function() {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
            icon: <Bell/>
        })
    }

    return (
        <div className="p-5">
            Hi from lottery entrance! 
            {raffleAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded ml-auto" 
                        onClick={async function() { 
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error)
                            })
                        }}
                        disabled = {isLoading || isFetching}
                        >
                        { isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (<div>Enter Raffle</div>)}
                    </button>
                    <div>Entrance Fee: { ethers.utils.formatEther(entranceFee) } ETH</div>
                    <div>Number of Players: { numPlayers }</div>
                    <div>Recent Winner: { recentWinner }</div>
                </div>
            ) : (
                <div>No Raffle Address Deteched</div>
            )}   
        </div>     
    )
}