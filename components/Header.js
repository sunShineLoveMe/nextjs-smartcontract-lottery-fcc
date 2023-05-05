import { ConnectButton } from "@web3uikit/web3"

export default function Header() {
    return (
        <div>
            Decentralized Lottory
            {/* 在 React Moralis 中， 表示禁用 Moralis 的身份验证功能，以便快速连接用户的钱包，并实现 Web3 操作 */}
            <ConnectButton moralisAuth={false} />
        </div>
    )
}