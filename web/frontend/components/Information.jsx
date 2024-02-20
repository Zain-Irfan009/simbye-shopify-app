import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
    Page,
    Layout,
    Tabs,
    Button,
    TextField,
    Select,
    Bleed,
    BlockStack,
    Box,
    Card,
    List,
    Text,
    RadioButton,
    EmptyState,
    Modal,
    Link,
    Checkbox,
    Divider,
    Scrollable,
    RangeSlider,
    Grid,
    InlineStack,
    DropZone,
    LegacyStack,
    Thumbnail,
    ButtonGroup,
    Icon,
    Spinner,
    SkeletonThumbnail
} from '@shopify/polaris';

import { SearchMajor, MobileCancelMajor } from '@shopify/polaris-icons';
import ShowPages from './ShowPages';
import useApi from '../components/customhooks/useApi';
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { AppContext } from "../components/providers";
import useStore from '../store/store'
export default function Information({ barName: initialBarName, type: initialType, typeIds: initialTypeIds, onDataReceived }) {
    const { barInfo, setBarInfo } = useStore();
    const { shop, url } = useContext(AppContext);
    const appBridge = useAppBridge();
    const { callApi, loading } = useApi(appBridge, url);

    const [barName, setBarName] = useState(initialBarName || 'Bar 1');
    const [typeIds, setTypeIds] = useState(initialTypeIds);
    const [textFieldValue, setTextFieldValue] = useState("");
    const [apiResponse, setApiResponse] = useState();
    const [productsList, setProductsList] = useState();
    const [pagesList, setPagesList] = useState();
    const [collectionsList, setCollectionsList] = useState();
    const [blogsList, setBlogsList] = useState();


    const [collectionsModal, setCollectionsModal] = useState(false);
    const [productModal, setProductModal] = useState(false);
    const [pageModal, setPageModal] = useState(false);
    const [blogModalOpen, setBlogModalOpen] = useState(false);
    const handleBarNameChange = useCallback(
        (newValue) => setBarName(newValue),
        [],
    );
    const handleTextFieldChange = useCallback((value) => {
        setTextFieldValue(value);
    }, []);

    const handleChangesCollectionsModal = useCallback(() => {
        setCollectionsModal(!collectionsModal);
    }, [collectionsModal]);
    const handleChangeProductModal = useCallback(() => {
        setProductModal(!productModal);
    }, [productModal]);
    const handleChangePageModal = useCallback(() => {
        setPageModal(!pageModal);
    }, [pageModal]);
    const handleChangeBlogModal = useCallback(() => {
        setBlogModalOpen(!blogModalOpen);
    }, [blogModalOpen]);

    const [selectedCollections, setSelectedCollections] = useState([]);
    const [selectedCollectionsIDs, setSelectedCollectionsIDs] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedProductsIDs, setSelectedProductsIDs] = useState([]);
    const [selectedPages, setSelectedPages] = useState([]);
    const [selectedPagesIDs, setSelectedPagesIDs] = useState([]);
    const [selectedBlogs, setSelectedBlogs] = useState([]);
    const [selectedBlogsIDs, setSelectedBlogsIDs] = useState([]);

    const handleCollectionSelect = (id) => {
        const selectedCount = selectedCollectionsIDs.length;
        if (selectedCollectionsIDs?.includes(id)) {
            const newArray = selectedCollectionsIDs?.filter(
                (item) => item !== id
            );
            setSelectedCollectionsIDs(newArray);
        } else {
            setSelectedCollectionsIDs([...selectedCollectionsIDs, id]);
        }
    };
    const handleProductSelect = (id) => {
        const selectedCount = selectedProductsIDs.length;
        if (selectedProductsIDs?.includes(id)) {
            const newArray = selectedProductsIDs?.filter(
                (item) => item !== id
            );
            setSelectedProductsIDs(newArray);
        } else {
            setSelectedProductsIDs([...selectedProductsIDs, id]);
        }
    };
    const handlePageSelect = (id) => {
        const selectedCount = selectedPagesIDs.length;
        if (selectedPagesIDs?.includes(id)) {
            const newArray = selectedPagesIDs?.filter(
                (item) => item !== id
            );
            setSelectedPagesIDs(newArray);
        } else {
            setSelectedPagesIDs([...selectedPagesIDs, id]);
        }
        console.log(selectedPagesIDs);
    };
    const handleBlogSelect = (id) => {
        const selectedCount = selectedBlogsIDs.length;
        if (selectedBlogsIDs?.includes(id)) {
            const newArray = selectedBlogsIDs?.filter(
                (item) => item !== id
            );
            setSelectedBlogsIDs(newArray);
        } else {
            setSelectedBlogsIDs([...selectedBlogsIDs, id]);
        }
        console.log(selectedBlogsIDs);
    };
    const handleCollectionsSaveModal = () => {
        setCollectionsModal(false);
        const selectedProd = collectionsList.filter((product) =>
            selectedCollectionsIDs.includes(product.id)
        );

        setSelectedCollections(selectedProd);
    };
    const handleProductsSaveModal = () => {
        setProductModal(false);
        const selectedProd = productsList.filter((product) =>
            selectedProductsIDs.includes(product.id)
        );

        setSelectedProducts(selectedProd);
    };
    const handlePageSaveModal = () => {
        setPageModal(false);
        const selectedProd = pagesList?.filter((product) =>
            selectedPagesIDs?.includes(product.id)
        );
        console.log(selectedProd);

        setSelectedPages(selectedProd);

    };

    const handleBlogSaveModal = () => {
        setBlogModalOpen(false);
        const selectedProd = blogsList.filter((product) =>
            selectedBlogsIDs.includes(product.id)
        );
        console.log(selectedProd);
        setSelectedBlogs(selectedProd);
    }

    const handleRemoveCollection = (productId) => {
        const newArray = selectedCollections.filter(
            (product) => product?.id !== productId
        );
        const newIdsArray = selectedCollectionsIDs.filter(
            (id) => id !== productId
        );
        setSelectedCollectionsIDs(newIdsArray);
        setSelectedCollections(newArray);
    };
    const handleRemoveProducts = (productId) => {
        const newArray = selectedProducts.filter(
            (product) => product?.id !== productId
        );
        const newIdsArray = selectedProductsIDs.filter(
            (id) => id !== productId
        );
        setSelectedProductsIDs(newIdsArray);
        setSelectedProducts(newArray);
    };
    const handleRemovePages = (productId) => {
        const newArray = selectedPages.filter(
            (product) => product?.id !== productId
        );
        const newIdsArray = selectedPagesIDs.filter(
            (id) => id !== productId
        );
        setSelectedPagesIDs(newIdsArray);
        setSelectedPages(newArray);
    };

    const handleRemoveBlogs = (blogId) => {
        const newArray = selectedBlogs.filter(
            (blog) => blog?.id !== blogId
        );
        const newIdsArray = selectedBlogsIDs.filter(
            (id) => id !== blogId
        );
        setSelectedBlogsIDs(newIdsArray);
        setSelectedBlogs(newArray);
    };

    const [selectedRadioValue, setSelectedRadioValue] = React.useState(initialType || "home");

    // Function to handle changes in the selected radio button
    const handleRadioChange = (newValue) => {
        setSelectedRadioValue(newValue);
    };

    const getProducts = async () => {
        const response = await callApi(`get-data?type=${selectedRadioValue}&value=${textFieldValue}`, "GET");
        console.log("response", response.data);

        if (response?.data) {
            setApiResponse(response?.data);
        }
        console.log("response", response?.data);
        if (selectedRadioValue === "products") {
            setProductsList(response?.data);
        } else if (selectedRadioValue === "collections") {
            setCollectionsList(response?.data);
        } else if (selectedRadioValue === "pages") {
            setPagesList(response?.data);
        } else if (selectedRadioValue === "blogs") {
            setBlogsList(response?.data);
        }
    }

    useEffect(() => {
        getProducts();
    }, [selectedRadioValue, textFieldValue]);


    useEffect(() => {

        const Ids = selectedRadioValue === "products" ? selectedProductsIDs : selectedRadioValue === "pages" ? selectedPagesIDs : selectedRadioValue === "blogs" ? selectedBlogsIDs : selectedCollectionsIDs
        console.log("typeIds", typeIds.toString());
        setTypeIds(Ids)
    }, [selectedProductsIDs, selectedPagesIDs, selectedBlogsIDs, selectedCollectionsIDs, barName])

    useEffect(() => {
        const processedData = {
            barName,
            selectedRadioValue,
            typeIds,
        };
        onDataReceived(processedData);
    }, [barName, selectedRadioValue, typeIds]);
    return (
        <>
            <Modal
                open={collectionsModal}
                size="fullScreen"
                onClose={handleChangesCollectionsModal}
                title="Add Collection"
                primaryAction={{
                    content: "Add",
                    // disabled: !selectedRelatedProductsIDs.length,
                    onAction: handleCollectionsSaveModal,
                }}
                secondaryActions={[
                    {
                        content: "Cancel",
                        onAction: handleCollectionsSaveModal,
                    },
                ]}
            >
                <Box
                    paddingBlockStart="400"
                    paddingInlineStart="400"
                    paddingInlineEnd="400"
                    paddingBlockEnd="400"
                >
                    <TextField
                        labelHidden
                        type="text"
                        placeholder="Search collections"
                        value={textFieldValue}
                        prefix={<Icon source={SearchMajor} tone="base" />}
                        onChange={handleTextFieldChange}
                        autoComplete="off"
                    />
                </Box>
                <Divider borderWidth={1} />
                <div className="product-lists">
                    <Scrollable horizontal vertical className="yr5fA CyBRb">
                        {loading ? (
                            <div
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Spinner size="large" />
                            </div>
                        ) : collectionsList?.length ? (
                            collectionsList?.map((product, i) => {
                                const isSelectedId =
                                    selectedCollectionsIDs?.includes(
                                        product.id
                                    );
                                const isCheckboxDisabled =
                                    selectedCollectionsIDs.length >= 5 &&
                                    !isSelectedId;
                                return (
                                    <div
                                        className="product-list-item"
                                        style={{
                                            backgroundColor: isCheckboxDisabled
                                                ? "var(--p-color-bg-surface-secondary)"
                                                : "unset",
                                            color: isCheckboxDisabled
                                                ? "var(--p-color-text-disabled)"
                                                : "unset",
                                        }}
                                        key={i}
                                    >
                                        <Checkbox
                                            labelHidden
                                            checked={isSelectedId}
                                            disabled={isCheckboxDisabled}
                                            onChange={() =>
                                                handleCollectionsSelect(
                                                    product.id
                                                )
                                            }
                                        />
                                        <div
                                            className="product-list-item-product-title"
                                            onClick={() =>
                                                handleCollectionsSelect(
                                                    product.id
                                                )
                                            }
                                        >
                                            <div className="product-list-item-product-title-inner flex gap-4 items-center">
                                                <div className="product-list-item-product-title-thumbnail">
                                                    <Thumbnail
                                                        source={product?.image}
                                                        size="small"
                                                    />
                                                </div>
                                                <div className="product-list-item-product-title-text">
                                                    <div className="ExJYf">
                                                        <div className="K2zxu">
                                                            <span>
                                                                {product?.title}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Text as="h2" variant="headingMd">
                                    No Product Found
                                </Text>
                            </div>
                        )}
                    </Scrollable>
                </div>
            </Modal>
            <Modal
                open={productModal}
                size="fullScreen"
                onClose={handleChangeProductModal}
                title="Add Products"
                primaryAction={{
                    content: "Add",
                    // disabled: !selectedRelatedProductsIDs.length,
                    onAction: handleProductsSaveModal,
                }}
                secondaryActions={[
                    {
                        content: "Cancel",
                        onAction: handleChangeProductModal,
                    },
                ]}
            >
                <Box
                    paddingBlockStart="400"
                    paddingInlineStart="400"
                    paddingInlineEnd="400"
                    paddingBlockEnd="400"
                >
                    <TextField
                        labelHidden
                        type="text"
                        placeholder="Search products"
                        value={textFieldValue}
                        prefix={<Icon source={SearchMajor} tone="base" />}
                        onChange={handleTextFieldChange}
                        autoComplete="off"
                    />
                </Box>
                <Divider borderWidth={1} />
                <div className="product-lists">
                    <Scrollable horizontal vertical className="yr5fA CyBRb">
                        {loading ? (
                            <div
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Spinner size="large" />
                            </div>
                        ) : productsList?.length ? (
                            productsList?.map((product, i) => {
                                const isSelectedId =
                                    selectedProductsIDs?.includes(
                                        product.id
                                    );
                                const isCheckboxDisabled =
                                    selectedProductsIDs.length >= 5 &&
                                    !isSelectedId;
                                return (
                                    <div
                                        className="product-list-item"
                                        style={{
                                            backgroundColor: isCheckboxDisabled
                                                ? "var(--p-color-bg-surface-secondary)"
                                                : "unset",
                                            color: isCheckboxDisabled
                                                ? "var(--p-color-text-disabled)"
                                                : "unset",
                                        }}
                                        key={i}
                                    >
                                        <Checkbox
                                            labelHidden
                                            checked={isSelectedId}
                                            disabled={isCheckboxDisabled}
                                            onChange={() =>
                                                handleProductSelect(
                                                    product.id
                                                )
                                            }
                                        />
                                        <div
                                            className="product-list-item-product-title"
                                            onClick={() =>
                                                handleProductSelect(
                                                    product.id
                                                )
                                            }
                                        >
                                            <div className="product-list-item-product-title-inner flex gap-4 items-center">
                                                <div className="product-list-item-product-title-thumbnail">
                                                    <Thumbnail
                                                        source={product?.image}
                                                        size="small"
                                                    />
                                                </div>
                                                <div className="product-list-item-product-title-text">
                                                    <div className="ExJYf">
                                                        <div className="K2zxu">
                                                            <Text
                                                                as="span"
                                                                variant="bodyMd"
                                                                tone="base"
                                                            >
                                                                {product?.title}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Text as="h2" variant="headingMd">
                                    No Product Found
                                </Text>
                            </div>
                        )}
                    </Scrollable>
                </div>
            </Modal>
            <Modal
                open={blogModalOpen}
                size="fullScreen"
                onClose={handleChangeBlogModal}
                title="Add Blogs"
                primaryAction={{
                    content: "Add",
                    // disabled: !selectedRelatedProductsIDs.length,
                    onAction: handleBlogSaveModal,
                }}
                secondaryActions={[
                    {
                        content: "Cancel",
                        onAction: handleChangeBlogModal,
                    },
                ]}
            >
                <Box
                    paddingBlockStart="400"
                    paddingInlineStart="400"
                    paddingInlineEnd="400"
                    paddingBlockEnd="400"
                >
                    <TextField
                        labelHidden
                        type="text"
                        placeholder="Search pages"
                        value={textFieldValue}
                        prefix={<Icon source={SearchMajor} tone="base" />}
                        onChange={handleTextFieldChange}
                        autoComplete="off"
                    />
                </Box>
                <Divider borderWidth={1} />
                <div className="product-lists">
                    <Scrollable horizontal vertical className="yr5fA CyBRb">
                        {loading ? (
                            <div
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Spinner size="large" />
                            </div>
                        ) : blogsList?.length ? (
                            blogsList?.map((blog, i) => {
                                const isSelectedId =
                                    selectedBlogsIDs?.includes(
                                        blog.id
                                    );
                                const isCheckboxDisabled =
                                    selectedBlogsIDs.length >= 5 &&
                                    !isSelectedId;
                                return (
                                    <div
                                        className="product-list-item"
                                        style={{
                                            backgroundColor: isCheckboxDisabled
                                                ? "var(--p-color-bg-surface-secondary)"
                                                : "unset",
                                            color: isCheckboxDisabled
                                                ? "var(--p-color-text-disabled)"
                                                : "unset",
                                        }}
                                        key={i}
                                    >
                                        <Checkbox
                                            labelHidden
                                            checked={isSelectedId}
                                            disabled={isCheckboxDisabled}
                                            onChange={() => handleBlogSelect(blog.id)}
                                        />
                                        <div
                                            className="product-list-item-product-title"
                                            onClick={() =>
                                                handleBlogSelect(
                                                    blog.id
                                                )
                                            }
                                        >
                                            <div className="product-list-item-product-title-inner flex gap-4 items-center">
                                                <div className="product-list-item-product-title-text">
                                                    <div className="ExJYf">
                                                        <div className="K2zxu">
                                                            <span>
                                                                {blog?.title}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Text as="h2" variant="headingMd">
                                    No Product Found
                                </Text>
                            </div>
                        )}
                    </Scrollable>
                </div>
            </Modal>
            <Modal
                open={pageModal}
                size="fullScreen"
                onClose={handleChangePageModal}
                title="Add Pages"
                primaryAction={{
                    content: "Add",
                    // disabled: !selectedRelatedProductsIDs.length,
                    onAction: handlePageSaveModal,
                }}
                secondaryActions={[
                    {
                        content: "Cancel",
                        onAction: handleChangePageModal,
                    },
                ]}
            >
                <Box
                    paddingBlockStart="400"
                    paddingInlineStart="400"
                    paddingInlineEnd="400"
                    paddingBlockEnd="400"
                >
                    <TextField
                        labelHidden
                        type="text"
                        placeholder="Search pages"
                        value={textFieldValue}
                        prefix={<Icon source={SearchMajor} tone="base" />}
                        onChange={handleTextFieldChange}
                        autoComplete="off"
                    />
                </Box>
                <Divider borderWidth={1} />
                <div className="product-lists">
                    <Scrollable horizontal vertical className="yr5fA CyBRb">
                        {loading ? (
                            <div
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Spinner size="large" />
                            </div>
                        ) : pagesList?.length ? (
                            pagesList?.map((page, i) => {
                                const isSelectedId =
                                    selectedPagesIDs?.includes(
                                        page.id
                                    );
                                const isCheckboxDisabled =
                                    selectedPagesIDs.length >= 5 &&
                                    !isSelectedId;
                                return (
                                    <div
                                        className="product-list-item"
                                        style={{
                                            backgroundColor: isCheckboxDisabled
                                                ? "var(--p-color-bg-surface-secondary)"
                                                : "unset",
                                            color: isCheckboxDisabled
                                                ? "var(--p-color-text-disabled)"
                                                : "unset",
                                        }}
                                        key={i}
                                    >
                                        <Checkbox
                                            labelHidden
                                            checked={isSelectedId}
                                            disabled={isCheckboxDisabled}
                                            onChange={() =>
                                                handlePageSelect(
                                                    page.id
                                                )
                                            }
                                        />
                                        <div
                                            className="product-list-item-product-title"
                                            onClick={() =>
                                                handlePageSelect(
                                                    page.id
                                                )
                                            }
                                        >
                                            <div className="product-list-item-product-title-inner flex gap-4 items-center">
                                                <div className="product-list-item-product-title-text">
                                                    <div className="ExJYf">
                                                        <div className="K2zxu">
                                                            <span>
                                                                {page?.title}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Text as="h2" variant="headingMd">
                                    No Product Found
                                </Text>
                            </div>
                        )}
                    </Scrollable>
                </div>
            </Modal>
            <BlockStack gap="500" align='center'>
                <Card sectioned title="Page Bar Name">
                    <BlockStack gap="500" align='center'>
                        <Text as="h2" variant="headingSm">
                            Page Bar Name
                        </Text>
                        <TextField
                            label="Bar name"
                            value={barName}
                            onChange={handleBarNameChange}
                            autoComplete="off"
                        />
                    </BlockStack>
                </Card>

                <ShowPages selectedValue={selectedRadioValue} handleChange={handleRadioChange} />
                {
                    selectedRadioValue === 'collections' && (
                        <Card sectioned title="Page Bar Name">
                            <BlockStack gap="200" align='center'>
                                <Text as="h2" variant="headingSm">
                                    Add Collections
                                </Text>
                                <Text as="p" variant="bodyMd">
                                    Select collections where you want to show the page bar
                                </Text>

                                <TextField
                                    labelHidden
                                    type="text"
                                    placeholder="Search collections"
                                    value={textFieldValue}
                                    prefix={<Icon source={SearchMajor} tone="base" />}
                                    onChange={handleTextFieldChange}
                                    autoComplete="off"
                                    connectedRight={
                                        <Button
                                            size="large"
                                            onClick={handleChangesCollectionsModal}
                                        >
                                            Browse
                                        </Button>
                                    }
                                />
                                <div className='mb-5'>
                                </div>
                                {
                                    selectedCollections.length > 0 ? (
                                        selectedCollections.map((data, i) => (
                                            <div key={data.id}>
                                                <InlineStack align='space-between' blockAlign='center'>
                                                    <InlineStack gap={2} blockAlign='center'>
                                                        <div className='mr-5'>
                                                            <Thumbnail
                                                                source={data?.image}
                                                                size="small"
                                                            />
                                                        </div>
                                                        <BlockStack gap={1}>
                                                            <Link
                                                                url={`https://admin.shopify.com/store/`}
                                                            >
                                                                {data?.title}
                                                            </Link>
                                                            <Text as="span" variant="bodyMd" tone='base'>
                                                                {data?.price}
                                                            </Text>
                                                        </BlockStack>
                                                    </InlineStack>
                                                    <div className="close-btn">
                                                        <Button
                                                            onClick={() =>
                                                                handleRemoveCollection(
                                                                    data
                                                                        ?.id
                                                                )
                                                            }
                                                            variant="plain"
                                                            icon={
                                                                MobileCancelMajor
                                                            }
                                                        ></Button>
                                                    </div>
                                                </InlineStack>
                                            </div>
                                        ))
                                    ) : (
                                        <Box
                                            paddingBlockEnd={10}
                                            paddingBlockStart={4}
                                            paddingInlineStart={5}
                                            paddingInlineEnd={5}
                                        >
                                            <BlockStack gap={5}>
                                                <EmptyState image="https://cdn.shopify.com/shopifycloud/discovery_app/bundles/cc3fc67270dbf1d82912dddea4d3d90b7a9599fa57c97a341a8211f62424f3b0.svg">
                                                    <Text
                                                        as="span"
                                                        variant="bodyMd"
                                                        tone="subdued"
                                                    >
                                                        No collections selected, Search to
                                                        add collections.
                                                    </Text>
                                                </EmptyState>
                                            </BlockStack>
                                        </Box>
                                    )
                                }
                            </BlockStack>
                        </Card>
                    )
                }

                {
                    selectedRadioValue === 'products' && (
                        <Card sectioned title="Page Bar Name">
                            <BlockStack gap="200" align='center'>
                                <Text as="h2" variant="headingSm">
                                    Add Products
                                </Text>
                                <Text as="p" variant="bodyMd">
                                    Select products where you want to show the page bar
                                </Text>

                                <TextField
                                    labelHidden
                                    type="text"
                                    placeholder="Search products"
                                    value={textFieldValue}
                                    prefix={<Icon source={SearchMajor} tone="base" />}
                                    onChange={handleTextFieldChange}
                                    autoComplete="off"
                                    connectedRight={
                                        <Button
                                            size="large"
                                            onClick={handleChangeProductModal}
                                        >
                                            Browse
                                        </Button>
                                    }
                                />
                                <div className='mb-5'>
                                </div>
                                {
                                    selectedProducts.length > 0 ? (
                                        selectedProducts.map((data, i) => (
                                            <div key={data.id}>
                                                <InlineStack align='space-between' blockAlign='center'>
                                                    <InlineStack gap={2} blockAlign='center'>
                                                        <div className='mr-5'>
                                                            <Thumbnail
                                                                source={data?.image}
                                                                size="small"
                                                            />
                                                        </div>
                                                        <BlockStack gap={1}>
                                                            <Link
                                                                url={`https://admin.shopify.com/store/`}
                                                            >
                                                                {data?.title}
                                                            </Link>
                                                            <Text as="span" variant="bodyMd" tone="base"
                                                            >
                                                                {data?.price}
                                                            </Text>
                                                        </BlockStack>
                                                    </InlineStack>
                                                    <div className="close-btn">
                                                        <Button
                                                            onClick={() =>
                                                                handleRemoveProducts(
                                                                    data
                                                                        ?.id
                                                                )
                                                            }
                                                            variant="plain"
                                                            icon={
                                                                MobileCancelMajor
                                                            }
                                                        ></Button>
                                                    </div>
                                                </InlineStack>
                                            </div>
                                        ))
                                    ) : (
                                        <Box
                                            paddingBlockEnd={10}
                                            paddingBlockStart={4}
                                            paddingInlineStart={5}
                                            paddingInlineEnd={5}
                                        >
                                            <BlockStack gap={5}>
                                                <EmptyState image="https://cdn.shopify.com/shopifycloud/discovery_app/bundles/cc3fc67270dbf1d82912dddea4d3d90b7a9599fa57c97a341a8211f62424f3b0.svg">
                                                    <Text
                                                        as="span"
                                                        variant="bodyMd"
                                                        tone="subdued"
                                                    >
                                                        No products selected, Search to
                                                        add products.
                                                    </Text>
                                                </EmptyState>
                                            </BlockStack>
                                        </Box>
                                    )

                                }
                            </BlockStack>
                        </Card>
                    )
                }

                <div className='mb-5'>
                    {
                        selectedRadioValue === 'pages' && (
                            <Card sectioned title="Page Bar Name" className="mb-5">
                                <BlockStack gap="200" align='center'>
                                    <Text as="h2" variant="headingSm">
                                        Add Pages
                                    </Text>
                                    <Text as="p" variant="bodyMd">
                                        Select blogs where you want to show the page bar
                                    </Text>

                                    <TextField
                                        labelHidden
                                        type="text"
                                        placeholder="Search pages"
                                        value={textFieldValue}
                                        prefix={<Icon source={SearchMajor} tone="base" />}
                                        onChange={handleTextFieldChange}
                                        autoComplete="off"
                                        connectedRight={
                                            <Button
                                                size="large"
                                                onClick={handleChangePageModal}
                                            >
                                                Browse
                                            </Button>
                                        }
                                    />
                                    <div className='mb-5'>
                                    </div>
                                    {
                                        selectedPages.length > 0 ? (
                                            selectedPages.map((data, i) => (
                                                <div key={data.id}>
                                                    <InlineStack align='space-between' blockAlign='center'>
                                                        <Link
                                                            url={`https://admin.shopify.com/store/`}
                                                        >
                                                            {data?.title}
                                                        </Link>
                                                        <Button
                                                            onClick={() =>
                                                                handleRemovePages(
                                                                    data?.id
                                                                )
                                                            }
                                                            variant="plain"
                                                            icon={
                                                                MobileCancelMajor
                                                            }
                                                        ></Button>
                                                    </InlineStack>
                                                    {console.log(data)}
                                                </div>
                                            ))
                                        ) : (
                                            <Box
                                                paddingBlockEnd={10}
                                                paddingBlockStart={4}
                                                paddingInlineStart={5}
                                                paddingInlineEnd={5}
                                            >
                                                <BlockStack gap={5}>
                                                    <EmptyState image="https://cdn.shopify.com/shopifycloud/discovery_app/bundles/cc3fc67270dbf1d82912dddea4d3d90b7a9599fa57c97a341a8211f62424f3b0.svg">
                                                        <Text
                                                            as="span"
                                                            variant="bodyMd"
                                                            tone="subdued"
                                                        >
                                                            No pages selected, Search to
                                                            add pages.
                                                        </Text>
                                                    </EmptyState>
                                                </BlockStack>
                                            </Box>
                                        )
                                    }
                                </BlockStack>
                            </Card>
                        )
                    }
                    {
                        selectedRadioValue === 'blogs' && (
                            <Card sectioned title="Page Bar Name" className="mb-5">
                                <BlockStack gap="200" align='center'>
                                    <Text as="h2" variant="headingSm">
                                        Add Blogs
                                    </Text>
                                    <Text as="p" variant="bodyMd">
                                        Select pages where you want to show the page bar
                                    </Text>

                                    <TextField
                                        labelHidden
                                        type="text"
                                        placeholder="Search Blogs"
                                        value={textFieldValue}
                                        prefix={<Icon source={SearchMajor} tone="base" />}
                                        onChange={handleTextFieldChange}
                                        autoComplete="off"
                                        connectedRight={
                                            <Button
                                                size="large"
                                                onClick={handleChangeBlogModal}
                                            >
                                                Browse
                                            </Button>
                                        }
                                    />
                                    <div className='mb-5'>
                                    </div>
                                    {
                                        selectedBlogs.length > 0 ? (
                                            selectedBlogs.map((data, i) => (
                                                <div key={data.id}>
                                                    <InlineStack align='space-between' blockAlign='center'>
                                                        <Link
                                                            url={`https://admin.shopify.com/store/`}
                                                        >
                                                            {data?.title}
                                                        </Link>
                                                        <Button
                                                            onClick={() =>
                                                                handleRemoveBlogs(
                                                                    data?.id
                                                                )
                                                            }
                                                            variant="plain"
                                                            icon={
                                                                MobileCancelMajor
                                                            }
                                                        ></Button>
                                                    </InlineStack>
                                                    {console.log(data)}
                                                </div>
                                            ))
                                        ) : (
                                            <Box
                                                paddingBlockEnd={10}
                                                paddingBlockStart={4}
                                                paddingInlineStart={5}
                                                paddingInlineEnd={5}
                                            >
                                                <BlockStack gap={5}>
                                                    <EmptyState image="https://cdn.shopify.com/shopifycloud/discovery_app/bundles/cc3fc67270dbf1d82912dddea4d3d90b7a9599fa57c97a341a8211f62424f3b0.svg">
                                                        <Text
                                                            as="span"
                                                            variant="bodyMd"
                                                            tone="subdued"
                                                        >
                                                            No pages selected, Search to
                                                            add pages.
                                                        </Text>
                                                    </EmptyState>
                                                </BlockStack>
                                            </Box>
                                        )
                                    }
                                </BlockStack>
                            </Card>
                        )
                    }

                </div>
            </BlockStack>
        </>
    );
}