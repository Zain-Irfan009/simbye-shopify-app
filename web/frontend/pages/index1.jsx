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
    Link,
    EmptySearchResult,
    Toast,
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
import axios from "axios";
import { useAppBridge, } from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge-utils";
import ReactSelect from 'react-select';

import { ProductsCard } from "../components";
import {useNavigate} from "react-router-dom";

export default function HomePage() {
    const  apiUrl  = 'https://phpstack-1216846-4323606.cloudwaysapps.com'
    const appBridge = useAppBridge();
    // const { user } = useAuthState();
    const navigate = useNavigate();
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

    const [orders, setOrders] = useState([]);

    console.log('orders',orders)
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [pageCursor, setPageCursor] = useState("next");
    const [pageCursorValue, setPageCursorValue] = useState("");
    const [nextPageCursor, setNextPageCursor] = useState("");
    const [previousPageCursor, setPreviousPageCursor] = useState("");
    const [orderStatus, setOrderStatus] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);
    const [btnLoading1, setBtnLoading1] = useState(false);
    const [sellerEmail, setSellerEmail] = useState("");
    const [uniqueId, setUniqueId] = useState();
    const [moneySpent, setMoneySpent] = useState(undefined);
    const [taggedWith, setTaggedWith] = useState("");
    const [accountStatus, setAccountStatus] = useState(undefined);
    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(orders);


    //pagination
    const [pagination, setPagination] = useState(1);
    const [showPagination, setShowPagination] = useState(false);
    const [paginationUrl, setPaginationUrl] = useState([]);


    const toggleActive = (id) => {
        setActive((prev) => {
            let toggleId;
            if (prev[id]) {
                toggleId = { [id]: false };
            } else {
                toggleId = { [id]: true };
            }
            return { ...toggleId };
        });
    };


    const toggleActive1 = useCallback(() => setActive((active) => !active), []);
    const [toggleLoadData1, setToggleLoadData1] = useState(true);

    const handlePaginationTabs = (active1, page) => {
        if (!active1) {
            setPagination(page);
            setToggleLoadData1(!toggleLoadData1);
        }
    };

    const [itemStrings, setItemStrings] = useState([
        "All",
        "Unfulfilled",
        "Partially Fulfilled",
        "Fulfilled",

    ]);

    const onCreateNewView = async (value) => {
        await sleep(500);
        setItemStrings([...itemStrings, value]);
        setSelected(itemStrings.length);
        return true;
    };
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const onHandleSave = async () => {
        await sleep(1);
        return true;
    };


    const handleClearButtonClick = () => {
        setLoading(true)
        setSelectedStatus('')
        setShowClearButton(false);
        getData();
    };
    const handleOrderFilter =async (value) =>  {
        setSelected(value)
        setLoading(true)


        try {

            const response = await axios.get(`${apiUrl}/order-filter?status=${value}&value=${queryValue}&seller=${selectedStatus.value}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setOrders(response?.data?.orders)
            setLoading(false)
            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }


    const fetchProducts =async (filter_type,selectedValue) =>  {
        setShowClearButton(true);

        // setSelected(value)
        setLoading(true)


        try {

            const response = await axios.get(`${apiUrl}/order-filter-payment?value=${selectedValue.value}&order_value=${queryValue}&status=${selected}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setOrders(response?.data?.orders)
            setLoading(false)
            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {
            console.log(error)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }




    const primaryAction =
        selected === 0
            ? {
                type: "save-as",
                onAction: onCreateNewView,
                disabled: false,
                loading: false,
            }
            : {
                type: "save",
                onAction: onHandleSave,
                disabled: false,
                loading: false,
            };

    const sortOptions = [
        { label: "Order", value: "order asc", directionLabel: "Ascending" },
        { label: "Order", value: "order desc", directionLabel: "Descending" },
        { label: "Customer", value: "customer asc", directionLabel: "A-Z" },
        { label: "Customer", value: "customer desc", directionLabel: "Z-A" },
        { label: "Date", value: "date asc", directionLabel: "A-Z" },
        { label: "Date", value: "date desc", directionLabel: "Z-A" },
        { label: "Total", value: "total asc", directionLabel: "Ascending" },
        { label: "Total", value: "total desc", directionLabel: "Descending" },
    ];

    const [sortSelected, setSortSelected] = useState(["order asc"]);

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

    // ---------------------Tag/Filter Code Start Here----------------------
    const handleAccountStatusRemove = useCallback(
        () => setAccountStatus(undefined),
        []
    );
    const handleMoneySpentRemove = useCallback(
        () => setMoneySpent(undefined),
        []
    );
    const handleQueryValueRemove = () => {
        setPageCursorValue("");
        getData()
        setQueryValue("");
        setToggleLoadData(true);
    };
    let timeoutId = null;

    const handleFiltersQueryChange = async (value)  => {

        setPageCursorValue('')
        setCustomersLoading(true)
        // setLoading(true)
        setQueryValue(value)




        try {
            const response = await axios.get(`${apiUrl}/search-order?value=${value}&seller=${selectedStatus.value}&status=${selected}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            // setLoading(false)
            setOrders(response?.data?.data)
            setCustomersLoading(false)


        } catch (error) {
            setBtnLoading(false)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }

        setTimeout(() => {
            setToggleLoadData(true)
        }, 1000);
    }

    const handlePagination = (value) => {
        console.log("value", value, nextPageCursor)
        if (value == "next") {
            setPageCursorValue(nextPageCursor);
        } else {
            setPageCursorValue(previousPageCursor);
        }
        setPageCursor(value);
        setToggleLoadData(!toggleLoadData);
    };

    // ---------------------Index Table Code Start Here----------------------

    const [modalReassign, setModalReassign] = useState(false);

    const resourceName = {
        singular: "Order",
        plural: "Orders",
    };

    const handleViewAction = (id) => {
        navigate(`/view-order/${id}`);
    };

    const handleDisableAction = useCallback(
        () => console.log("Exported action"),
        []
    );

    const handleViewinStoreAction = useCallback(
        () => console.log("View in Store action"),
        []
    );

    const handleSendMessageAction = useCallback(
        () => console.log("View in Send message action"),
        []
    );

    const handleReassignAction = (id) => {
        setUniqueId(id);
        setModalReassign(true);
    };


    const handleSelectChange = (selectedOption) => {

        const selectedValue =  selectedOption; // Access the value property of the selected option
        setSelectedStatus(selectedValue);


        fetchProducts( filterType, selectedValue); // Pass the query, filter type, and selected value as arguments
    };
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [filterType, setFilterType] = useState('');
    const [showSelect, setShowSelect] = useState(true);
    const [showClearButton, setShowClearButton] = useState(false);

    const handleFilterClick = (type) => {
        setFilterType(type);
        setSelectedStatus('');
        setSelectedBrand('');
        setSelectedCategory('');
        setShowSelect(true);

    };

    const handleReassignCloseAction = () => {
        setUniqueId();
        setSellerEmail("");
        setModalReassign(false);
    };
    const handleDeleteAction = useCallback(
        () => console.log("View in delete action"),
        []
    );

    // ---------------------Tabs Code Start Here----------------------

    // const handleTabChange = (selectedTabIndex) => {
    //   if (selected != selectedTabIndex) {
    //     setSelected(selectedTabIndex);
    //     if (selectedTabIndex == 0) {
    //       setOrderStatus("");
    //     } else if (selectedTabIndex == 1) {
    //       setOrderStatus("unfulfilled");
    //     } else if (selectedTabIndex == 2) {
    //       setOrderStatus("unpaid");
    //     } else if (selectedTabIndex == 3) {
    //       setOrderStatus("open");
    //     } else if (selectedTabIndex == 4) {
    //       setOrderStatus("closed");
    //     }
    //     setPageCursorValue("");
    //     setToggleLoadData(true);
    //   }
    // };

    const handleTabChange = (selectedTabIndex) => {
        if (selected != selectedTabIndex) {
            setSelected(selectedTabIndex);
            if (selectedTabIndex == 0) {
                setOrderStatus("");
            } else if (selectedTabIndex == 1) {
                setOrderStatus("unfulfilled");
            } else if (selectedTabIndex == 2) {
                setOrderStatus("unpaid");
            } else if (selectedTabIndex == 3) {
                setOrderStatus("open");
            } else if (selectedTabIndex == 4) {
                setOrderStatus("closed");
            }
            setPageCursorValue("");
            setToggleLoadData(true);
        }
    };

    const appliedFilters = [];
    if (accountStatus && !isEmpty(accountStatus)) {
        const key = "accountStatus";
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, accountStatus),
            onRemove: handleAccountStatusRemove,
        });
    }
    if (moneySpent) {
        const key = "moneySpent";
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, moneySpent),
            onRemove: handleMoneySpentRemove,
        });
    }
    if (!isEmpty(taggedWith)) {
        const key = "taggedWith";
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, taggedWith),
            onRemove: handleTaggedWithRemove,
        });
    }
    const handleTaggedWithRemove = useCallback(() => setTaggedWith(""), []);
    // const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);

    const handleFiltersClearAll = useCallback(() => {
        handleAccountStatusRemove();
        handleMoneySpentRemove();
        handleTaggedWithRemove();
        handleQueryValueRemove();
    }, [
        handleAccountStatusRemove,
        handleMoneySpentRemove,
        handleQueryValueRemove,
        handleTaggedWithRemove,
    ]);


    const tabs = itemStrings.map((item, index) => ({
        content: item,
        index,
        onAction: () => {},
        id: `${item}-${index}`,
        isLocked: index === 0,

    }));
    const allResourcesSelect = orders?.every(({ id }) =>
        selectedResources.includes(id)
    );

    function handleRowClick(id) {
        const target = event.target;
        const isCheckbox = target.tagName === "INPUT" && target.type === "checkbox";

        if (!isCheckbox) {
            event.stopPropagation(); // Prevent row from being selected
        } else {
            // Toggle selection state of row
            const index = selectedResources.indexOf(id);
            if (index === -1) {
                handleSelectionChange([...selectedResources, id]);
            } else {
                handleSelectionChange(selectedResources.filter((item) => item !== id));
            }
        }
    }


    const bulkActions = [
        {
            content: selectedResources.length > 0 && "Disable",
            onAction: () => {
                const newSelection = selectedResources.filter(
                    (id) => !customers.find((customer) => customer.id === id)
                );
                handleSelectionChange(newSelection);
            },
        },
        {
            content: allResourcesSelect ? "Disable all" : "Enable all",
            onAction: () => {
                const newSelection = allResourcesSelect
                    ? []
                    : customers.filter((o) => o.id);
                handleSelectionChange(newSelection);
            },
        },
    ];

    const formatDate = (created_at) => {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const date = new Date(created_at);
        const monthName = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();

        const formattedDate = `${monthName} ${day}, ${year}`;
        return formattedDate;
    }

    const rowMarkup = orders?.map(
        (
            {
                id,
                order_number,
                created_at,
                financial_status,
                fulfillment_status,

            },
            index
        ) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
                onClick={() => handleRowClick(id)} // Add this line
            >
                <IndexTable.Cell className="Polaris-IndexTable-Product-Column">
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {id != null ? id : "---"}
                    </Text>
                </IndexTable.Cell>

                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {order_number != null ? order_number : "---"}
                    </Text>
                </IndexTable.Cell>


                <IndexTable.Cell>{created_at != null ? formatDate(created_at) : "---"}</IndexTable.Cell>

                {financial_status === 'paid' ? (
                    <IndexTable.Cell>
                        <Badge progress='complete'>{financial_status === 'paid' ? 'Paid' : ''}</Badge>
                    </IndexTable.Cell>
                ) :  financial_status === 'refunded' ? (
                    <IndexTable.Cell className="unfulfilled" >
                        <Badge progress='complete'>{financial_status === 'refunded' ? 'Refunded' : ''}</Badge>
                    </IndexTable.Cell>
                ) : financial_status === 'voided' ? (
                    <IndexTable.Cell className="voided" >
                        <Badge progress='complete'>{financial_status === 'voided' ? 'Voided' : ''}</Badge>
                    </IndexTable.Cell>
                ) :financial_status === 'partially_paid' ? (
                        <IndexTable.Cell className="partially_paid" >
                            <Badge progress='complete'>{financial_status === 'partially_paid' ? 'Partially paid' : ''}</Badge>
                        </IndexTable.Cell>
                    ) :
                    financial_status === 'partially_refunded' ? (
                            <IndexTable.Cell className="partially_refunded" >
                                <Badge progress='complete'>{financial_status === 'partially_refunded' ? 'Partially refunded' : ''}</Badge>
                            </IndexTable.Cell>
                        ):

                        (

                            <IndexTable.Cell className="payment_pending" >
                                <Badge progress='complete'>{financial_status === 'pending' ? 'Payment Pending' : ''}</Badge>

                            </IndexTable.Cell>
                        )}
                {fulfillment_status === 'fulfilled' ? (
                    <IndexTable.Cell className="fulfilled">
                        {/*<CustomBadge value={fulfillment_status=='' ? 'UNFULFILLED' : fulfillment_status} type="orders" variant={"fulfillment"} />*/}
                        <Badge progress='complete'>{fulfillment_status === 'fulfilled' ? 'Fulfilled' : ''}</Badge>


                    </IndexTable.Cell>
                ) : fulfillment_status === 'partial' ? (
                    <IndexTable.Cell className="partial">
                        <Badge progress='complete'>{fulfillment_status === 'partial' ? 'Partially fulfilled' : ''}</Badge>
                    </IndexTable.Cell>
                ) : (
                    <IndexTable.Cell className="unfulfilled">
                        <Badge progress='complete'>{fulfillment_status==null ? 'Unfulfilled' : fulfillment_status}</Badge>

                    </IndexTable.Cell>
                )}


            </IndexTable.Row>
        )
    );

    const emptyStateMarkup = (
        <EmptySearchResult title={"No Order Found"} withIllustration />
    );

    const handleClearStates = () => {

        setPageCursorValue("");
        setNextPageCursor("");
        setPreviousPageCursor("");
    };

    const activator = (
        <Button onClick={toggleActive} disclosure>
            <Icon source={HorizontalDotsMinor}></Icon>
        </Button>
    );


    // ---------------------Api Code starts Here----------------------

    const handleAccountStatusChange = useCallback(
        (value) => setAccountStatus(value),
        []
    );
    const handleMoneySpentChange = useCallback(
        (value) => setMoneySpent(value),
        []
    );
    const handleTaggedWithChange = useCallback(
        (value) => setTaggedWith(value),
        []
    );
    // const handleFiltersQueryChange = useCallback(
    //   (value) => setQueryValue(value),
    //   []
    // );



    useEffect(() => {
        if (toggleLoadData) {
            // getCustomers()
        }
        // setLoading(false);
        setCustomersLoading(false);
    }, [toggleLoadData]);

    const handleSellerEmail = (e) => {
        setSellerEmail(e.target.value);
    };

    const filters = [
        {
            key: "accountStatus",
            label: "Account status",
            filter: (
                <ChoiceList
                    title="Account status"
                    titleHidden
                    choices={[
                        { label: "Enabled", value: "enabled" },
                        { label: "Not invited", value: "not invited" },
                        { label: "Invited", value: "invited" },
                        { label: "Declined", value: "declined" },
                    ]}
                    selected={accountStatus || []}
                    onChange={handleAccountStatusChange}
                    allowMultiple
                />
            ),
            shortcut: true,
        },
        {
            key: "taggedWith",
            label: "Tagged with",
            filter: (
                <TextField
                    label="Tagged with"
                    value={taggedWith}
                    onChange={handleTaggedWithChange}
                    autoComplete="off"
                    labelHidden
                />
            ),
            shortcut: true,
        },
        //  {
        //    key: "moneySpent",
        //    label: "Money spent",
        //    filter: (
        //      <RangeSlider
        //        label="Money spent is between"
        //        labelHidden
        //        value={moneySpent || [0, 500]}
        //        prefix="$"
        //        output
        //        min={0}
        //        max={2000}
        //        step={1}
        //        onChange={handleMoneySpentChange}
        //      />
        //    ),
        //  },
    ];





    const handleSyncOrder = async () => {
        setBtnLoading(true);
        setLoading(true)
        try {
            const sessionToken = await getSessionToken(appBridge);
            const headers = {
                Authorization: `Bearer ${sessionToken}`,
            };
            const response = await axios.get(
                `${apiUrl}/api/sync-orders`,{headers}
            );
            getData()
            setBtnLoading(false);
            setLoading(false);
            setToastMsg(response?.data?.message)
            setSucessToast(true)

        } catch (error) {
            console.log('errorr',error)
            console.warn("get orders Api Error", error.response);
            setLoading(false);
            // setCustomersLoading(false)
            setToastMsg("Server Error");
            setToggleLoadData(false);
            setErrorToast(true);
            handleClearStates();
        }
    };

    const getData = async () => {

console.log(apiUrl,'url')
        try {
            const sessionToken = await getSessionToken(appBridge);
            const headers = {
                Authorization: `Bearer ${sessionToken}`,
            };
            if (pageCursorValue != '') {

                var url = pageCursorValue;
            } else {
                var url = `${apiUrl}/api/orders?${pageCursor}=${pageCursorValue}`;
            }

            const response = await axios.get(url,{headers});
                console.log('dsds',response)
            setOrders(response?.data?.data)

            setNextPageCursor(response?.data?.next_page_url)
            setPreviousPageCursor(response?.data?.prev_page_url)
            if (response?.data?.next_page_url) {
                setHasNextPage(true)
            } else {
                setHasNextPage(false)
            }
            if (response?.data?.prev_page_url) {
                setHasPreviousPage(true)
            } else {
                setHasPreviousPage(false)
            }

            setLoading(false)
            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {
                console.log(error,'error')
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }

    useEffect(() => {
        getData();
    }, [toggleLoadData]);

    return (
        <Frame>
        <div className="Products-Page IndexTable-Page Orders-page">

            {loading ? (
                <span>
          <Loading />

        </span>
            ) : (
                <Page
                    fullWidth
                    title="Orders"
                    primaryAction={{
                        content: "Sync Order",
                        onAction: handleSyncOrder,
                        loading: btnLoading,
                    }}

                >


                    <Card>

                        <div className="Polaris-Table">

                                <div>
                                    <Tabs
                                        tabs={tabs}
                                        selected={selected}
                                        onSelect={handleOrderFilter}
                                    ></Tabs>
                                </div>
                                <div className="order_listing_search" style={{ padding: "16px", display: "flex" }}>
                                    <div style={{ flex: '70%' }}>
                                        <TextField
                                            placeholder="Search Order"
                                            value={queryValue}
                                            onChange={handleFiltersQueryChange}
                                            clearButton
                                            onClearButtonClick={handleQueryValueRemove}
                                            autoComplete="off"
                                            prefix={<Icon source={SearchMinor} />}
                                        />
                                    </div>

                                    <div style={{ flex: '30%', padding: '0px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>

                                        <div style={{ flex: '1' }}>

                                            <div style={{ position: 'relative', width: 'auto', zIndex: 99999 }}>
                                                <ReactSelect
                                                    name='pushed_status'
                                                    options={[
                                                        { value: 'all', label: 'All' },
                                                        { value: 'paid', label: 'Paid' },
                                                        { value: 'unpaid', label: 'Unpaid' },
                                                        { value: 'refunded', label: 'Refunded' },
                                                    ]}
                                                    placeholder="Select Payment Status"
                                                    value={selectedStatus}
                                                    onChange={(selectedOption) => handleSelectChange(selectedOption)}
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                                                    }}
                                                />
                                            </div>

                                            {showClearButton && (
                                                <Button onClick={handleClearButtonClick} plain>
                                                    Clear
                                                </Button>
                                            )}
                                        </div>


                                    </div>
                                </div>


                                <IndexTable
                                    resourceName={resourceName}
                                    itemCount={orders?.length}
                                    hasMoreItems
                                    selectable={false}
                                    selectedItemsCount={
                                        allResourcesSelected ? "All" : selectedResources.length
                                    }
                                    onSelectionChange={handleSelectionChange}
                                    loading={customersLoading}
                                    emptyState={emptyStateMarkup}
                                    headings={[
                                        { title: "Order Id" },
                                        { title: "Store Order Num" },
                                        { title: "Date" },
                                        { title: "Payment Status" },
                                        { title: "Order Status" },

                                    ]}

                                >
                                    {rowMarkup}
                                </IndexTable>



                                <div
                                    className="data-table-pagination"
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginTop: "20px",
                                        paddingBottom: "20px",
                                    }}
                                >
                                    <Pagination
                                        hasPrevious={hasPreviousPage ? true : false}
                                        onPrevious={() => handlePagination("prev")}
                                        hasNext={hasNextPage ? true : false}
                                        onNext={() => handlePagination("next")}
                                    />
                                </div>


                        </div>

                    </Card>
                </Page>
            )}
            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
        </Frame>
    );
}

function isEmpty(value) {
    if (Array.isArray(value)) {
        return value.length === 0;
    } else {
        return value === "" || value == null;
    }

}
