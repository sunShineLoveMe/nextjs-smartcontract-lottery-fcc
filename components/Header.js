import { ConnectButton } from "@web3uikit/web3"

export default function Header() {
    return (
        <div className="p-5 border-b-2 flex flex-row">
            <h1 className="py-4 px-4 font-blog text-3xl">Decentralized Lottory</h1>
            {/* 在 React Moralis 中， 表示禁用 Moralis 的身份验证功能，以便快速连接用户的钱包，并实现 Web3 操作 */}
            <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}