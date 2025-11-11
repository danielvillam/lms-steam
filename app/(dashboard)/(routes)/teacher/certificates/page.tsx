
import { getCertificatesFacets } from "@/actions/get-certificates-facets";
import CertificatesManagerClient from "./_components/certificate-manager-client";


const CertificatesPage = async () => {
  const facets = await getCertificatesFacets();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Certificados</h1>

      <CertificatesManagerClient initialFacets={facets} />
    </div>
  );
};

export default CertificatesPage;
