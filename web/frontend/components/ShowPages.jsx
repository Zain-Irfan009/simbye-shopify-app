import React from 'react';
import {
    Card,
    InlineStack,
    Box,
    RadioButton,
    Text,
    BlockStack,
    SkeletonThumbnail,
    SkeletonDisplayText,
    SkeletonBodyText
} from '@shopify/polaris';

function ShowPages({ selectedValue, handleChange }) {
    const cardData = [
        {
            id: 'homee',
            label: 'Home',
            content: (
                <>
                    <Box padding={4} >
                        <BlockStack align='center' gap="200" >
                            <SkeletonDisplayText size="large" />
                            <SkeletonBodyText />
                        </BlockStack>
                    </Box>
                </>
            ),
        },
        {
            id: 'products',
            label: 'Product',
            content: (
                <>
                    <Box padding={4} >
                        <div className='flex justify-between gap-2'>
                            <SkeletonThumbnail />
                            <div className='flex flex-col w-full gap-4'>
                                <SkeletonDisplayText size="large" />
                                <SkeletonBodyText />
                            </div>
                        </div>
                    </Box>
                </>
            ),
        },
        {
            id: 'collections',
            label: 'Collections',
            content: (
                <>
                    <Box padding={4}>
                        <div className='flex flex-wrap gap-2'>
                            {Array(4).fill(null).map((_, index) => (
                                <SkeletonThumbnail size="small" />
                            ))}
                        </div>
                    </Box>
                </>

            ),
        },
        {
            id: 'blogs',
            label: 'Blog',
            content: (
                <>
                    <Box padding={4} >
                        <BlockStack align='center' gap="400" >
                            <SkeletonDisplayText size="large" />
                            <div className='flex gap-1 '>
                                {Array(3).fill(null).map((_, index) => (
                                    <SkeletonThumbnail size="small" />
                                ))}
                            </div>
                        </BlockStack>
                    </Box>
                </>
            ),
        },
        {
            id: 'pages',
            label: 'Pages',
            content: (
                <>
                    <Box padding={4} >
                        <BlockStack align='center' gap="200" >
                            <SkeletonDisplayText size="large" />
                            <SkeletonBodyText />
                        </BlockStack>
                    </Box>
                </>
            ),
        },
    ];

    return (
        <Card sectioned title="Show on pages">
            <BlockStack gap="400">
                <Text as="h2" variant="headingSm">
                    Show on pages
                </Text>
                <InlineStack align="space-evenly">
                    {cardData.map((card, index) => (
                        <CustomCard
                            key={index}
                            label={card.label}
                            id={card.id}
                            selectedValue={selectedValue}
                            handleChange={handleChange}
                        >
                            {card.content}
                        </CustomCard>
                    ))}
                </InlineStack>
            </BlockStack>
        </Card>
    );
}

function CustomCard({ label, id, selectedValue, handleChange, children }) {
    return (
        <div className="max-w-[150px] min-w-[150px]">
            <Card roundedAbove="sm" padding="0">
                <Box background="bg-surface-brand" padding="100">
                    <RadioButton
                        label={label}
                        id={id}
                        name="accounts"
                        checked={selectedValue == id}
                        onChange={() => handleChange(id)}
                    />
                </Box>
                <BlockStack gap="200">{children}</BlockStack>
            </Card>
        </div>
    );
}

export default ShowPages;
