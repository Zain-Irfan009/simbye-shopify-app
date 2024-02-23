import {
    Card,
    Page,
    Layout,
    TextContainer,
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Image,
    Popover,
    Scrollable,
    Pagination,
    Link,
    EmptySearchResult,
    Toast,
    ActionList,
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
import beautify from 'json-beautify';
import JSONFormatter from 'json-formatter-js'

import { ProductsCard } from "../components";
import {useNavigate,useLocation} from "react-router-dom";

export default function HomePage() {
    const  apiUrl  = 'https://phpstack-1216846-4323606.cloudwaysapps.com'
    const appBridge = useAppBridge();
    // const { user } = useAuthState();
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get('page')) || 1;
    const search_value = (queryParams.get('search')) || "";
    const [loading, setLoading] = useState(true);
    const [customersLoading, setCustomersLoading] = useState(false);
    const [selected, setSelected] = useState(0);
    const [queryValue, setQueryValue] = useState(search_value);
    const [toggleLoadData, setToggleLoadData] = useState(true);
    const [jsonData, setJsonData] = useState("");
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
        "Success",
        "Failed",
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
        const sessionToken = await getSessionToken(appBridge);

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
        const sessionToken = await getSessionToken(appBridge);

    }

    const handlePagination = (value) => {
        console.log("value", value, nextPageCursor)
        if (value == "next") {
            const nextPage = currentPage + 1;
            queryParams.set('page', nextPage.toString());
            navigate(`/Orders?${queryParams.toString()}`);
            setPageCursorValue(nextPageCursor);
        } else {
            const prevPage = currentPage - 1;
            queryParams.set('page', prevPage.toString());
            navigate(`/Orders?${queryParams.toString()}`);
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

    const handleReassignAction = async (id) => {
        setUniqueId(id);

        try {
            const sessionToken = await getSessionToken(appBridge);
            const headers = {
                Authorization: `Bearer ${sessionToken}`,
            };
            const response = await axios.get(
                `${apiUrl}/api/order-detail?id=${id}`,{headers}
            );
            console.log('response',response)

        const jsonString=JSON.parse(response?.data?.data)
            const beautifiedJson = beautify(jsonString, null, 2, 100);
            setJsonData(beautifiedJson)


            setModalReassign(true);

        } catch (error) {
            console.log('errorr',error)
            console.warn("get orders Api Error", error.response);
            setLoading(false);
            // setCustomersLoading(false)
            setToastMsg("Server Error");
            setToggleLoadData(false);
            setErrorToast(true);

        }



    };

    const handleSubmitAction = async (id) => {
        setUniqueId(id);
        setLoading(true)
        try {
            const sessionToken = await getSessionToken(appBridge);
            const headers = {
                Authorization: `Bearer ${sessionToken}`,
            };
            const response = await axios.post(
                `${apiUrl}/api/push-order?id=${id}`,{headers}
            );
            console.log('response',response)
            setToastMsg(response?.data?.message)
            if(response?.data?.success==true) {
                setSucessToast(true)

            }else {
                setToastMsg(response?.data?.message);
                setErrorToast(true);
            }
            setLoading(false)

        } catch (error) {
            console.log('errorr',error)
            console.warn("get orders Api Error", error.response);
            setLoading(false);
            // setCustomersLoading(false)
            setToastMsg("Server Error");
            setToggleLoadData(false);
            setErrorToast(true);

        }



    };


    const handleSelectChange = (selectedOption) => {
        setLoading(true)
        const selectedValue =  selectedOption; // Access the value property of the selected option
        setSelectedStatus(selectedValue);
        setShowClearButton(true);

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
                error_true,
                order_place,


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


                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {order_number != null ? order_number : "---"}
                    </Text>
                </IndexTable.Cell>


                <IndexTable.Cell>{created_at != null ? formatDate(created_at) : "---"}</IndexTable.Cell>

                {order_place === 1 && error_true === 0 ? (
                    <IndexTable.Cell className="complete">
                        <Badge progress='complete'>Success</Badge>
                    </IndexTable.Cell>
                ) : (
                    order_place === 1 && error_true === 1 ? (
                        <IndexTable.Cell className="failed">
                            <Badge progress='complete'>Failed</Badge>
                        </IndexTable.Cell>
                    ) :(
                        <IndexTable.Cell></IndexTable.Cell>
                    )
                )}


                <IndexTable.Cell>

                    <div className="btn_div">
                        {(error_true === 1 || order_place === 0) && (
                            <Button size="micro" onClick={() => handleSubmitAction(id)}>
                                Place Order
                            </Button>
                        )}
                        <div className="view_order_btn">
                        <Button size="micro" onClick={() => handleReassignAction(id)}>
                           View Order
                        </Button>
                        </div>

                    </div>
                </IndexTable.Cell>



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
            console.log(response,'msgresponse')
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
                var payment_status = encodeURIComponent(selectedStatus.value);
                var url = pageCursorValue+ '&value=' + queryValue +'&status=' +selected;
            } else {
                var payment_status = encodeURIComponent(selectedStatus.value);
                var url = `${apiUrl}/api/orders?page=${currentPage}&${pageCursor}=${pageCursorValue}&value=${queryValue}&status=${selected}`;
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
    }, [toggleLoadData,queryValue,selected,selectedStatus]);

    return (
        <Frame>
            <div className="Products-Page IndexTable-Page Orders-page">

                <Modal
                    size="large"
                    open={modalReassign}
                    onClose={handleReassignCloseAction}
                    title="Esim Order Status"
                    primaryAction={{
                        content: "Cancel",
                        onAction: handleReassignCloseAction,
                    }}

                >
                    <Scrollable   style={{ height: '300px' }}>
                            <pre>{jsonData}</pre>

                        </Scrollable>
                </Modal>

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
                                    <div style={{ flex: '100%' }}>
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

                                        { title: "Store Order Num" },
                                        { title: "Date" },
                                        { title: "Esim Access Status" },
                                        { title: 'Action' },

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
