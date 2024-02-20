
import { useTranslation, Trans } from "react-i18next";

import EditNavigation from "../../components/EditNavigation";
import { Page } from "@shopify/polaris";
export default function EditBar() {

  const { t } = useTranslation();
  return (
    <Page  >
      <EditNavigation />
    </Page>
  );
}
