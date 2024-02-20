import {
  SkeletonPage,
  Layout,
  Card,
  InlineStack,
  SkeletonBodyText,
  TextContainer,
  SkeletonDisplayText,
  SkeletonTabs,
  SkeletonThumbnail,
  Button,
  BlockStack,
} from "@shopify/polaris";
import React from "react";

export function SkeltonPage() {
  return (
    <SkeletonPage primaryAction >
      <Card>
        <BlockStack gap={500}>
          <Card sectioned>
          </Card>
          <Card sectioned>
          </Card>
          <Card sectioned>
          </Card>
          <Card sectioned>
          </Card>
          <Card sectioned>
          </Card>
          <Card sectioned>
          </Card>
          <Card sectioned>
          </Card>
          <Card sectioned>
          </Card>
        </BlockStack>
      </Card>
    </SkeletonPage>
  );
}

export function SkeltonDashboardPage() {
  return (
    <SkeletonPage primaryAction fullWidth>
      <Card>
        <SkeletonTabs count={4} />
        <Card.Section sectioned>
          <TextContainer>
            <SkeletonBodyText lines={4} />
          </TextContainer>
        </Card.Section>
      </Card>
      {/* <br />
                <br />
                <br />
                <PaymentLoader /> */}
    </SkeletonPage>
  );
}

export function SkeltonPageWithTabs() {
  return (
    <SkeletonPage primaryAction fullWidth>
      <Card sectioned>
        <SkeletonTabs count={5} />

        <Layout>
            <Layout.Section secondary>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText />
              </TextContainer>

              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText />
              </TextContainer>
            </Layout.Section>

            <Layout.Section>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText />
              </TextContainer>

              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText />
              </TextContainer>
            </Layout.Section>
        </Layout>
      </Card>
    </SkeletonPage>
  );
}

export function SkeltonTabsLayoutSecondary() {
  return (
    <div className="SkeltonTabs">
      <Card sectioned>
        <Layout>
          <Layout.Section secondary>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>
          </Layout.Section>

          <Layout.Section>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={6} />
            </TextContainer>
          </Layout.Section>
        </Layout>
      </Card>
    </div>
  );
}

export function SkeltonTabsLayoutFull() {
  return (
    <div className="SkeltonTabs">
      <Card sectioned>
        <Layout>
          <Layout.Section>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={3} />
            </TextContainer>

            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={3} />
            </TextContainer>
          </Layout.Section>
        </Layout>
      </Card>
    </div>
  );
}

export function SkeltonTabsWithThumbnail() {
  return (
    <div className="SkeltonTabs">
      <Card sectioned>
        <Layout>
          <Layout.Section>
            <InlineStack>
              <SkeletonThumbnail size="small" />
              <SkeletonBodyText lines={2} />
            </InlineStack>
          </Layout.Section>
        </Layout>
      </Card>

      <Card sectioned>
        <Layout>
          <Layout.Section>
            <InlineStack>
              <SkeletonThumbnail size="small" />
              <SkeletonBodyText lines={2} />
            </InlineStack>
          </Layout.Section>
        </Layout>
      </Card>
    </div>
  );
}

export function SkeltonPageForTable() {
  return (
    <SkeletonPage primaryAction fullWidth>
      <Card sectioned>
        <SkeletonTabs count={4} />
        <br />
        <Layout>
          <Layout.Section oneThird>
            <TextContainer>
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Layout.Section>

          <Layout.Section oneThird>
            <TextContainer>
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Layout.Section>

          <Layout.Section oneThird>
            <TextContainer>
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Layout.Section>
        </Layout>
      </Card>
    </SkeletonPage>
  );
}

export function SkeltonPageForProductDetail() {
  return (
    <SkeletonPage primaryAction fullWidth>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <TextContainer>
              <SkeletonBodyText />
            </TextContainer>
          </Card>
          <Card sectioned>
            <TextContainer>
              <SkeletonBodyText />
            </TextContainer>
          </Card>
          <Card sectioned>
            <TextContainer>
              <SkeletonBodyText />
            </TextContainer>
          </Card>
        </Layout.Section>

        <Layout.Section secondary>
          <Card>
            <Card.Section>
              <SkeletonBodyText lines={2} />
            </Card.Section>
            <Card.Section>
              <SkeletonBodyText lines={2} />
            </Card.Section>
          </Card>

          <Card subdued>
            <Card.Section>
              <SkeletonBodyText lines={2} />
            </Card.Section>
            <Card.Section>
              <SkeletonBodyText lines={2} />
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
}

export function SkeltonPaymentPage() {
  return (
    // <SkeletonPage primaryAction fullWidth>
    //     <SkeletonTabs />
    <div
      className="Polaris-Page--fullWidth Polaris-SkeletonPage__Page "
      style={{ maxWidth: "none", padding: "0" }}
    >
      <Layout>
        <Layout.Section oneThird>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Card>
        </Layout.Section>

        <Layout.Section oneThird>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Card>
        </Layout.Section>

        <Layout.Section oneThird>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </div>
    // </SkeletonPage>
  );
}

export function SkeltonShippingPage() {
  return (
    <div className="min-w-full">
      <SkeletonPage primaryAction>
        <br />
        <BlockStack gap="300">
          <Card sectioned>
            <TextContainer>
            </TextContainer>
          </Card>
          <Card sectioned>
            <TextContainer>
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Card>
          <Card sectioned>
            <TextContainer>
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Card>
        </BlockStack>
      </SkeletonPage>
    </div>
  );
}
export function BuyButtonSkelton() {
  return (
    <div className="min-w-full">
      <SkeletonPage primaryAction>
        <br />
        <Layout>
          <Layout.Section variant="oneHalf">
            <BlockStack gap="300">
              <Card sectioned>
                <TextContainer>
                  <SkeletonBodyText lines={4} />
                  <SkeletonBodyText lines={4} />
                </TextContainer>
                <TextContainer>
                  <SkeletonBodyText lines={4} />
                  <SkeletonBodyText lines={4} />
                </TextContainer>
                <TextContainer>
                  <SkeletonBodyText lines={4} />
                  <SkeletonBodyText lines={4} />
                </TextContainer>
                <TextContainer>
                  <SkeletonBodyText lines={4} />
                  <SkeletonBodyText lines={4} />
                </TextContainer>
                <TextContainer>
                  <SkeletonBodyText lines={4} />
                  <SkeletonBodyText lines={4} />
                </TextContainer>
                <TextContainer>
                  <SkeletonBodyText lines={4} />
                  <SkeletonBodyText lines={4} />
                </TextContainer>
              </Card>
            </BlockStack>
          </Layout.Section>
          <Layout.Section variant="oneHalf">
            <Card sectioned>
              <TextContainer>
                <SkeletonBodyText lines={2} />
              </TextContainer>
            </Card>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    </div>
  );
}

export function SkeltonPoliciesPage() {
  return (
    <SkeletonPage primaryAction fullWidth>
      <Card sectioned>
        <Layout>
          <Layout.Section oneThird>
            <TextContainer>
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Layout.Section>

          <Layout.Section oneThird>
            <TextContainer>
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Layout.Section>

          <Layout.Section oneThird>
            <TextContainer>
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Layout.Section>
        </Layout>
      </Card>
    </SkeletonPage>
  );
}
