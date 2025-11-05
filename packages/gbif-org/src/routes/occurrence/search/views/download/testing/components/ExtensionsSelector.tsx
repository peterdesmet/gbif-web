import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FaPuzzlePiece, FaInfoCircle } from 'react-icons/fa';
import ExpandableSection from './ExpandableSection';

interface ExtensionsSelectorProps {
  selectedExtensions: string[];
  onChange: (extensions: string[]) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const AVAILABLE_EXTENSIONS = [
  {
    url: 'http://rs.tdwg.org/ac/terms/Multimedia',
    name: 'Multimedia',
    description:
      'Audubon Core extension for multimedia content including images, audio, video, and other digital media associated with specimens or observations',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/Amplification',
    name: 'Amplification',
    description:
      'GGBN extension for DNA/RNA amplification data including PCR conditions, primers, and amplicon information',
  },
  {
    url: 'http://purl.org/germplasm/germplasmTerm#GermplasmAccession',
    name: 'GermplasmAccession',
    description:
      'Germplasm extension for plant genetic resource accession data including breeding lines, cultivars, and seed bank information',
  },
  {
    url: 'http://purl.org/germplasm/germplasmTerm#MeasurementScore',
    name: 'MeasurementScore',
    description:
      'Germplasm extension for recording measurement scores and evaluation data from field trials and assessments',
  },
  {
    url: 'http://purl.org/germplasm/germplasmTerm#MeasurementTrait',
    name: 'MeasurementTrait',
    description:
      'Germplasm extension for defining measurable traits and characteristics evaluated in germplasm collections',
  },
  {
    url: 'http://purl.org/germplasm/germplasmTerm#MeasurementTrial',
    name: 'MeasurementTrial',
    description:
      'Germplasm extension for trial and experiment metadata where germplasm measurements and evaluations are conducted',
  },
  {
    url: 'http://rs.tdwg.org/dwc/terms/Identification',
    name: 'Identification',
    description:
      'Darwin Core extension for taxonomic identifications, including determiner information, dates, and identification history',
  },
  {
    url: 'http://rs.gbif.org/terms/1.0/Identifier',
    name: 'Identifier',
    description:
      'GBIF extension for alternative identifiers and cross-references to external databases and systems',
  },
  {
    url: 'http://rs.gbif.org/terms/1.0/Image',
    name: 'Image',
    description:
      'GBIF extension specifically for image metadata including licensing, spatial resolution, and technical specifications',
  },
  {
    url: 'http://rs.tdwg.org/dwc/terms/MeasurementOrFact',
    name: 'MeasurementOrFact',
    description:
      'Darwin Core extension for quantitative and qualitative measurements, facts, and characteristics of specimens or observations',
  },
  {
    url: 'http://rs.gbif.org/terms/1.0/Multimedia',
    name: 'Multimedia',
    description:
      'GBIF-specific multimedia extension for digital media files with enhanced metadata and licensing information',
  },
  {
    url: 'http://rs.gbif.org/terms/1.0/Reference',
    name: 'Reference',
    description:
      'GBIF extension for bibliographic references and literature citations associated with specimens or data records',
  },
  {
    url: 'http://rs.tdwg.org/dwc/terms/ResourceRelationship',
    name: 'ResourceRelationship',
    description:
      'Darwin Core extension for expressing relationships between different resources, specimens, or data records',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/Cloning',
    name: 'Cloning',
    description:
      'GGBN extension for molecular cloning procedures and vector information used in genetic research',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/GelImage',
    name: 'GelImage',
    description:
      'GGBN extension for gel electrophoresis images and associated metadata from molecular biology procedures',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/Loan',
    name: 'Loan',
    description:
      'GGBN extension for tracking specimen and sample loans between institutions including terms and conditions',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/MaterialSample',
    name: 'MaterialSample',
    description:
      'GGBN extension for physical material samples including tissue samples, DNA extracts, and other derived materials',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/Permit',
    name: 'Permit',
    description:
      'GGBN extension for permits and legal authorizations required for specimen collection, export, and research activities',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/Preparation',
    name: 'Preparation',
    description:
      'GGBN extension for specimen preparation methods and protocols used in processing biological samples',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/Preservation',
    name: 'Preservation',
    description:
      'GGBN extension for preservation methods, storage conditions, and long-term maintenance of biological samples',
  },
  {
    url: 'http://rs.iobis.org/obis/terms/ExtendedMeasurementOrFact',
    name: 'ExtendedMeasurementOrFact',
    description:
      'OBIS extension for enhanced marine and aquatic measurements including environmental parameters and species-specific data',
  },
  {
    url: 'http://rs.tdwg.org/chrono/terms/ChronometricAge',
    name: 'ChronometricAge',
    description:
      'Chronometric Age extension for absolute age determinations using radiometric and other dating methods',
  },
  {
    url: 'http://rs.gbif.org/terms/1.0/DNADerivedData',
    name: 'DNADerivedData',
    description:
      'GBIF extension for DNA sequence data, genomic information, and molecular data derived from specimens',
  },
];

export default function ExtensionsSelector({
  selectedExtensions,
  onChange,
  isExpanded,
  onToggle,
}: ExtensionsSelectorProps) {
  const toggleExtension = (extensionUrl: string) => {
    const newExtensions = selectedExtensions.includes(extensionUrl)
      ? selectedExtensions.filter((url) => url !== extensionUrl)
      : [...selectedExtensions, extensionUrl];
    onChange(newExtensions);
  };

  return (
    <ExpandableSection
      icon={<FaPuzzlePiece size={20} className="g-text-primary-600" />}
      title="Extensions"
      description="Select additional data extensions to include"
      summary={`${selectedExtensions.length} selected`}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="g-mb-4 g-bg-blue-50 g-border g-border-blue-200 g-rounded g-p-4">
        <div className="g-flex g-items-start g-gap-3">
          <FaInfoCircle size={16} className="g-text-blue-600 g-mt-0.5 g-flex-shrink-0" />
          <p className="g-text-sm g-text-blue-800">
            Extensions provide additional data fields beyond the core occurrence data. Only select
            extensions that are relevant to your research needs.
          </p>
        </div>
      </div>

      <div className="g-flex g-gap-2 g-mb-4">
        <Button
          size="sm"
          onClick={() => onChange(AVAILABLE_EXTENSIONS.map((ext) => ext.url))}
          variant="default"
          type="button"
        >
          Select All
        </Button>
        <Button size="sm" variant="primaryOutline" onClick={() => onChange([])} type="button">
          Deselect All
        </Button>
      </div>

      <div className="g-grid g-gap-3">
        {AVAILABLE_EXTENSIONS.map((extension) => (
          <label
            key={extension.url}
            className="g-bg-white g-flex g-items-start g-p-4 g-rounded g-border g-border-gray-200 g-cursor-pointer"
          >
            <Checkbox
              checked={selectedExtensions.includes(extension.url)}
              onCheckedChange={() => toggleExtension(extension.url)}
              className="g-mt-1"
            />
            <div className="g-ml-3 g-flex-1">
              <span className="g-font-medium g-text-gray-900 g-text-sm">{extension.name}</span>
              <p className="g-text-xs g-text-gray-500 g-break-all g-mt-0.5">
                {extension.description}
              </p>
            </div>
          </label>
        ))}
      </div>
    </ExpandableSection>
  );
}
