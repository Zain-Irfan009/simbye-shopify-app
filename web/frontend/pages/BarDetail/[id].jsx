import {
    Page,
    Button,
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Text,
    Badge,
} from "@shopify/polaris";
import { useTranslation, Trans } from "react-i18next";
import React, { useState, useEffect, useContext, useCallback } from "react";
import useApi from '../../components/customhooks/useApi';
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { AppContext } from "../../components/providers";
import { useParams, useNavigate } from "react-router-dom";
// import PersonFilledIcon from "../assets/PersonFilledIcon.svg";
// import ToggleSwitch from "../../components/ToggleButton";

export default function BarDetail() {

    const { shop, url } = useContext(AppContext);
    console.log("from information ", shop);
    const appBridge = useAppBridge()
    const params = useParams();
    const navigate = useNavigate();
    // const { show } = useToast();
    const { callApi, loading, error } = useApi(appBridge, url);
    const [barData, setBarData] = useState([]);

    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };

    useEffect(() => {

    }, [])

    const BarDetail = async () => {
        const response = await callApi("page-bar-detail?id=" + params.id, "GET");
        setBarData(response?.data);
    }

    useEffect(() => {
        BarDetail();
    }, [])

    const handleExprot = async (id) => {
        const response = await callApi(`export?id=${id}`, 'GET');
        console.log("response is === ", response.link);
        const downloadLink = document.createElement('a');
        downloadLink.href = response?.link; 
        downloadLink.download = response?.name; 
        downloadLink.target = '_blank';
        downloadLink.click();

    }

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(barData);

    const rowMarkup = barData?.map(
        (
            { customer_id, first_name, last_name, total_price, order_count, currency },
            index,
        ) => (
            <IndexTable.Row
                id={customer_id}
                key={customer_id}
                selected={selectedResources.includes(customer_id)}
                position={index}
            >
                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="bold" as="span">
                        {first_name} {last_name}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>{order_count}</IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span" numeric>
                        {total_price} {currency}
                    </Text>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );


    return (
        // <div className="flex justify-center">
        //     <div className="max-w-7xl w-[90%]  justify-center">
                <Page title="Bars 1" primaryAction={<Button variant="primary" onClick={() => handleExprot(params.id)} >Export</Button>}

                    backAction={{ content: 'Add Bars', url: '', onAction: () => navigate('/') }}
                // backAction={{ content: 'Add Bars', url: '' }}
                >
                    <LegacyCard>
                        <IndexTable
                            resourceName={resourceName}
                            itemCount={barData?.length}
                            selectedItemsCount={
                                allResourcesSelected ? 'All' : selectedResources.length
                            }
                            onSelectionChange={handleSelectionChange}
                            headings={[
                                { title: 'Customer name' },
                                { title: 'Orders' },
                                { title: 'Amount spent' },
                            ]}
                        >
                            {rowMarkup}
                        </IndexTable>
                    </LegacyCard>
                </Page>
        //     </div>
        // </div>
    );
}
