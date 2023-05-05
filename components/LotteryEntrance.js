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

    const dispatch = useNotification()

    const { runContractFunction: enterRaffle } = useWeb3Contract({
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

    useEffect(() => {
        if(isWeb3Enabled) {
            async function updateUI() {
                const entranceFeeFromCall = (await getEntranceFee()).toString()
                setEntranceFee(entranceFeeFromCall)
            }
            updateUI()
        }   
    }, [isWeb3Enabled])

    const handleSuccess = async function(tx) {
        await tx.wait(1)
        handleNewNotification(tx)
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
        <div>
            Hi from lottery entrance! 
            {raffleAddress ? (
                <div>
                    <button 
                        onClick={async function() { 
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error)
                            })
                        }}>
                        Enter Raffle
                    </button>
                    Entrance Fee: {ethers.utils.formatEther(entranceFee, "ether")} ETH
                </div>
            ) : (
                <div>No Raffle Address Deteched</div>
            )}   
        </div>     
    )
}