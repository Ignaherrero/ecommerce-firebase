import { ChakraProvider } from "@chakra-ui/react";
import { LoginContextProvider } from "../context/login-context";

function MyApp({ Component, pageProps }) {
  return (
    <LoginContextProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </LoginContextProvider>
  );
}

export default MyApp;
