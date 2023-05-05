import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "@web3uikit/core";
// import { IconsGallery } from "@web3uikit/icons"
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        {/* <IconsGallery/> */}
        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>
  )
}

export default MyApp;
