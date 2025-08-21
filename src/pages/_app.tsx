import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import "./Styles/Globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../utils/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
