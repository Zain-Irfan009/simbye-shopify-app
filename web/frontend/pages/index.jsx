import {
    Card,
    Page,
    Layout,
    TextContainer,
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Image,
    Pagination,
    Form,
    Link,
    EmptySearchResult,
    Toast,
    FormLayout,
    PageActions,
    TextField,
    Frame,
    Tooltip,
    Button,
    Tabs,
    Modal,
    Loading,
    Icon,
    Badge,
    Text,
    ChoiceList
} from "@shopify/polaris";
import {
    SearchMinor,
    ExternalMinor,
    DeleteMinor,
    HorizontalDotsMinor,
    ViewMajor
} from "@shopify/polaris-icons";
import React, { useState, useCallback, useEffect, useContext } from "react";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import { AppContext } from "../components/providers";
import { trophyImage } from "../assets";
import {  InputField } from '../components/Utils/InputField'
import {  style } from '../components/ToggleSwitch.css'

import axios from "axios";
import { useAppBridge, } from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge-utils";
import ReactSelect from 'react-select';

import { ProductsCard } from "../components";
import {useLocation, useNavigate} from "react-router-dom";

export default function HomePage() {
    const  apiUrl  = 'https://phpstack-1216846-4323606.cloudwaysapps.com'
    const appBridge = useAppBridge();

    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [customersLoading, setCustomersLoading] = useState(false);
    const [selected, setSelected] = useState(0);
    const [queryValue, setQueryValue] = useState("");
    const [toggleLoadData, setToggleLoadData] = useState(true);
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [storeUrl, setStoreUrl] = useState("");
    const [active, setActive] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [sellerList, setSellerList] = useState([]);
    const [btnLoading, setBtnLoading] = useState(false)
    const [skeleton, setSkeleton] = useState(false)

    const [status, setStatus] = useState(false)

    const [emailOrderStatus, setEmailOrderStatus] = useState(false)

    const [mailSubject, setMailSubject] = useState("");
    const [mailContent, setMailContent] = useState("");
    const [orderMailContent, setOrderMailContent] = useState("");

    const [mailContentStatus, setMailContentStatus] = useState(false)

    const [mailHeaderStatus, setMailHeaderStatus] = useState(false)
    const [mailFooterStatus, setMailFooterStatus] = useState(false)
    const [headerBackgroundColor, setHeaderBackgroundColor] = useState('#000000');
    const [footerBackgroundColor, setFooterBackgroundColor] = useState('#000000');

    const [accessCode, setAccessCode] = useState('')

    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelectedTab(selectedTabIndex),
        []
    );


    const handleHeaderBackgoundColor = useCallback((e)=>setHeaderBackgroundColor(e.target.value),[])
    const handleFooterBackgoundColor = useCallback((e)=>setFooterBackgroundColor(e.target.value),[])


    const tabs = [
        {
            id: "1",
            content: "Product Email",
        },
        {
            id: "2",
            content: "Order Email",
        },
        // {
        //     id: "3",
        //     content: "Inducements",
        // },
    ];



    // ------------------------Toasts Code start here------------------
    const toggleErrorMsgActive = useCallback(
        () => setErrorToast((errorToast) => !errorToast),
        []
    );
    const toggleSuccessMsgActive = useCallback(
        () => setSucessToast((sucessToast) => !sucessToast),
        []
    );

    const toastErrorMsg = errorToast ? (
        <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
    ) : null;

    const toastSuccessMsg = sucessToast ? (
        <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
    ) : null;



    const handleMailHeaderStatus = (e) => {
        setMailHeaderStatus(!mailHeaderStatus)
    }

    const handleMailFooterStatus = (e) => {
        setMailFooterStatus(!mailFooterStatus)
    }



    useEffect(() => {
        getData()
    }, [toggleLoadData]);




    const emptyStateMarkup = (
        <EmptySearchResult title={"No Product Found"} withIllustration />
    );

    const handleSellerPageProfile = (e) => {
        setStatus(!status)
    }

    const handleEmailOrderStatus = (e) => {
        setEmailOrderStatus(!emailOrderStatus)
    }


    const handleTitle = (e) => {
        setAccessCode(e.target.value)
    }


    const getData = async () => {
        const sessionToken = await getSessionToken(appBridge);


        try {

            const response = await axios.get(`${apiUrl}/api/setting`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            console.log(response)
            setStatus(response?.data?.data?.status)
            setAccessCode(response?.data?.data?.access_code)
            setLoading(false)

        } catch (error) {
            console.log(error,'errror');
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setSkeleton(false)
        }

    };

    const mailConfigurationDataSave = async () => {

        setLoading(true)
        const sessionToken = await getSessionToken(appBridge);
        try {

            let data = {
                access_code: accessCode,
                status: status,

            }

            const response = await axios.post(`${apiUrl}/api/setting-save`,data,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            setLoading(false)


        } catch (error) {
            console.log(error,'error')
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setSkeleton(false)
        }

    };

    return (
        <Frame>
        <div className="Customization-Page">

            {loading ? (
                <span>
                <Loading />

            </span>
            ) : (
                <Page
                    fullWidth
                    title="Settings"
                >
                    {loading ? (
                        <span>

                    </span>
                    ) : (
                        <>
                            <div className="Customization-Tab1 margin-top">
                                <Form>
                                    <Layout>
                                        <Layout.Section>
                                            <FormLayout>
                                                <Card  title='Product APPROVAL'>
                                                    <p>{`Enable/Disable App`}</p>
                                                    <div className="edit_seller_page_toggle">
                                                    <span>
                                                        <input
                                                            id='toggle'
                                                            type="checkbox"
                                                            className="tgl tgl-light"
                                                            checked={status}
                                                            onChange={handleSellerPageProfile}
                                                        />
                                                        <label htmlFor='toggle' className='tgl-btn'></label>

                                                    </span>
                                                    </div>
                                                    <div className="access_code">
                                                        <InputField
                                                            label='Access Code'
                                                            type='text'
                                                            marginTop
                                                            required
                                                            name='code'
                                                            value={accessCode}
                                                            onChange={handleTitle}
                                                        />
                                                    </div>

                                                </Card>
                                            </FormLayout>
                                            <div className='Polaris-Product-Actions'>
                                                <PageActions
                                                    primaryAction={{
                                                        content: 'Save',
                                                        onAction: mailConfigurationDataSave,
                                                        loading: btnLoading
                                                    }}
                                                />
                                            </div>
                                        </Layout.Section>
                                    </Layout>
                                </Form>
                            </div>
                        </>
                    )}
                </Page>
            )}
            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
        </Frame>
    );


}
