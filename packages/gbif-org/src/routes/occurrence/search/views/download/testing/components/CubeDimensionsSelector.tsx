import React from 'react';
import { FaThLarge, FaInfoCircle } from 'react-icons/fa';

interface CubeDimensionsSelectorProps {
  dimensions: {
    spatialResolution: string;
    temporalResolution: string;
    taxonomicLevel: string;
  };
  onChange: (dimensions: any) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function CubeDimensionsSelector({ dimensions, onChange, isExpanded, onToggle }: CubeDimensionsSelectorProps) {
  const handleDimensionChange = (key: string, value: string) => {
    onChange({
      ...dimensions,
      [key]: value,
    });
  };

  return (
    <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200">
      <button
        onClick={onToggle}
        className="g-w-full g-p-6 g-text-left g-flex g-items-center g-justify-between hover:g-bg-gray-50 g-transition-colors"
      >
        <div className="g-flex g-items-center g-gap-3">
          <FaThLarge size={20} className="g-text-primary-600" />
          <div>
            <h3 className="g-font-semibold g-text-gray-900">Cube Dimensions</h3>
            <p className="g-text-sm g-text-gray-600">
              Configure spatial, temporal, and taxonomic resolution
            </p>
          </div>
        </div>
        <div className="g-text-sm g-text-gray-500">
          {dimensions.spatialResolution} × {dimensions.temporalResolution} × {dimensions.taxonomicLevel}
        </div>
      </button>

      {isExpanded && (
        <div className="g-border-t g-border-gray-200 g-p-6">
          <div className="g-mb-4 g-bg-blue-50 g-border g-border-blue-200 g-rounded g-p-4">
            <div className="g-flex g-items-start g-gap-3">
              <FaInfoCircle
                size={16}
                className="g-text-blue-600 g-mt-0.5 g-flex-shrink-0"
              />
              <p className="g-text-sm g-text-blue-800">
                Cube data aggregates occurrence records across three dimensions. Higher resolution
                provides more detail but results in larger file sizes and longer processing times.
              </p>
            </div>
          </div>

          <div className="g-space-y-6">
            {/* Spatial Resolution */}
            <div>
              <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-3">
                Spatial Resolution
              </label>
              <div className="g-space-y-2">
                {[
                  { value: '10deg', label: '10° Grid (~1,100 km)', description: 'Continental scale analysis' },
                  { value: '1deg', label: '1° Grid (~111 km)', description: 'Regional scale analysis' },
                  { value: '0.5deg', label: '0.5° Grid (~55 km)', description: 'Sub-regional analysis' },
                  { value: '0.1deg', label: '0.1° Grid (~11 km)', description: 'Local scale analysis (recommended)' },
                  { value: '0.01deg', label: '0.01° Grid (~1 km)', description: 'Fine-scale analysis (large files)' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="g-flex g-items-start g-p-3 g-border g-border-gray-300 g-rounded g-cursor-pointer hover:g-bg-gray-50 g-transition-colors"
                  >
                    <input
                      type="radio"
                      name="spatialResolution"
                      value={option.value}
                      checked={dimensions.spatialResolution === option.value}
                      onChange={(e) => handleDimensionChange('spatialResolution', e.target.value)}
                      className="g-mt-1 g-h-4 g-w-4 g-text-primary-600 g-focus:ring-primary-500 g-border-gray-300"
                    />
                    <div className="g-ml-3">
                      <span className="g-font-medium g-text-gray-900">{option.label}</span>
                      <p className="g-text-sm g-text-gray-600">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Temporal Resolution */}
            <div>
              <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-3">
                Temporal Resolution
              </label>
              <div className="g-space-y-2">
                {[
                  { value: 'decade', label: 'Decade', description: 'Long-term trends and patterns' },
                  { value: 'year', label: 'Year', description: 'Annual patterns (recommended)' },
                  { value: 'month', label: 'Month', description: 'Seasonal patterns (large files)' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="g-flex g-items-start g-p-3 g-border g-border-gray-300 g-rounded g-cursor-pointer hover:g-bg-gray-50 g-transition-colors"
                  >
                    <input
                      type="radio"
                      name="temporalResolution"
                      value={option.value}
                      checked={dimensions.temporalResolution === option.value}
                      onChange={(e) => handleDimensionChange('temporalResolution', e.target.value)}
                      className="g-mt-1 g-h-4 g-w-4 g-text-primary-600 g-focus:ring-primary-500 g-border-gray-300"
                    />
                    <div className="g-ml-3">
                      <span className="g-font-medium g-text-gray-900">{option.label}</span>
                      <p className="g-text-sm g-text-gray-600">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Taxonomic Level */}
            <div>
              <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-3">
                Taxonomic Level
              </label>
              <div className="g-space-y-2">
                {[
                  { value: 'kingdom', label: 'Kingdom', description: 'Broadest taxonomic level' },
                  { value: 'phylum', label: 'Phylum', description: 'Major taxonomic groups' },
                  { value: 'class', label: 'Class', description: 'Taxonomic class level' },
                  { value: 'order', label: 'Order', description: 'Taxonomic order level' },
                  { value: 'family', label: 'Family', description: 'Family-level aggregation' },
                  { value: 'genus', label: 'Genus', description: 'Genus-level aggregation' },
                  { value: 'species', label: 'Species', description: 'Species-level detail (recommended)' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="g-flex g-items-start g-p-3 g-border g-border-gray-300 g-rounded g-cursor-pointer hover:g-bg-gray-50 g-transition-colors"
                  >
                    <input
                      type="radio"
                      name="taxonomicLevel"
                      value={option.value}
                      checked={dimensions.taxonomicLevel === option.value}
                      onChange={(e) => handleDimensionChange('taxonomicLevel', e.target.value)}
                      className="g-mt-1 g-h-4 g-w-4 g-text-primary-600 g-focus:ring-primary-500 g-border-gray-300"
                    />
                    <div className="g-ml-3">
                      <span className="g-font-medium g-text-gray-900">{option.label}</span>
                      <p className="g-text-sm g-text-gray-600">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}