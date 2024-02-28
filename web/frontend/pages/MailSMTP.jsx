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
    SkeletonBodyText,
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
    ChoiceList,
    Select
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

export default function MailSMTP() {
    const  apiUrl  = 'https://phpstack-1216846-4323606.cloudwaysapps.com'
    const appBridge = useAppBridge();

    const navigate = useNavigate();
    const location = useLocation();

    const [btnLoading, setBtnLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [discountError, setDiscountError] = useState()
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('')
    const [discardModal, setDiscardModal] = useState(false)
    const [storeDescriptioncontent, setStoreDescriptionContent] = useState('');
    const [sellerDescriptioncontent, setSellerDescriptionContent] = useState('');
    const [sellerPolicycontent, setSellerPolicyContent] = useState('');
    const [skeleton, setSkeleton] = useState(false)





    // =================Products Modal Code Start Here================
    const [productsLoading, setProductsLoading] = useState(false)
    const [queryValue, setQueryValue] = useState('');
    const [toggleLoadProducts, setToggleLoadProducts] = useState(true)

    const [allProducts, setAllProducts] = useState([])
    const [hasNextPage, setHasNextPage] = useState(false)
    const [nextPageCursor, setNextPageCursor] = useState('')
    const [selectedVariantProducts, setSelectedVariantProducts] = useState([])
    const [checkedVariants, setCheckedVariants] = useState([])
    const [previousCheckedVariants, setPreviousCheckedVariants] = useState([])
    const [smtpType, setSmtpType] = useState('tls');

    const handleProductTabChange = useCallback(
        (selectedTabIndex) => setProductTab(selectedTabIndex),
        [],
    );




    const handleDiscardModal = () => {
        setDiscardModal(!discardModal)
    }

    const discardAddSeller = () => {
        navigate('/sellerslisting')
    }
    const handleProductsSaveModal = () => {
        setProductsModal(false)
        setPreviousCheckedVariants(checkedVariants)
    }

    function handleStoreDescription(event, editor) {
        const data = editor.getData();
        console.log(data)
        setStoreDescriptionContent(data);
    }

    function handleSellerDescription(event, editor) {
        const data = editor.getData();
        console.log(data)
        setSellerDescriptionContent(data);
    }
    function handleSellerPolicy(event, editor) {
        const data = editor.getData();
        console.log(data)
        setSellerPolicyContent(data);
    }






    const handleProductsPagination = () => {
        if (hasNextPage) {
            setProductsLoading(true);
            setToggleLoadProducts(true)
        }
    };





    const handleQueryChange = (query) => {
        setQueryValue(query);

        setProductsLoading(true)
        setNextPageCursor('')
        setAllProducts([])
        setTimeout(() => {
            setToggleLoadProducts(true)
        }, 500);


    };

    const handleQueryClear = () => {
        handleQueryChange('');
    };

    // =================Products Modal Code Ends Here================


    // =================Collections Modal Code Start Here================
    const [collectionsLoading, setCollectionsLoading] = useState(false)
    const [collectionQueryValue, setCollectionQueryValue] = useState('');
    const [toggleLoadCollections, setToggleLoadCollections] = useState(true)
    const [collectionTab, setCollectionTab] = useState(0);
    const [collectionModal, setCollectionModal] = useState(false)
    const [expandedCollection, setExpandedCollection] = useState([])
    const [globalCollections, setGlobalCollections] = useState([])
    const [collectionsList, setCollectionsList] = useState([])
    const [allCollections, setAllCollections] = useState([])
    const [hasNextPageCollection, setHasNextPageCollection] = useState(false)
    const [nextPageCursorCollection, setNextPageCursorCollection] = useState('')
    const [selectedVariantCollections, setSelectedVariantCollections] = useState([])
    const [checkedVariantsCollections, setCheckedVariantsCollections] = useState([])
    const [previousCheckedVariantsCollections, setPreviousCheckedVariantsCollections] = useState([])



    const [smtpHost, setSmtpHost] = useState('')
    const [smtpUsername, setSmtpUsername] = useState('')
    const [smtpPassword, setSmtpPassword] = useState('')
    const [smtpEmail, setSmtpEmail] = useState('')
    const [smtpFromName, setSmtpFromName] = useState('')
    const [smtpReplyTo, setSmtpReplyTo] = useState('')
    const [smtpPort, setSmtpPort] = useState('')


    const handleCollectionTabChange = useCallback(
        (selectedTabIndex) => setCollectionTab(selectedTabIndex),
        [],
    );






    const handleCollectionsPagination = () => {
        if (hasNextPageCollection) {
            setCollectionsLoading(true);
            setToggleLoadCollections(true)
        }
    };







    const handleQueryChangeCollection = (query) => {
        setCollectionQueryValue(query);

        setCollectionsLoading(true)
        setNextPageCursorCollection('')
        setCollectionsList([])
        setAllCollections([])
        setTimeout(() => {
            setToggleLoadCollections(true)
        }, 500);


    };

    const handleQueryClearCollection = () => {
        handleQueryChangeCollection('');
    };



    // =================Collections Modal Code Ends Here================



    // ------------------------Toasts Code start here------------------
    const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
    const toggleSuccessMsgActive = useCallback(() => setSucessToast((sucessToast) => !sucessToast), []);

    const toastErrorMsg = errorToast ? (
        <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
    ) : null;

    const toastSuccessMsg = sucessToast ? (
        <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
    ) : null;




    const handleDiscount = (e) => {
        setDiscount({ ...discount, [e.target.name]: e.target.value })
    }


    const handleSmtpHost = (e) => {
        setSmtpHost(e.target.value)
    }
    const handleSmtpUsername = (e) => {
        setSmtpUsername(e.target.value)
    }
    const handleSmtpPassword = (e) => {
        setSmtpPassword(e.target.value)
    }
    const handleSmtpEmail = (e) => {
        setSmtpEmail(e.target.value)
    }
    const handleSmtpFromName = (e) => {
        setSmtpFromName(e.target.value)
    }
    const handleSmtpReplyTo = (e) => {
        setSmtpReplyTo(e.target.value)
    }

    const handleSmtpPort = (e) => {
        setSmtpPort(e.target.value)
    }



    const getMailSmtpData = async () => {

        setSkeleton(true)
        const sessionToken = await getSessionToken(appBridge);
        try {

            const response = await axios.get(`${apiUrl}/api/mail-smtp-setting`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setSmtpHost(response?.data?.data?.smtp_host)
            setSmtpUsername(response?.data?.data?.smtp_username)
            setSmtpPassword(response?.data?.data?.smtp_password)
            setSmtpEmail(response?.data?.data?.email_from)
            setSmtpFromName(response?.data?.data?.from_name)
            setSmtpReplyTo(response?.data?.data?.reply_to)
            setSmtpType(response?.data?.data?.smtp_type)
            setSmtpPort(response?.data?.data?.smtp_port)

            setSkeleton(false)

        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setSkeleton(false)
        }

    };

    const mailSmtpDataSave = async () => {

        setSkeleton(true)
        setBtnLoading(true)
        console.log('smtpType',smtpType)
        const sessionToken = await getSessionToken(appBridge);
        try {

            let data = {
                smtp_host: smtpHost,
                smtp_username: smtpUsername,
                smtp_password: smtpPassword,
                email_from: smtpEmail,
                from_name: smtpFromName,
                reply_to:smtpReplyTo,
                smtp_type:smtpType,
                smtp_port:smtpPort,
            }

            const response = await axios.post(`${apiUrl}/api/mail-smtp-setting-save`,data,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            setSkeleton(false)
            setBtnLoading(false)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setSkeleton(false)
        }

    };


    useEffect(() => {
        getMailSmtpData();
    }, []);


    const smtpTypeOptions=[

        {label: "TLS", value: "tls"},
        {label: "SSL", value: "ssl"},
        {label: "STARTTLS", value: "start_tls"},
    ];

    const handleSmtpType = useCallback((value) => setSmtpType(value), []);
    return (
        <Frame>
        <div className='Discount-Detail-Page'>



            <Modal
                open={discardModal}
                onClose={handleDiscardModal}
                title="Leave page with unsaved changes?"
                primaryAction={{
                    content: 'Leave page',
                    destructive: true,
                    onAction: discardAddSeller,
                }}
                secondaryActions={[
                    {
                        content: 'Stay',
                        onAction: handleDiscardModal,
                    },
                ]}
            >

                    <TextContainer>
                        <p>
                            Leaving this page will delete all unsaved changes.
                        </p>
                    </TextContainer>

            </Modal>

            {loading ?
                <span>
                    <Loading />
                    <SkeltonPageForProductDetail />
                </span>
                :
                <Page
                    breadcrumbs={[{ content: 'Discounts', onAction: handleDiscardModal }]}
                    title="Mail SMTP Setting"
                >
                    {discountError ?
                        <Banner
                            title="There is 1 error with this discount:"
                            status="critical"
                        >
                            <List>
                                <List.Item>
                                    Specific {discountError} must be added
                                </List.Item>
                            </List>
                        </Banner> : ''
                    }

                    <Form >
                        <FormLayout>
                            <Card sectioned title='Mail SMTP Setting'>

                                {skeleton ? <SkeletonBodyText/> :
                                    <>


                                        <div className="label_editor">
                                            <InputField

                                                label='SMTP Host*'
                                                type='text'
                                                marginTop
                                                required
                                                name='code'
                                                value={smtpHost}
                                                onChange={handleSmtpHost}

                                            />
                                        </div>
                                        <div className="label_editor">
                                        <InputField

                                            label='SMTP Username*'
                                            type='text'
                                            marginTop
                                            required
                                            name='code'
                                            value={smtpUsername}
                                            onChange={handleSmtpUsername}

                                        />
                                        </div>
                                        <div className="label_editor">
                                        <InputField

                                            label='Password*'
                                            type='password'
                                            marginTop
                                            required
                                            name='code'
                                            value={smtpPassword}
                                            onChange={handleSmtpPassword}

                                        />
                                        </div>
                                        <div className="label_editor">
                                        <InputField

                                            label='Email From*'
                                            type='email'
                                            marginTop
                                            required
                                            name='code'
                                            value={smtpEmail}
                                            onChange={handleSmtpEmail}

                                        />
                                        </div>
                                        <div className="label_editor">
                                        <InputField

                                            label='From Name*'
                                            type='text'
                                            marginTop
                                            required
                                            name='code'
                                            value={smtpFromName}
                                            onChange={handleSmtpFromName}

                                        />
                                        </div>
                                        <div className="label_editor">
                                        <InputField

                                            label='Reply TO*'
                                            type='text'
                                            marginTop
                                            required
                                            name='code'
                                            value={smtpReplyTo}
                                            onChange={handleSmtpReplyTo}

                                        />
                                        </div>
                                        <div className="label_editor">
                                            <Select
                                                label="SMTP Type"
                                                options={smtpTypeOptions}
                                                onChange={handleSmtpType}
                                                value={smtpType}
                                            />
                                        </div>
                                        <div className="label_editor">
                                        <InputField

                                            label='SMTP Port*'
                                            type='text'
                                            marginTop
                                            required
                                            name='code'
                                            value={smtpPort}
                                            onChange={handleSmtpPort}

                                        />
                                        </div>
                                    </>
                                }
                            </Card>


                        </FormLayout>
                    </Form>


                    <div className='Polaris-Product-Actions'>
                        <PageActions
                            primaryAction={{
                                content: 'Save',
                                onAction: mailSmtpDataSave,
                                loading: btnLoading
                            }}

                        />
                    </div>
                </Page >
            }
            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
        </Frame>
    );


}
