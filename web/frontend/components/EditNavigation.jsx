import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Page, Card, Layout, Tabs, Button, TextField, Select, BlockStack, EmptyState, Spinner, Modal, Link, Box, Checkbox, Divider, Scrollable, RangeSlider, Grid, InlineStack, Text, DropZone, LegacyStack, Thumbnail, ButtonGroup, Icon } from "@shopify/polaris";
import ToggleSwitch from './ToggleButton';
import ColorPicker from './ColorPicker';
import closeSvg from '../assets/close.svg'
import { ImCross } from "react-icons/im";
import { NoteMinor, DesktopMajor, MobileMajor, SearchMajor, MobileCancelMajor } from '@shopify/polaris-icons';
// import Information from './Information';
import useApi from '../components/customhooks/useApi';
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { AppContext } from "../components/providers";
import ShowPages from './ShowPages';
import { useParams, useNavigate } from "react-router-dom";
import { SkeltonPageWithTabs } from '../components/SkeltonPage'

function Information({ barName,
    setBarName,
    setTypeIds,
    typeIds,
    selectedRadioValue,
    setSelectedRadioValue,
    selectedCollections,
    setSelectedCollections,
    selectedProducts,
    setSelectedProducts,
    selectedPages,
    setSelectedPages,
    setSelectedBlogs,
    selectedBlogs,
    selectedBlogsIDs,
    setSelectedBlogsIDs,
    selectedPagesIDs,
    setSelectedPagesIDs,
    selectedCollectionsIDs,
    setSelectedCollectionsIDs,
    selectedProductsIDs,
    setSelectedProductsIDs,
}) {
    const { shop, url } = useContext(AppContext);
    const appBridge = useAppBridge();
    const { callApi, loading } = useApi(appBridge, url);


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
        // setTimeout(() => {
        //     if (selectedRadioValue == "products") {
        //         const selectedProds = response?.data?.filter((item) => typeIds.includes(item.id));
        //         console.log("selectedProducts sdsdsdsd", selectedProds, selectedProductsIDs, apiResponse);
        //         setSelectedProducts(selectedProds);
        //     } else if (selectedRadioValue == "pages") {
        //         const pages = apiResponse?.filter((item) => selectedPagesIDs.includes(item.id));
        //         setSelectedPages(pages);
        //     } else if (selectedRadioValue == "collections") {
        //         const collections = apiResponse?.filter((item) => selectedCollectionsIDs.includes(item.id));
        //         console.log("collections", collections, apiResponse);
        //         setSelectedCollections(collections);
        //     } else if (selectedRadioValue == "blogs") {
        //         const blogs = apiResponse?.filter((item) => selectedBlogsIDs.includes(item.id));
        //         console.log("blogs", blogs, apiResponse, selectedBlogsIDs);
        //         setSelectedBlogs(blogs);
        //     }
        // }, 5000);


    }
    useEffect(() => {
        getProducts();
    }, [selectedRadioValue, textFieldValue]);

    // useEffect(() => {
    //     setTimeout(() => {
    //         if (selectedRadioValue == "products") {
    //             const selectedProds = apiResponse?.filter((item) => selectedProductsIDs.includes(item.id));
    //             console.log("selectedProducts sdsdsdsd", selectedProds, selectedProductsIDs, apiResponse);
    //             setSelectedProducts(selectedProds);
    //         } else if (selectedRadioValue == "pages") {
    //             const pages = apiResponse?.filter((item) => selectedPagesIDs.includes(item.id));
    //             setSelectedPages(pages);
    //         } else if (selectedRadioValue == "collections") {
    //             const collections = apiResponse?.filter((item) => selectedCollectionsIDs.includes(item.id));
    //             console.log("collections", collections, apiResponse);
    //             setSelectedCollections(collections);
    //         } else if (selectedRadioValue == "blogs") {
    //             const blogs = apiResponse?.filter((item) => selectedBlogsIDs.includes(item.id));
    //             console.log("blogs", blogs, apiResponse, selectedBlogsIDs);
    //             setSelectedBlogs(blogs);
    //         }
    //     }, 5000);
    // }, [])

    useEffect(() => {
        const Ids = selectedRadioValue === "products" ? selectedProductsIDs : selectedRadioValue === "pages" ? selectedPagesIDs : selectedRadioValue === "blogs" ? selectedBlogsIDs : selectedRadioValue === "collections" ? selectedCollectionsIDs : "";
        setTypeIds(Ids)
        console.log("typeIds", typeIds);
    }, [selectedProductsIDs, selectedPagesIDs, selectedBlogsIDs, selectedCollectionsIDs, barName])


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
                                                handleCollectionSelect(
                                                    product.id
                                                )
                                            }
                                        />
                                        <div
                                            className="product-list-item-product-title"
                                            onClick={() =>
                                                handleCollectionSelect(
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
                                    selectedCollections?.length > 0 ? (
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
                                    selectedProducts?.length > 0 ? (
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
                                        selectedBlogs?.length > 0 ? (
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

function BarContent({
    title,
    scroll,
    btnText,
    btnLink,
    showBtn,
    titleColor,
    barColor,
    btnColor,
    btnTextColor,
    closeBtnColor,
    titleSize,
    titleWeight,
    buttonTextSize,
    buttonTextWeight,
    activeView,
    handleColorChange,
    handleSliderChange,
    handleStepedSliderChange,
    handleInputChange,
    handleToggleChange,
    setTitleColor,
    setBarColor,
    setBtnColor,
    setBtnTextColor,
    setCloseBtnColor,
    setTitleSize,
    setTitleWeight,
    setButtonTextSize,
    setButtonTextWeight,
    setActiveView,
    setTitle,
    setScroll,
    setBtnText,
    setBtnLink,
    setShowBtn
}) {

    const handleViewChange = useCallback(
        (view) => {
            if (activeView === view) return;
            setActiveView(view);
        },
        [activeView],
    );

    return (
        <Grid columns={{ sm: 3 }}>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 8, lg: 8, xl: 8 }}>
                <Card title="Sales" background='bg-fill-secondary-hover' >
                    <div className='flex justify-center items-center my-5'>
                        <ButtonGroup variant="segmented">
                            <Button
                                pressed={activeView === "desktop"}
                                onClick={() => handleViewChange("desktop")}
                                icon={DesktopMajor}
                                size='large'

                            >
                            </Button>
                            <Button
                                pressed={activeView === "mobile"}
                                onClick={() => handleViewChange("mobile")}
                                icon={MobileMajor}
                                size='large'
                            >
                            </Button>
                        </ButtonGroup>
                    </div>
                    {
                        activeView === "desktop" ? (
                            <div style={{ minHeight: '550px' }} className='relative bg-white '>
                                <div className="w-full absolute bottom-0 left-0 px-2 py-2" style={{ backgroundColor: barColor }}>
                                    <div className={`flex ${showBtn ? 'justify-between' : 'justify-around'} items-center justify-around`}>
                                        <span className='w-7 h-7 flex justify-center items-center rounded-full'>
                                            <ImCross className='w-6 h-6 ' style={{ color: closeBtnColor }} />
                                        </span>
                                        <h4 className='font-bold text-2xl ml-32' style={{ color: titleColor, fontWeight: titleWeight, fontSize: titleSize }}>
                                            {title || 'Would you like to Get 20% Discount?'}
                                        </h4>
                                        {
                                            showBtn && (
                                                <button href={btnLink} style={{ backgroundColor: btnColor, fontWeight: buttonTextWeight, fontSize: buttonTextSize, color: btnTextColor }} className='px-10 py-0.5 text-xl font-bold'>
                                                    {btnText || 'Get?'}
                                                </button>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ minHeight: '550px' }} className='relative bg-white max-w-[320px] mx-auto'>
                                <div className='w-full absolute bottom-0 left-0'>
                                    <BlockStack >
                                        <div className=" px-2 py-2" style={{ backgroundColor: barColor }}>
                                            <div className='flex justify-between items-center py-1'>
                                                <span className='w-7 h-7 flex justify-center items-center rounded-full'>
                                                    <ImCross className='w-4 h-4 ' style={{ color: closeBtnColor }} />
                                                </span>
                                                <h4 className='font-semibold text-base break-all text-center leading-8' style={{ color: titleColor, fontWeight: titleWeight, fontSize: titleSize }}>
                                                    {title || 'Would you like to Get 20% Discount?'}
                                                </h4>
                                            </div>
                                        </div>
                                        {
                                            showBtn && (
                                                <button href={btnLink} style={{ backgroundColor: btnColor, fontWeight: buttonTextWeight, fontSize: buttonTextSize, color: btnTextColor }} className='px-10 w-full py-1 text-xl font-bold'>
                                                    {btnText || 'Get?'}
                                                </button>
                                            )
                                        }
                                    </BlockStack>
                                </div>
                            </div>
                        )
                    }

                </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 4 }}>
                <div className='overflow-y-auto h-[calc(100vh-150px)]'>
                    <BlockStack gap="500" align='center'>
                        <Card sectioned>
                            <BlockStack gap="300">
                                <TextField label="Title" value={title} onChange={handleInputChange(setTitle)} autoComplete="off" />
                                <TextField label="Scroll %" value={scroll} onChange={handleInputChange(setScroll)} autoComplete="off" />
                                <InlineStack gap="200" align='space-between'>
                                    <span>Button</span>
                                    <ToggleSwitch checked={showBtn} onChange={handleToggleChange} round />
                                </InlineStack>
                                {
                                    showBtn && (
                                        <>
                                            <TextField label="Button Text" value={btnText} onChange={handleInputChange(setBtnText)} autoComplete="off" />
                                            {/* <TextField label="Button Link" value={btnLink} onChange={handleInputChange(setBtnLink)} autoComplete="off" /> */}
                                        </>
                                    )
                                }
                            </BlockStack>
                        </Card>
                        <Card sectioned>
                            <BlockStack gap="300">
                                <ColorPicker value={titleColor} onChange={handleColorChange(setTitleColor)} label="Title" />
                                <ColorPicker value={barColor} onChange={handleColorChange(setBarColor)} label="Bar" />
                                {
                                    showBtn && (
                                        <>
                                            <ColorPicker value={btnColor} onChange={handleColorChange(setBtnColor)} label="Button" />
                                            <ColorPicker value={btnTextColor} onChange={handleColorChange(setBtnTextColor)} label="Button Text" />
                                        </>
                                    )
                                }
                                <ColorPicker value={closeBtnColor} onChange={handleColorChange(setCloseBtnColor)} label="Close Button" />
                            </BlockStack>
                        </Card>
                        <Card sectioned>
                            <BlockStack gap="500" align='center'>
                                <RangeSlider label="Title Text" value={titleSize} max={32} min={16} onChange={handleSliderChange(setTitleSize)} output />
                                <RangeSlider output label="Tittle weight" min={100} max={800} step={100} value={titleWeight} onChange={handleStepedSliderChange(setTitleWeight)} />
                                {
                                    showBtn && (
                                        <>
                                            <RangeSlider label="Button Text" value={buttonTextSize} max={32} min={16} onChange={handleSliderChange(setButtonTextSize)} output />
                                            <RangeSlider output label="Button Text weight" min={100} max={800} step={100} value={buttonTextWeight} onChange={handleStepedSliderChange(setButtonTextWeight)} />
                                        </>
                                    )
                                }
                            </BlockStack>
                        </Card>
                    </BlockStack>
                </div>
            </Grid.Cell>
        </Grid >
    );
};

const FormContent = ({ onFormSectionChange, formTitle,
    setFormTitle,
    formSubtitle,
    setFormSubtitle,
    formPrimaryBtnText,
    setFormPrimaryBtnText,
    formPrimaryBtnLink,
    setFormPrimaryBtnLink,
    formSecondaryBtnText,
    setFormSecondaryBtnText,
    formSecondaryBtnLink,
    setFormSecondaryBtnLink,
    formWarningText,
    setFormWarningText,
    formFile,
    setFormFile,
    formSection,
    setFormSection,
    formName,
    setFormName,
    formEmail,
    setFormEmail,
    formPhone,
    setFormPhone,
    formTitleColor,
    setFormTitleColor,
    formSubtitleColor,
    setFormSubtitleColor,
    formBtnColor,
    setFormBtnColor,
    formBtnTextColor,
    setFormBtnTextColor,
    formRejectTextColor,
    setFormRejectTextColor,
    formBgColor,
    setFormBgColor,
    formCloseBtnColor,
    setFormCloseBtnColor,
    formTitleSize,
    setFormTitleSize,
    formTitleWeight,
    setFormTitleWeight,
    formSubtitleSize,
    setFormSubtitleSize,
    formSubtitleWeight,
    setFormSubtitleWeight,
    formButtonTextSize,
    setFormButtonTextSize,
    formButtonTextWeight,
    handleDropZoneDrop,
    formDiscountCode,
    setFormDiscountCode,
    formDiscount,
    setFormDiscount,
    setFormButtonTextWeight, }) => {

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    const fileUpload = !formFile && <DropZone.FileUpload />;
    const uploadedFile = formFile && (
        <LegacyStack>
            <Thumbnail
                size="small"
                alt={formFile.name}
                source={validImageTypes.includes(formFile.type) ? window.URL.createObjectURL(formFile) : NoteMinor}
            />
        </LegacyStack>
    );

    return (
        <Grid columns={{ sm: 3 }}>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 8, lg: 8, xl: 8 }}>
                <Card title="Sales">
                    <div className='min-h-[650px] flex justify-center items-center'>
                        {
                            formSection && (
                                <div className="relative rounded-2xl p-6 w-[500px] shadow-lg flex justify-center items-center text-center gap-4 flex-col" style={{ backgroundColor: formBgColor }}>
                                    <span className='w-9 h-9 absolute -top-2 -right-2 flex justify-center items-center cursor-pointer text-white rounded-full' style={{ backgroundColor: formCloseBtnColor }}>
                                        <ImCross className='w-4 h-4' />
                                    </span>
                                    <p className="text-gray-600  font-bold mb-5  max-w-[90%]" style={{ color: formTitleColor, fontSize: formTitleSize, fontWeight: formTitleWeight, lineHeight: 1.5 }}>
                                        {formTitle || "Would you like to get 20% discount?"}
                                    </p>
                                    <p className="text-gray-600 text-xl font-bold mb-8 max-w-[90%]" style={{ color: formSubtitleColor, fontSize: formSubtitleSize, fontWeight: formSubtitleWeight }}>
                                        {formSubtitle || "Subtitle will be here"}
                                    </p>
                                    <img src={formFile} />
                                    {formFile && (
                                        <img
                                            className='max-w-[80%]'
                                            src={formFile && validImageTypes?.includes(formFile.type) ? window.URL.createObjectURL(formFile) : ''}
                                            alt="image"
                                        />
                                    )}

                                    {formName && <input type="text" className="bg-[#4494ff] text-2xl placeholder-white max-w-[80%] focus:outline-none font-bold text-white rounded-lg block w-full p-2.5" placeholder="name" required />}
                                    {formEmail && <input type="text" className="bg-[#4494ff] text-2xl placeholder-white max-w-[80%] focus:outline-none font-bold text-white rounded-lg block w-full p-2.5" placeholder="email" required />}
                                    {formPhone && <input type="text" className="bg-[#4494ff] text-2xl placeholder-white max-w-[80%] focus:outline-none font-bold text-white rounded-lg block w-full p-2.5" placeholder="phone" required />}
                                    <button href='#' className="bg-black text-white px-3 py-2 rounded-lg text-2xl font-bold mt-8" style={{ backgroundColor: formBtnColor, color: formBtnTextColor, fontSize: formButtonTextSize, fontWeight: formButtonTextWeight }}>
                                        {formPrimaryBtnText || "Get discount Code"}
                                    </button>
                                    <a className='text-2xl font-bold underline' style={{ color: formRejectTextColor, fontSize: formButtonTextSize, fontWeight: formButtonTextWeight }} href='#'>
                                        {formSecondaryBtnText || "No, thanks"}
                                    </a>
                                    <span className='text-white'>{formWarningText || "Suitable for GDPR structure"}</span>
                                </div>
                            )
                        }
                    </div>
                </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 4 }}>
                <div className='overflow-y-auto h-[calc(100vh-150px)]'>
                    <BlockStack gap="500" align='center'>
                        {formSection && (
                            <>
                                <Card sectioned>
                                    <BlockStack gap="500" align='center'>
                                        <InlineStack gap="200" align='space-between'>
                                            <Text variant="bodyMd" as="p">
                                                Name
                                            </Text>
                                            <ToggleSwitch checked={formName} onChange={() => setFormName(prevState => !prevState)} round />
                                        </InlineStack>
                                        <InlineStack gap="200" align='space-between'>
                                            <Text variant="bodyMd" as="p">
                                                Email
                                            </Text>
                                            <ToggleSwitch checked={formEmail} onChange={() => setFormEmail(prevState => !prevState)} round />
                                        </InlineStack>
                                        <InlineStack gap="200" align='space-between'>
                                            <Text variant="bodyMd" as="p">
                                                Phone
                                            </Text>
                                            <ToggleSwitch checked={formPhone} onChange={() => setFormPhone(prevState => !prevState)} round />
                                        </InlineStack>
                                    </BlockStack>
                                </Card>
                                <Card sectioned>
                                    <BlockStack gap="500" align='center'>
                                        <InlineStack gap="200" align='space-between' blockAlign='center'>
                                            <span>Image</span>
                                            <div className='w-10 h-10'>
                                                <DropZone allowMultiple={false} onDrop={handleDropZoneDrop}>
                                                    {uploadedFile}
                                                    {fileUpload}
                                                </DropZone>
                                            </div>
                                        </InlineStack>
                                        <TextField
                                            label="Title"
                                            value={formTitle}
                                            onChange={(value) => setFormTitle(value)}
                                            autoComplete="off"
                                        />

                                        <TextField
                                            label="Subtitle"
                                            value={formSubtitle}
                                            onChange={(value) => setFormSubtitle(value)}
                                            autoComplete="off"
                                        />

                                        <TextField
                                            label="Primary Button Text"
                                            value={formPrimaryBtnText}
                                            onChange={(value) => setFormPrimaryBtnText(value)}
                                            autoComplete="off"
                                        />

                                        <TextField
                                            label="Primary Button Link"
                                            value={formPrimaryBtnLink}
                                            onChange={(value) => setFormPrimaryBtnLink(value)}
                                            autoComplete="off"
                                        />

                                        <TextField
                                            label="Discount Code"
                                            value={formDiscountCode}
                                            onChange={(value) => setFormDiscountCode(value)}
                                            autoComplete="off"
                                        />

                                        <TextField
                                            label="Discount"
                                            type='number'
                                            value={formDiscount}
                                            onChange={(value) => setFormDiscount(value)}
                                            autoComplete="off"
                                        />

                                        <TextField
                                            label="Secondary Button Text"
                                            value={formSecondaryBtnText}
                                            onChange={(value) => setFormSecondaryBtnText(value)}
                                            autoComplete="off"
                                        />

                                        <TextField
                                            label="Secondary Button Link"
                                            value={formSecondaryBtnLink}
                                            onChange={(value) => setFormSecondaryBtnLink(value)}
                                            autoComplete="off"
                                        />

                                        <TextField
                                            label="Warning Text"
                                            value={formWarningText}
                                            onChange={(value) => setFormWarningText(value)}
                                            autoComplete="off"
                                        />
                                    </BlockStack>
                                </Card>
                                <Card sectioned>
                                    <BlockStack gap="500" align='center'>
                                        <ColorPicker value={formTitleColor} onChange={color => setFormTitleColor(color)} label="Title" />
                                        <ColorPicker value={formSubtitleColor} onChange={color => setFormSubtitleColor(color)} label="Subtitle" />
                                        <ColorPicker value={formBtnColor} onChange={color => setFormBtnColor(color)} label="Button" />
                                        <ColorPicker value={formBtnTextColor} onChange={color => setFormBtnTextColor(color)} label="Button Text" />
                                        <ColorPicker value={formRejectTextColor} onChange={color => setFormRejectTextColor(color)} label="Reject Text" />
                                        <ColorPicker value={formBgColor} onChange={color => setFormBgColor(color)} label="Background" />
                                        <ColorPicker value={formCloseBtnColor} onChange={color => setFormCloseBtnColor(color)} label="Close Button" />
                                    </BlockStack>
                                </Card>
                                <Card sectioned>
                                    <BlockStack gap="500" align='center'>
                                        <RangeSlider label="Title Text" value={formTitleSize} max={40} min={16} onChange={value => setFormTitleSize(value)} output />
                                        <RangeSlider output label="Tittle weight" min={100} max={800} step={100} value={formTitleWeight} onChange={value => setFormTitleWeight(value)} />
                                        <RangeSlider label="Subtitle Text " value={formSubtitleSize} max={40} min={16} onChange={value => setFormSubtitleSize(value)} output />
                                        <RangeSlider output label="Subtitle weight" min={100} max={800} step={100} value={formSubtitleWeight} onChange={value => setFormSubtitleWeight(value)} />
                                        <RangeSlider label="Button Text" value={formButtonTextSize} max={40} min={16} onChange={value => setFormButtonTextSize(value)} output />
                                        <RangeSlider output label="Button Text weight" min={100} max={800} step={100} value={formButtonTextWeight} onChange={value => setFormButtonTextWeight(value)} />
                                    </BlockStack>
                                </Card>
                            </>
                        )}
                    </BlockStack>
                </div>
            </Grid.Cell>

        </Grid>
    );
};

const SuccessContent = ({
    successFormTitle,
    setSuccessFormTitle,
    successFormButtonText,
    setSuccessFormButtonText,
    successFormMiddleText,
    setSuccessFormMiddleText,
    successFormBtnLink,
    setSuccessFormBtnLink,
    successFormTitleColor,
    setSuccessFormTitleColor,
    successFormButtonTextColor,
    setSuccessFormButtonTextColor,
    successFormBackgroundColor,
    setSuccessFormBackgroundColor,
    successFormMiddleTextColor,
    setSuccessFormMiddleTextColor,
    successFormShowBtn,
    setSuccessFormShowBtn,
}) => {
    const handleInputChange = useCallback((setter) => (newValue) => setter(newValue), []);
    const handleToggleChange = () => setSuccessFormShowBtn((prevChecked) => !prevChecked);
    const handleColorChange = useCallback((setter) => (newColor) => setter(newColor), []);
    return (
        <Grid columns={{ sm: 3 }}>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 8, lg: 8, xl: 8 }}>
                <Card title="Sales">
                    <div className='min-h-[650px] flex justify-center items-center'>
                        <div className="relative rounded-[40px] p-6 w-[500px] shadow-lg flex justify-center items-center text-center gap-4 flex-col" style={{ backgroundColor: successFormBackgroundColor }}>
                            <span className='w-9 h-9 absolute -top-2 bg-[#4494ff] -right-2 flex justify-center items-center cursor-pointer text-white rounded-full'>
                                <ImCross className='w-4 h-4' />
                            </span>
                            <p className="text-gray-600 text-2xl font-bold mb-16 max-w-[90%]" style={{ color: successFormTitleColor }}>{successFormTitle || "You can use the code below on the checkout."}</p>
                            <span className='px-24  py-1 text-4xl font-bold rounded-xl bg-[#4494ff]' style={{ color: successFormMiddleTextColor }}>{successFormMiddleText || "AFW53JND"}</span>
                            <button className="bg-[#4494ff] px-3 py-2 rounded-lg text-2xl font-bold mt-16" style={{ color: successFormButtonTextColor }}>{successFormButtonText || "Get discount Code"}</button>
                            <span className='text-white'> suitabl for GDPR structure</span>
                        </div>
                    </div>
                </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 4 }}>
                <BlockStack gap="500" align='center'>
                    <Card sectioned>
                        <BlockStack gap="500" align='center'>
                            <TextField label="Title" value={successFormTitle} onChange={handleInputChange(setSuccessFormTitle)} autoComplete="off" />
                            <TextField label="Middle Text" value={successFormMiddleText} onChange={handleInputChange(setSuccessFormMiddleText)} autoComplete="off" />
                            <InlineStack gap="200" align='space-between'>
                                <span>Button</span>
                                <ToggleSwitch checked={successFormShowBtn} onChange={handleToggleChange} round />
                            </InlineStack>
                            {successFormShowBtn && (
                                <>
                                    <TextField label="Button Text" value={successFormButtonText} onChange={handleInputChange(setSuccessFormButtonText)} autoComplete="off" />
                                    <TextField label="Button Link" value={successFormBtnLink} onChange={handleInputChange(setSuccessFormBtnLink)} autoComplete="off" />
                                </>
                            )}
                        </BlockStack>
                    </Card>
                    <Card sectioned>
                        <BlockStack gap="500" align='center'>
                            <ColorPicker value={successFormTitleColor} onChange={handleColorChange(setSuccessFormTitleColor)} label="Title" />
                            {successFormShowBtn && (
                                <ColorPicker value={successFormButtonTextColor} onChange={handleColorChange(setSuccessFormButtonTextColor)} label="Button Text" />
                            )}
                            <ColorPicker value={successFormBackgroundColor} onChange={handleColorChange(setSuccessFormBackgroundColor)} label="Background" />
                            <ColorPicker value={successFormMiddleTextColor} onChange={handleColorChange(setSuccessFormMiddleTextColor)} label="Middle Text" />
                        </BlockStack>
                    </Card>
                </BlockStack>
            </Grid.Cell>
        </Grid>
    );
};

const EditNavigation = () => {

    const { shop, url } = useContext(AppContext);
    // console.log("from information ", shop);
    const appBridge = useAppBridge()
    const params = useParams();
    const navigate = useNavigate();

    // const { show } = useToast();
    const { callApi, loading, error } = useApi(appBridge, url);
    const [selected, setSelected] = useState(0);
    const [active, setActive] = useState(false);
    const [editResponse, setEditResponse] = useState();
    const toggleActive = useCallback(() => setActive((active) => !active), []);


    /// information state
    const [barName, setBarName] = useState('Bar 1');
    const [typeIds, setTypeIds] = useState();
    const [selectedRadioValue, setSelectedRadioValue] = React.useState("home");
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedPages, setSelectedPages] = useState([]);
    const [selectedBlogs, setSelectedBlogs] = useState([]);
    const [selectedCollectionsIDs, setSelectedCollectionsIDs] = useState([]);
    const [selectedProductsIDs, setSelectedProductsIDs] = useState([]);
    const [selectedPagesIDs, setSelectedPagesIDs] = useState([]);
    const [selectedBlogsIDs, setSelectedBlogsIDs] = useState([]);
    // bar content state
    const [title, setTitle] = useState('');
    const [scroll, setScroll] = useState('');
    const [btnText, setBtnText] = useState('');
    const [btnLink, setBtnLink] = useState('');

    const handleInputChange = useCallback((setter) => (newValue) => setter(newValue), []);

    const [showBtn, setShowBtn] = useState(true);
    const handleToggleChange = () => setShowBtn((prevChecked) => !prevChecked);

    const [titleColor, setTitleColor] = useState('#ffff');
    const [barColor, setBarColor] = useState('#8c52ff');
    const [btnColor, setBtnColor] = useState('#ecaaff');
    const [btnTextColor, setBtnTextColor] = useState('#00000');
    const [closeBtnColor, setCloseBtnColor] = useState('#000000');

    const [activeView, setActiveView] = useState("desktop");

    const handleColorChange = (setter) => (newColor) => setter(newColor);


    const [titleSize, setTitleSize] = useState(16);
    const [titleWeight, setTitleWeight] = useState(500);
    const [buttonTextSize, setButtonTextSize] = useState(16);
    const [buttonTextWeight, setButtonTextWeight] = useState(500);

    const handleSliderChange = (sliderSetter) => (value) => {
        sliderSetter(value);
    };
    const handleStepedSliderChange = (sliderSetter) => (value) => {
        sliderSetter(value);
    };

    /// form content
    const [formTitle, setFormTitle] = useState('');
    const [formSubtitle, setFormSubtitle] = useState('');
    const [formPrimaryBtnText, setFormPrimaryBtnText] = useState('');
    const [formPrimaryBtnLink, setFormPrimaryBtnLink] = useState('');
    const [formSecondaryBtnText, setFormSecondaryBtnText] = useState('');
    const [formSecondaryBtnLink, setFormSecondaryBtnLink] = useState('');
    const [formWarningText, setFormWarningText] = useState('');
    const [] = useState('');
    const [formFile, setFormFile] = useState('');
    const [formDiscountCode, setFormDiscountCode] = useState('');
    const [formDiscount, setFormDiscount] = useState('');

    const [formSection, setFormSection] = useState(true);
    const [formName, setFormName] = useState(false);
    const [formEmail, setFormEmail] = useState(false);
    const [formPhone, setFormPhone] = useState(false);

    const [formTitleColor, setFormTitleColor] = useState('#ffff');
    const [formSubtitleColor, setFormSubtitleColor] = useState('#ffff');
    const [formBtnColor, setFormBtnColor] = useState('#4494ff');
    const [formBtnTextColor, setFormBtnTextColor] = useState('#010203');
    const [formRejectTextColor, setFormRejectTextColor] = useState('#ffff');
    const [formBgColor, setFormBgColor] = useState('#004aad');
    const [formCloseBtnColor, setFormCloseBtnColor] = useState('#4494ff');

    const [formTitleSize, setFormTitleSize] = useState(30);
    const [formTitleWeight, setFormTitleWeight] = useState(500);
    const [formSubtitleSize, setFormSubtitleSize] = useState(30);
    const [formSubtitleWeight, setFormSubtitleWeight] = useState(500);
    const [formButtonTextSize, setFormButtonTextSize] = useState(30);
    const [formButtonTextWeight, setFormButtonTextWeight] = useState(500);

    const handleFormSliderChange = (sliderSetter) => (value) => {
        sliderSetter(value);
    };
    const handleFormStepedSliderChange = (sliderSetter) => (value) => {
        sliderSetter(value);
    };

    const handleFormInputChange = useCallback((setter) => (newValue) => setter(newValue), []);
    const handleFormToggleChange = (stateSetter) => () => {
        stateSetter((prevState) => !prevState);
    };

    const handleFormColorChange = (colorSetter) => (newColor) => {
        colorSetter(newColor);
    };

    const handleFormDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) => setFormFile(acceptedFiles[0]),
        []
    );


    // const [formSec, setFormSec] = useState(true);

    // const handleFormSectionChange = useCallback((newFormSection) => {
    //   setFormSec(newFormSection);
    // }, []);

    // Define tabs based on the value of formSec
    // const tabs = !formSec
    //   ? [
    //     { id: 'home', content: 'Information', accessibilityLabel: 'All customers', panelID: 'home-customers-content-4', render: <InformationContent /> },
    //     { id: 'Bar', content: 'Bar', panelID: 'products-content-4', render: <BarContent /> },
    //     { id: 'Form', content: 'Form', panelID: 'brands-content-4', render: <FormContent onFormSectionChange={handleFormSectionChange} /> },
    //   ]
    //   : [
    //     { id: 'home', content: 'Information', accessibilityLabel: 'All customers', panelID: 'home-customers-content-4', render: <InformationContent /> },
    //     { id: 'Bar', content: 'Bar', panelID: 'products-content-4', render: <BarContent /> },
    //     { id: 'Form', content: 'Form', panelID: 'brands-content-4', render: <FormContent onFormSectionChange={handleFormSectionChange} /> },
    //     { id: 'Success', content: 'Success', panelID: 'model-content-4', render: <SuccessContent /> },
    //   ];


    //sucess conetnt

    const [successFormTitle, setSuccessFormTitle] = useState('');
    const [successFormButtonText, setSuccessFormButtonText] = useState('');
    const [successFormMiddleText, setSuccessFormMiddleText] = useState('');
    const [successFormBtnLink, setSuccessFormBtnLink] = useState('');
    const [successFormTitleColor, setSuccessFormTitleColor] = useState('#ffff');
    const [successFormButtonTextColor, setSuccessFormButtonTextColor] = useState('#ffff');
    const [successFormBackgroundColor, setSuccessFormBackgroundColor] = useState('#004aad');
    const [successFormMiddleTextColor, setSuccessFormMiddleTextColor] = useState('#ffff');
    const [successFormShowBtn, setSuccessFormShowBtn] = useState(true);


    const [barInfo, setBarInfo] = useState();
    const handleChildData = useCallback((data) => {
        // console.log("data is ==== ", data)
        setBarInfo(data)
    }, [])

    const tabs = [
        {
            id: 'home', content: 'Information', accessibilityLabel: 'All customers', panelID: 'home-customers-content-4', render:
                <Information
                    barName={barName}
                    setBarName={setBarName}
                    typeIds={typeIds}
                    setTypeIds={setTypeIds}
                    selectedRadioValue={selectedRadioValue}
                    setSelectedRadioValue={setSelectedRadioValue}
                    selectedCollections={selectedCollections}
                    setSelectedCollections={setSelectedCollections}
                    selectedPages={selectedPages}
                    setSelectedPages={setSelectedPages}
                    selectedBlogs={selectedBlogs}
                    setSelectedBlogs={setSelectedBlogs}
                    selectedProducts={selectedProducts}
                    setSelectedProducts={setSelectedProducts}
                    selectedProductsIDs={selectedProductsIDs}
                    setSelectedProductsIDs={setSelectedProductsIDs}
                    selectedPagesIDs={selectedPagesIDs}
                    setSelectedPagesIDs={setSelectedPagesIDs}
                    selectedBlogsIDs={selectedBlogsIDs}
                    setSelectedBlogsIDs={setSelectedBlogsIDs}
                    selectedCollectionsIDs={selectedCollectionsIDs}
                    setSelectedCollectionsIDs={setSelectedCollectionsIDs}
                />
        },
        {
            id: 'Bar', content: 'Bar', panelID: 'products-content-4', render:
                <BarContent
                    title={title}
                    scroll={scroll}
                    btnText={btnText}
                    btnLink={btnLink}
                    showBtn={showBtn}
                    titleColor={titleColor}
                    barColor={barColor}
                    btnColor={btnColor}
                    btnTextColor={btnTextColor}
                    closeBtnColor={closeBtnColor}
                    titleSize={titleSize}
                    titleWeight={titleWeight}
                    buttonTextSize={buttonTextSize}
                    buttonTextWeight={buttonTextWeight}
                    activeView={activeView}
                    handleColorChange={handleColorChange}
                    handleSliderChange={handleSliderChange}
                    handleStepedSliderChange={handleStepedSliderChange}
                    handleInputChange={handleInputChange}
                    handleToggleChange={handleToggleChange}
                    setTitleColor={setTitleColor}
                    setBarColor={setBarColor}
                    setBtnColor={setBtnColor}
                    setBtnTextColor={setBtnTextColor}
                    setCloseBtnColor={setCloseBtnColor}
                    setTitleSize={setTitleSize}
                    setTitleWeight={setTitleWeight}
                    setButtonTextSize={setButtonTextSize}
                    setButtonTextWeight={setButtonTextWeight}
                    setActiveView={setActiveView}
                    setTitle={setTitle}
                    setScroll={setScroll}
                    setBtnText={setBtnText}
                    setBtnLink={setBtnLink}
                    setShowBtn={setShowBtn}
                />
        },
        {
            id: 'Form', content: 'Form', panelID: 'brands-content-4', render:
                <FormContent
                    // onFormSectionChange={handleFormSectionChange}
                    formTitle={formTitle}
                    setFormTitle={setFormTitle}
                    formSubtitle={formSubtitle}
                    setFormSubtitle={setFormSubtitle}
                    formPrimaryBtnText={formPrimaryBtnText}
                    setFormPrimaryBtnText={setFormPrimaryBtnText}
                    formPrimaryBtnLink={formPrimaryBtnLink}
                    setFormPrimaryBtnLink={setFormPrimaryBtnLink}
                    formSecondaryBtnText={formSecondaryBtnText}
                    setFormSecondaryBtnText={setFormSecondaryBtnText}
                    formSecondaryBtnLink={formSecondaryBtnLink}
                    setFormSecondaryBtnLink={setFormSecondaryBtnLink}
                    formWarningText={formWarningText}
                    setFormWarningText={setFormWarningText}
                    formFile={formFile}
                    setFormFile={setFormFile}
                    formSection={formSection}
                    setFormSection={setFormSection}
                    formName={formName}
                    setFormName={setFormName}
                    formEmail={formEmail}
                    setFormEmail={setFormEmail}
                    formPhone={formPhone}
                    setFormPhone={setFormPhone}
                    formTitleColor={formTitleColor}
                    setFormTitleColor={setFormTitleColor}
                    formSubtitleColor={formSubtitleColor}
                    setFormSubtitleColor={setFormSubtitleColor}
                    formBtnColor={formBtnColor}
                    setFormBtnColor={setFormBtnColor}
                    formBtnTextColor={formBtnTextColor}
                    setFormBtnTextColor={setFormBtnTextColor}
                    formRejectTextColor={formRejectTextColor}
                    setFormRejectTextColor={setFormRejectTextColor}
                    formBgColor={formBgColor}
                    setFormBgColor={setFormBgColor}
                    formCloseBtnColor={formCloseBtnColor}
                    setFormCloseBtnColor={setFormCloseBtnColor}
                    formTitleSize={formTitleSize}
                    setFormTitleSize={setFormTitleSize}
                    formTitleWeight={formTitleWeight}
                    setFormTitleWeight={setFormTitleWeight}
                    formSubtitleSize={formSubtitleSize}
                    setFormSubtitleSize={setFormSubtitleSize}
                    formSubtitleWeight={formSubtitleWeight}
                    setFormSubtitleWeight={setFormSubtitleWeight}
                    formButtonTextSize={formButtonTextSize}
                    setFormButtonTextSize={setFormButtonTextSize}
                    formButtonTextWeight={formButtonTextWeight}
                    setFormButtonTextWeight={setFormButtonTextWeight}
                    formDiscountCode={formDiscountCode}
                    setFormDiscountCode={setFormDiscountCode}
                    formDiscount={formDiscount}
                    setFormDiscount={setFormDiscount}
                    // handleFormSectionChange={handleFormSectionChange}
                    handleFormInputChange={handleFormInputChange}
                    handleFormToggleChange={handleFormToggleChange}
                    handleFormColorChange={handleFormColorChange}
                    handleFormDropZoneDrop={handleFormDropZoneDrop}
                />

        },
        {
            id: 'Success', content: 'Success', panelID: 'model-content-4', render:
                <SuccessContent
                    successFormTitle={successFormTitle}
                    setSuccessFormTitle={setSuccessFormTitle}
                    successFormButtonText={successFormButtonText}
                    setSuccessFormButtonText={setSuccessFormButtonText}
                    successFormMiddleText={successFormMiddleText}
                    setSuccessFormMiddleText={setSuccessFormMiddleText}
                    successFormBtnLink={successFormBtnLink}
                    setSuccessFormBtnLink={setSuccessFormBtnLink}
                    successFormTitleColor={successFormTitleColor}
                    setSuccessFormTitleColor={setSuccessFormTitleColor}
                    successFormButtonTextColor={successFormButtonTextColor}
                    setSuccessFormButtonTextColor={setSuccessFormButtonTextColor}
                    successFormBackgroundColor={successFormBackgroundColor}
                    setSuccessFormBackgroundColor={setSuccessFormBackgroundColor}
                    successFormMiddleTextColor={successFormMiddleTextColor}
                    setSuccessFormMiddleTextColor={setSuccessFormMiddleTextColor}
                    successFormShowBtn={successFormShowBtn}
                    setSuccessFormShowBtn={setSuccessFormShowBtn}
                />
        },
    ]
    const handleTabChange = useCallback((selectedTabIndex) => setSelected(selectedTabIndex), []);

    const handleNextButtonClick = useCallback(() => {
        const nextTab = selected + 1;
        if (nextTab < tabs.length) {
            setSelected(nextTab);
        }
        else if (nextTab === tabs.length) {
            handleUpdateBar();
        }
    }, [selected, tabs]);

    const isLastTab = selected === tabs.length - 1;
    const buttonText = isLastTab ? 'Update' : 'Next';


    const handleUpdateBar = async () => {
        const data = {
            bar_name: barName,
            type: selectedRadioValue,
            type_ids: typeIds.toString(),
            bar_title: title,
            bar_title_color: titleColor,
            bar_color: barColor,
            bar_scroll: scroll,
            bar_button_enabled: showBtn ? "1" : "0",
            bar_button_text: btnText,
            bar_button_color: btnColor,
            bar_button_text_color: btnTextColor,
            bar_close_button_color: closeBtnColor,
            bar_title_text_size: titleSize,
            bar_title_text_weight: titleWeight,
            bar_button_text_size: buttonTextSize,
            bar_button_text_weight: buttonTextWeight,
            form_name_enabled: formName ? "1" : "0",
            form_email_enabled: formPhone ? "1" : "0",
            form_phone_enabled: formEmail ? "1" : "0",
            discount_code: formDiscountCode,
            discount: formDiscount,
            form_title: formTitle,
            form_sub_title: formSubtitle,
            form_primary_button_text: formPrimaryBtnText,
            form_primary_button_link: formPrimaryBtnLink,
            form_secondary_button_text: formSecondaryBtnText,
            form_secondary_button_link: formSecondaryBtnLink,
            form_warning_text: formWarningText,
            form_title_color: formTitleColor,
            form_sub_title_color: formSubtitleColor,
            form_primary_button_color: formBtnColor,
            form_primary_button_text_color: formBtnTextColor,
            form_secondary_button_color: "#6C063C",
            form_secondary_button_text_color: "#066C10",
            form_background_color: formBgColor,
            form_close_button_color: formCloseBtnColor,
            form_title_size: formTitleSize,
            form_title_weight: formTitleWeight,
            form_sub_title_size: formSubtitleSize,
            form_sub_title_weight: formSubtitleWeight,
            form_button_text_size: formButtonTextSize,
            form_button_text_weight: formButtonTextWeight,
            success_form_title: successFormTitle,
            success_form_middle_title: successFormMiddleText,
            success_form_button_enabled: successFormShowBtn ? "1" : "0",
            success_form_button_text: successFormButtonText,
            success_form_button_link: successFormBtnLink,
            success_form_title_color: successFormTitleColor,
            success_form_button_text_color: successFormButtonTextColor,
            success_form_background_color: successFormBackgroundColor,
            success_form_middle_title_color: successFormMiddleTextColor,
            id: params.id,
        }

        const responce = await callApi(`update-data`, "POST", data);
        console.log(responce)
        navigate('/');
    }

    const SetAllStates = (data) => {
        // console.log("data is == ", data)
        setBarName(data?.bar_name);
        setTypeIds(data?.type_ids);
        setTitle(data?.bar_title);
        setTitleColor(data?.bar_title_color);
        setBarColor(data?.bar_color);
        setScroll(data?.bar_scroll);
        setShowBtn(data?.bar_button_enabled === 1);
        setBtnText(data?.bar_button_text);
        setBtnColor(data?.bar_button_color);
        setBtnTextColor(data?.bar_button_text_color);
        setCloseBtnColor(data?.bar_close_button_color);
        setTitleSize(data?.bar_title_text_size);
        setTitleWeight(data?.bar_title_text_weight);
        setButtonTextSize(data?.bar_button_text_size);
        setButtonTextWeight(data?.bar_button_text_weight);

        setFormName((data?.bar_form.form_name_enabled) == "1");
        setFormPhone((data?.bar_form.form_phone_enabled) == "1");
        setFormEmail((data?.bar_form.form_email_enabled) == "1");
        setFormDiscountCode(data?.discount_code);
        setFormDiscount(data?.discount);
        setFormFile(data?.bar_form.form_image);
        setFormTitle(data?.bar_form.form_title);
        setFormSubtitle(data?.bar_form.form_sub_title);
        setFormPrimaryBtnText(data?.bar_form.form_primary_button_text);
        setFormPrimaryBtnLink(data?.bar_form.form_primary_button_link);
        setFormSecondaryBtnText(data?.bar_form.form_secondary_button_text);
        setFormSecondaryBtnLink(data?.bar_form.form_secondary_button_link);
        setFormWarningText(data?.bar_form.form_warning_text);
        setFormTitleColor(data?.bar_form.form_title_color);
        setFormSubtitleColor(data?.bar_form.form_sub_title_color);
        setFormBtnColor(data?.bar_form.form_primary_button_color);
        setFormBtnTextColor(data?.bar_form.form_primary_button_text_color);
        setFormBgColor(data?.bar_form.form_background_color);
        setFormCloseBtnColor(data?.bar_form.form_close_button_color);
        setFormTitleSize(data?.bar_form.form_title_size);
        setFormTitleWeight(data?.bar_form.form_title_weight);
        setFormSubtitleSize(data?.bar_form.form_sub_title_size);
        setFormSubtitleWeight(data?.bar_form.form_sub_title_weight);
        setFormButtonTextSize(data?.bar_form.form_button_text_size);
        setFormButtonTextWeight(data?.bar_form.form_button_text_weight);

        setSuccessFormTitle(data?.bar_success_form.success_form_title);
        setSuccessFormMiddleText(data?.bar_success_form.success_form_middle_title);
        setSuccessFormShowBtn(data?.bar_success_form.success_form_button_enabled === 1);
        setSuccessFormButtonText(data?.bar_success_form.success_form_button_text);
        setSuccessFormBtnLink(data?.bar_success_form.success_form_button_link);
        setSuccessFormTitleColor(data?.bar_success_form.success_form_title_color);
        setSuccessFormButtonTextColor(data?.bar_success_form.success_form_button_text_color);
        setSuccessFormBackgroundColor(data?.bar_success_form.success_form_background_color);
        setSuccessFormMiddleTextColor(data?.bar_success_form.success_form_middle_title_color);
        setSelectedRadioValue(data?.type);

        const arrayIds = data?.type_ids?.split(",").map(Number)
        console.log("array ids  == ", arrayIds)
        if (data?.type == "products") {
            setSelectedProductsIDs(arrayIds);
            console.log("selected products ids === ", selectedProductsIDs)
        } else if (data?.type == "collections") {
            setSelectedCollectionsIDs(arrayIds);
            console.log("selected collections ids === ", selectedCollectionsIDs)
        } else if (data?.type == "pages") {
            setSelectedPagesIDs(arrayIds);
            console.log("selected pages ids === ", selectedPagesIDs)

        } else if (data?.type == "blogs") {
            setSelectedBlogsIDs(arrayIds);
            console.log("selected blogs ids === ", selectedBlogsIDs)
        }

        // getProducts(arrayIds);

        // console.log("form image == ", data?.bar_form.form_image)
    }

    // useEffect(() => {
    //     console.log("selecedt blog ids in effect == ", selectedBlogsIDs)
    // }, [selectedBlogsIDs])


    // const handleChangeTypeIds = () => {
    //     if (selectedRadioValue == "products") {
    //         const selectedProducts = apiResponse?.filter((item) => selectedProductsIDs.includes(item.id));
    //         console.log("selectedProducts sdsdsdsd", selectedProducts, selectedProductsIDs);
    //         setSelectedProducts(selectedProducts);
    //     } else if (selectedRadioValue == "pages") {
    //         const pages = apiResponse?.filter((item) => selectedPagesIDs.includes(item.id));
    //         setSelectedPages(pages);
    //     } else if (selectedRadioValue == "collections") {
    //         const collections = apiResponse?.filter((item) => selectedCollectionsIDs.includes(item.id));
    //         console.log("collections", collections, apiResponse);
    //         setSelectedCollections(collections);
    //     } else if (selectedRadioValue == "blogs") {
    //         const blogs = apiResponse?.filter((item) => selectedBlogsIDs.includes(item.id));
    //         console.log("blogs", blogs, apiResponse, selectedBlogsIDs);
    //         setSelectedBlogs(blogs);
    //     }
    // }

    const handlePageBarView = async () => {
        const responce = await callApi(`page-bar-view?id=${params.id}`, "GET");
        console.log(responce)
        setEditResponse(responce?.data);
        SetAllStates(responce?.data[0]);
    }

    useEffect(() => {
        handlePageBarView();
    }, [])

    return (
        <>
            {
                loading ?
                    <>
                        <SkeltonPageWithTabs />
                    </>
                    : (
                        <Page title="Edit Page Bar" primaryAction={<Button variant="primary" onClick={handleNextButtonClick}>{buttonText}</Button>} secondaryActions={<Button>Save Draft</Button>}
                            backAction={{ content: 'Add Page Bar', url: '', onAction: () => navigate('/') }}
                            fullWidth>
                            <Layout>
                                <Layout.Section>
                                    <Card padding={'0'}>
                                        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted />
                                    </Card>
                                    <div style={{ marginTop: '20px' }}>
                                        {tabs[selected].render}
                                    </div>
                                </Layout.Section>
                            </Layout>
                        </Page>
                    )
            }
        </>

    );
};


export default EditNavigation;
