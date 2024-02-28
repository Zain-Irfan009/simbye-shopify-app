import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import { useState, useCallback, useEffect } from 'react';
import { AppContext } from "./components/providers";

import axios from "axios";
import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import useApi from '../frontend/components/customhooks/useApi';

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  const { t } = useTranslation();
  const [shopDetails, setShopDetails] = useState('');

  // const appBridge = useAppBridge()

  const [shop, setShop] = useState('');
  // const { callApi, loading, error } = useApi(appBridge, url);
  const url = window.location.origin;
  useEffect(() => {
    let location1 = location.search.split("&shop=")[1];
    location1 = location1.split("&timestamp=")[0];
    setShop(location1);
    setShopDetails(window.location.search);
  }, [])



  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <NavigationMenu
              navigationLinks={[
                  {
                      label: "Orders",
                      destination: "/",
                  },
                  {
                      label: "Mail SMTP",
                      destination: "/MailSMTP",
                  },
                  {
                  label: "Settings",
                  destination: "/Settings",
                },


              ]}
            />

            <AppContext.Provider
              value={{
                url, shop
              }}
            >
              <Routes pages={pages} />
            </AppContext.Provider>
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
