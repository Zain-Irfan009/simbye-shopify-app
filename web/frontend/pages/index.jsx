import {
  Card,
  Page,
  Button,
  Text,
  ProgressBar,
  Banner,
  IndexTable,
  useIndexResourceState,
  Badge,
  useBreakpoints, Icon, ButtonGroup, Tooltip, InlineStack, BlockStack
} from "@shopify/polaris";
import { useTranslation, Trans } from "react-i18next";
import { React, useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { SearchMinor, EditMinor, DeleteMinor, AnalyticsMinor, ViewMinor } from '@shopify/polaris-icons';
import PersonFilledIcon from "../assets/PersonFilledIcon.svg";
import ToggleSwitch from "../components/ToggleButton";
import useApi from '../components/customhooks/useApi';
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { AppContext } from "../components/providers";
import { SkeltonPage } from '../components/SkeltonPage';
import { Loading } from '@shopify/app-bridge-react';
export default function HomePage() {
  const navigate = useNavigate();

  const { shop, url, isSubscribed } = useContext(AppContext);
  console.log("from information ", shop);
  const appBridge = useAppBridge()
  // const { show } = useToast();
  const { callApi, loading, error } = useApi(appBridge, url);
  const handleNavigation = () => {
    navigate(`/AddBar`);
  };

  const handleBarStatusChange = ((id) => {
    const isActive = !pageBars?.find((bar) => bar.id === id).is_active;
    const is_active = isActive ? 1 : 0;
    const response = callApi(`update-bar-status?id=${id}&is_active=${is_active}`, 'GET');
    console.log("response is === ", response);

    setTimeout(() => {
      BarDetail();
    }, 1000);
  })

  const [pageBars, setPageBars] = useState([]);
  const handleBarDetail = (id) => {
    navigate(`/BarDetail/${id}`);
  }

  const BarDetail = async () => {
    const response = await callApi("page-bar", 'GET');
    console.log("response is === ", response);
    setPageBars(response?.data);
  }

  const handleBarDelete = async (id) => {
    const response = await callApi(`delete-data?id=${id}`, 'DELETE');
    console.log("response is === ", response);
    BarDetail();
  }

  useEffect(() => {
    BarDetail();
  }, [])
  return (
    <>
      {
        !isSubscribed ? (
          loading ? (
            <div className="flex justify-center">
              <div className="max-w-7xl w-[90%]  justify-center">
                <SkeltonPage />
                <Loading />
              </div>
            </div>
          ) : (
            // <div className="flex justify-center">
            //   <div className="max-w-7xl w-[90%]  justify-center">
            <>
              <Page >
                <Banner
                  title="Page Bars is inactive"
                    action={{ content: 'Enable Page Bars' }}
                    secondaryAction={{content: 'Learn more', url: ''}}
                  tone="warning"
                  >
                    <Text variant="bodyMd">
                      <b>Enable and save</b> Page Bars in your theme editor.
                      </Text>
                </Banner>
              </Page>
              <Page title="PageBars" primaryAction={<Button variant="primary" onClick={handleNavigation}> {!pageBars.limit ? 'Add New' : 'Limit Exceed'}</Button>}
                secondaryActions={<Button>Automations</Button>}
              >
  
                <div className="my-5 gap-4 flex flex-col">
                  <ProgressBar progress={70} tone="primary" />
                  <InlineStack gap="500" align="end" blockAlign="center">
                    <Text variant="bodyLg" as="p" fontWeight="semibold" >76% (760 of 1,000 contacts used)</Text>
                  </InlineStack>
                </div>
                <Card title="Sales" background='bg-fill-secondary-hover'  >
                  <div className="min-h-[calc(100vh-150px)]">
                    {pageBars?.map((bar) => (
                      <div className="mb-3">
                        <Card key={bar.id}>
                          <div className="flex justify-between content-center">
                            <Text variant="headingMd" as="h6">
                              {bar.bar_name}
                            </Text>
                            <div className="flex gap-5 items-center">
                              <span className="flex gap-2 items-center mr-14">
                                <img src={PersonFilledIcon} className="w-6" />
                                <Text variant="bodyMd" as="p">
                                  Leads:
                                </Text>
                                <Text variant="bodyLg" as="p" fontWeight="bold">
                                  {bar.leads}
                                </Text>
                              </span>
                              <ToggleSwitch key={bar.id} checked={bar.is_active} onChange={() => { handleBarStatusChange(bar.id) }} round />
                              <InlineStack gap="100">
                                <Button icon={ViewMinor} size="large" onClick={() => handleBarDetail(bar.id)}></Button>
                                <Button icon={EditMinor} size="large" onClick={() => navigate(`/EditBar/${bar.id}`)}></Button>
                                <Button icon={DeleteMinor} size="large" onClick={() => handleBarDelete(bar.id)}></Button>
                              </InlineStack>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                </Card>
              </Page>
            </>
            // </div>
            // </div>
          )
        ) : (
            <Page>
              <Banner 
                title="You are not Subscribed to any page bar plan, subscribe now"
                action={{ content: 'Subscribe', url : '/BillingPlans' }}
                secondaryAction={{ content: 'Learn more', url: '' }}
                tone="warning"
              >
                <Text variant="bodyMd">
                  <b>Buy any subscription plan</b> to enjoy all features.
                </Text>
              </Banner>
          </Page>
        )
      }
    </>

  );
}
