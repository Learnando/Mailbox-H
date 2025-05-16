import "../styles/VirtualAddress.css";
import { useTranslation } from "react-i18next"; // ✅

interface Props {
  address: string;
}

const VirtualAddress = ({ address }: Props) => {
  const { t } = useTranslation(); // ✅

  return (
    <div className="virtual-address">
      <h2>{t("virtualAddress.label")}</h2>
      <code>{address}</code>
    </div>
  );
};

export default VirtualAddress;
