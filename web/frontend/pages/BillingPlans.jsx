import {
    Card,
    Page,
    Button,
    Text,
    BlockStack,
    IndexTable,
    useIndexResourceState,
    Badge,
    useBreakpoints, Icon, ButtonGroup, Tooltip, InlineStack, Divider
} from "@shopify/polaris";
import { useTranslation, Trans } from "react-i18next";
import { React, useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { FormsMajor, ViewMajor, EmailMajor, ChatMajor, AutomationFilledMajor, CustomersMajor,HeartMajor } from '@shopify/polaris-icons';
import ToggleSwitch from "../components/ToggleButton";
import PersonFilledIcon from "../assets/PersonFilledIcon.svg";
import useApi from '../components/customhooks/useApi';
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { AppContext } from "../components/providers";
import { SkeltonPage } from '../components/SkeltonPage';
import { Loading } from '@shopify/app-bridge-react';
import HeartIcon from "../assets/HeartIcon.svg";
export default function BillingPlan() {

    const navigate = useNavigate();

    const { shop, url } = useContext(AppContext);
    console.log("from information ", shop);
    const appBridge = useAppBridge()
    // const { show } = useToast();
    const { callApi, loading, error } = useApi(appBridge, url);

    const handlePlanSubscription = async (id) => {
        const response = await callApi(`subscripe-plan?shop=${shop}&plan_id=${id}`, 'POST');
        console.log("response is === ", response);
        if (response.return_url) {
            window.open(response.return_url, '_blank');
        }
    }
    const billingData = [
        {
            id: 1,
            name: "Free",
            price: 0,
            pageBars: 1,
            contacts: 1000,
            impressions: "Unlimited",
            emailCompaigns: "Unlimited",
            automationsFlows: "Unlimited",
        },
        {
            id: 2,
            name: "Lite",
            price: 5,
            pageBars: 5,
            contacts: 10000,
            impressions: "Unlimited",
            emailCompaigns: "Unlimited",
            automationsFlows: "Unlimited",
        },
        {
            id: 3,
            name: "Plus",
            price: 9,
            pageBars: 10,
            contacts: 50000,
            impressions: "Unlimited",
            emailCompaigns: "Unlimited",
            automationsFlows: "Unlimited",
        },
        {
            id: 4,
            name: "Pro",
            price: 19,
            pageBars: 20,
            contacts: 100000,
            impressions: "Unlimited",
            emailCompaigns: "Unlimited",
            automationsFlows: "Unlimited",
        },
        {
            id: 5,
            name: "Max",
            price: 29,
            pageBars: 30,
            contacts: 200000,
            impressions: "Unlimited",
            emailCompaigns: "Unlimited",
            automationsFlows: "Unlimited",
        },
        {
            id: 6,
            name: "Enterprise",
            price: 99,
            pageBars: "Unlimited",
            contacts: "Unlimited",
            impressions: "Unlimited",
            emailCompaigns: "Unlimited",
            automationsFlows: "Unlimited",
        }
    ]

    return (
        <Page title="Billing Plans">
            <div className="grid grid-cols-3 gap-5 mb-20">
                {billingData?.map((data, index) => (
                    <div key={index} >
                        <Card sectioned title={data?.name} padding={0}>
                            <div className={index === 2 ? "border-2 border-gray-700 rounded-[16px]" : ""}>
                                {
                                    index == 2 && (
                                        <div className="absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-xl bg-stone-950">
                                            <div className="absolute left-1/4 top-0 h-5 w-10 z-20  -translate-x-1/2 rounded-full text-white">
                                                <p>	&#x1F90D;</p>
                                            </div>
                                            <div className="absolute left-1/2 top-0 h-1 w-7 -translate-x-1/2 rounded-full text-white"> popular</div>
                                            {/* <div className="absolute right-6 top-0 h-2.5 w-2.5 rounded-full border-2 border-stone-800 bg-stone-900"></div> */}
                                        </div>
                                    )
                                }

                                <div className="my-10 mx-5">
                                    <BlockStack gap="600" align='center' inlineAlign='center'>
                                        <Text variant="heading2xl" as="h2" fontWeight="semibold">
                                            {data?.name}
                                        </Text>
                                        <InlineStack gap="200" blockAlign='center'>
                                            <Text variant="heading3xl" as="h2" fontWeight="bold">
                                                ${data?.price}
                                            </Text>
                                            <Text as="p" variant="bodyMd">
                                                / month
                                            </Text>
                                        </InlineStack>
                                        <Button size="large" fullWidth variant="primary" disabled={index == 1} onClick={() => handlePlanSubscription(data?.id)}>{index == 1 ? "Your Current Plan" : "Start Free Trial"}</Button>
                                        <Divider />
                                    </BlockStack>
                                    <BlockStack gap="100" align='center'>
                                        <div className="w-fit">
                                            <InlineStack gap="200" blockAlign='center' wrap={false}>
                                                <Icon source={FormsMajor} size="medium" />
                                                <Text as="p" variant="bodyMd">
                                                    <b>{data?.pageBars}</b> Page Bars
                                                </Text>
                                            </InlineStack>
                                        </div>
                                        <div className="w-fit">
                                            <InlineStack gap="200" blockAlign='center' wrap={false}>
                                                <Icon source={CustomersMajor} size="medium" />
                                                <Text as="p" variant="bodyMd">
                                                    <b>{data?.contacts}</b> Contacts
                                                </Text>
                                            </InlineStack>
                                        </div>
                                        <div className="w-fit">
                                            <InlineStack gap="200" blockAlign='center' wrap={false}>
                                                <Icon source={ViewMajor} size="medium" />
                                                <Text as="p" variant="bodyMd">
                                                    <b>{data?.impressions}</b> Impressions
                                                </Text>
                                            </InlineStack>
                                        </div>
                                        <div className="w-fit">
                                            <InlineStack gap="200" blockAlign='center' wrap={false}>
                                                <Icon source={EmailMajor} size="medium" />
                                                <Text as="p" variant="bodyMd">
                                                    <b>{data?.emailCompaigns}</b> Email Campaigns
                                                </Text>
                                            </InlineStack>
                                        </div>
                                        <div className="w-fit">
                                            <InlineStack gap="200" blockAlign='center' wrap={false}>
                                                <Icon source={AutomationFilledMajor} size="medium" />
                                                <Text as="p" variant="bodyMd">
                                                    <b>{data?.automationsFlows}</b> Automation Flows
                                                </Text>
                                            </InlineStack>
                                        </div>
                                        <div className="w-fit">
                                            <InlineStack gap="200" blockAlign='center' wrap={false}>
                                                <Icon source={ChatMajor} size="medium" />
                                                <Text as="p" variant="bodyMd">
                                                    24/7 customer support
                                                </Text>
                                            </InlineStack>
                                        </div>
                                    </BlockStack>
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </Page>
    );

}    
