import {
  MdCheck as Check2,
  MdDownload as Download,
  MdFileDownload as FileText,
  MdArchive as Archive,
  MdList as List,
  MdGridOn as Grid,
} from 'react-icons/md';

import { LuCheckCheck as Check } from 'react-icons/lu';
import { Button } from '@/components/ui/button';

const formatCards = [
  {
    title: 'SIMPLE',
    description: 'Basic occurrence data with interpreted fields only',
    icon: FileText,
    popular: true,
    features: [
      'Interpreted data only',
      'Tab-delimited CSV format',
      'Excel compatible',
      'Coordinates included',
      'Smallest file size',
      'Quick processing',
    ],
    rawData: false,
    interpretedData: true,
    multimedia: false,
    coordinates: true,
    estimatedSize: '2 TB (417 GB zipped)',
  },
  {
    title: 'SPECIES LIST',
    description: 'Taxonomic checklist with occurrence counts',
    icon: List,
    popular: false,
    features: [
      'Interpreted data only',
      'Species-level aggregation',
      'Tab-delimited CSV format',
      'Excel compatible',
      'Occurrence counts',
      'No coordinates',
    ],
    rawData: false,
    interpretedData: true,
    multimedia: false,
    coordinates: false,
    estimatedSize: 'Variable',
  },
  {
    title: 'DARWIN CORE ARCHIVE',
    hasNextStep: true,
    description: 'Complete biodiversity data package with all available information',
    icon: Archive,
    popular: false,
    features: [
      'Raw and interpreted data',
      'Multimedia links included',
      'Darwin Core standard',
      'Extensible format',
      'Coordinates included',
      'Full data preservation',
      'Customizable extensions',
    ],
    rawData: true,
    interpretedData: true,
    multimedia: true,
    coordinates: true,
    estimatedSize: '6 TB (1 TB zipped)',
  },
  {
    title: 'CUBE DATA',
    hasNextStep: true,
    description: 'Gridded occurrence counts by taxonomic, spatial and temporal dimensions',
    icon: Grid,
    popular: false,
    features: [
      'Aggregated counts per grid cell',
      'Taxonomic dimension breakdown',
      'Spatial grid aggregation',
      'Temporal grid aggregation',
      'Tab-delimited CSV format',
      'Excel compatible',
      'Customizable grid resolution',
      'Statistical summaries included',
    ],
    rawData: false,
    interpretedData: true,
    multimedia: false,
    coordinates: true,
    estimatedSize: 'Variable (highly compressed)',
  },
];

function DownloadGbifOrg() {
  return (
    <div className="g-min-h-screen g-bg-gradient-to-br g-from-slate-50 g-to-slate-100 g-py-12 g-px-4">
      <div className="g-max-w-7xl g-mx-auto">
        <div className="g-text-center g-mb-12">
          {/* <h1 className="g-text-4xl g-font-bold g-text-gray-900 g-mb-4">GBIF Download Options</h1> */}
          <p className="g-text-lg g-text-gray-600 g-max-w-3xl g-mx-auto">
            Choose the format that best suits your research needs. Each option provides different
            levels of data completeness and processing.
          </p>
        </div>

        <div className="g-grid lg:g-grid-cols-2 xl:g-grid-cols-4 g-gap-8 g-max-w-7xl g-mx-auto">
          {formatCards.map((format) => {
            return (
              <div
                key={format.title}
                className={`g-flex g-flex-col g-relative g-bg-white g-rounded g-shadow-lg g-border-2 g-transition-all g-duration-300 hover:g-shadow-2xl ${
                  format.popular
                    ? 'g-border-primary-500 g-ring-4 g-ring-primary-100'
                    : 'g-border-gray-200 hover:g-border-primary-300'
                }`}
              >
                {format.popular && (
                  <div className="g-absolute g--top-4 g-left-1/2 g-transform g--translate-x-1/2">
                    <span className="g-bg-gradient-to-r g-from-primary-500 g-to-primary-600 g-text-white g-px-4 g-py-2 g-rounded-full g-text-sm g-font-semibold g-shadow-lg">
                      Most used
                    </span>
                  </div>
                )}

                <div className="g-p-8 g-flex-auto">
                  <div className="g-text-center g-mb-6">
                    {/* <div
                      className={`g-inline-flex g-p-3 g-rounded-full g-mb-4 ${
                        format.popular
                          ? 'g-bg-primary-100 g-text-primary-600'
                          : 'g-bg-gray-100 g-text-gray-600'
                      }`}
                    >
                      <IconComponent size={32} />
                    </div> */}
                    <h3 className="g-text-2xl g-font-bold g-text-gray-900 g-mb-2 g-min-h-16">
                      {format.title}
                    </h3>
                    <p className="g-text-gray-600 g-text-sm g-leading-relaxed">
                      {format.description}
                    </p>
                  </div>

                  {/* Data type indicators */}
                  <div className="g-mb-6">
                    <div className="g-grid g-grid-cols-2 g-gap-2 g-text-xs g-mb-3">
                      <div className="g-flex g-items-center g-gap-1">
                        <span
                          className={`g-w-2 g-h-2 g-rounded-full ${
                            format.rawData ? 'g-bg-primary-500' : 'g-bg-gray-300'
                          }`}
                        ></span>
                        <span className="g-text-gray-600">Raw data</span>
                      </div>
                      <div className="g-flex g-items-center g-gap-1">
                        <span
                          className={`g-w-2 g-h-2 g-rounded-full ${
                            format.interpretedData ? 'g-bg-primary-500' : 'g-bg-gray-300'
                          }`}
                        ></span>
                        <span className="g-text-gray-600">Interpreted</span>
                      </div>
                      <div className="g-flex g-items-center g-gap-1">
                        <span
                          className={`g-w-2 g-h-2 g-rounded-full ${
                            format.multimedia ? 'g-bg-primary-500' : 'g-bg-gray-300'
                          }`}
                        ></span>
                        <span className="g-text-gray-600">Multimedia</span>
                      </div>
                      <div className="g-flex g-items-center g-gap-1">
                        <span
                          className={`g-w-2 g-h-2 g-rounded-full ${
                            format.coordinates ? 'g-bg-primary-500' : 'g-bg-gray-300'
                          }`}
                        ></span>
                        <span className="g-text-gray-600">Coordinates</span>
                      </div>
                    </div>
                    <div className="g-text-xs g-text-gray-500">
                      Est. size: {format.estimatedSize}
                    </div>
                  </div>

                  {/* <button
                    className={`g-w-full g-py-3 g-px-6 g-rounded-xl g-font-semibold g-transition-all g-duration-200 g-flex g-items-center g-justify-center g-gap-2 g-mb-6 ${
                      format.popular
                        ? 'g-bg-gradient-to-r g-from-primary-500 g-to-primary-600 hover:g-from-primary-600 hover:g-to-primary-700 g-text-white g-shadow-lg hover:g-shadow-xl'
                        : 'g-bg-gray-900 hover:g-bg-gray-800 g-text-white'
                    }`}
                  >
                    <Download size={20} />
                    {format.hasNextStep ? 'Next' : 'Download'}
                  </button> */}

                  <div className="g-space-y-3">
                    <h4 className="g-font-semibold g-text-gray-900 g-text-sm g-uppercase g-tracking-wide">
                      Features:
                    </h4>
                    <ul className="g-space-y-2">
                      {format.features.map((feature, index) => (
                        <li key={index} className="g-flex g-items-start g-gap-3">
                          <span className="g-text-gray-700 g-text-sm g-leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="g-flex-1"></div>
                <div className="g-px-8">
                  {/* <Button
                    className={`g-w-full g-py-3 g-px-6 g-rounded-xl g-font-semibold g-transition-all g-duration-200 g-flex g-items-center g-justify-center g-gap-2 g-mb-6 ${
                      format.popular
                        ? 'g-bg-gradient-to-r g-from-primary-500 g-to-primary-600 hover:g-from-primary-600 hover:g-to-primary-700 g-text-white g-shadow-lg hover:g-shadow-xl'
                        : 'g-bg-gray-900 hover:g-bg-gray-800 g-text-white'
                    }`}
                  > */}
                  <Button
                    variant={format.popular ? 'default' : 'outline'}
                    className="g-w-full g-mb-6"
                  >
                    {/* <Download size={20} /> */}
                    {format.hasNextStep ? 'Continue' : 'Download'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="g-text-center g-mt-12">
          <p className="g-text-gray-600 g-text-sm g-max-w-4xl g-mx-auto">
            All downloads are provided in tab-delimited CSV format for compatibility with Excel and
            other analysis tools. Darwin Core Archive format follows international biodiversity data
            standards and allows for extension selection in the next step.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DownloadGbifOrg;
