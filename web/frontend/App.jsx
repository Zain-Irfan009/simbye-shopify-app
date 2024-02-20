import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import { useState, useCallback, useEffect } from 'react';
import { AppContext } from "./components/providers";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
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
  const [isSubscribed, setIsSubscribed] = useState(false);
  // const appBridge = useAppBridge()

  const [shop, setShop] = useState('');
  // const { callApi, loading, error } = useApi(appBridge, url);
  const url = window.location.origin + "/api";
  useEffect(() => {
    let location1 = location.search.split("&shop=")[1];
    location1 = location1.split("&timestamp=")[0];
    setShop(location1);
    setShopDetails(window.location.search);
  }, [])

  console.log("pages == ", pages)
  const ShopPlan = async () => {
    const response = await axios.get(`${url}/shop-plan?shop=${shop}`);
    setIsSubscribed(response?.data?.is_subscribed);
  }
  useEffect(() => {
    if (shop) {
      ShopPlan();
  }
}, [shop])

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <NavigationMenu
              navigationLinks={[
                {
                  label: "Bars",
                  destination: "/",
                },
                {
                  label: "Add Bar",
                  destination: "/AddBar",
                },
                {
                  label: "Plans",
                  destination: "/BillingPlans",
                },
                {
                  label: "Help Center",
                  destination: "/Settings",
                }
              ]}
            />

            <AppContext.Provider
              value={{
                url, shop, isSubscribed
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
