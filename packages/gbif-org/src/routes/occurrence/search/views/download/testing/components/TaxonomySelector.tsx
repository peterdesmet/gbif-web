import React from 'react';
import { FaGlobe } from 'react-icons/fa';

interface TaxonomySelectorProps {
  value: string;
  onChange: (taxonomy: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function TaxonomySelector({ value, onChange, isExpanded, onToggle }: TaxonomySelectorProps) {
  return (
    <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200">
      <button
        onClick={onToggle}
        className="g-w-full g-p-6 g-text-left g-flex g-items-center g-justify-between hover:g-bg-gray-50 g-transition-colors"
      >
        <div className="g-flex g-items-center g-gap-3">
          <FaGlobe size={20} className="g-text-primary-600" />
          <div>
            <h3 className="g-font-semibold g-text-gray-900">Taxonomic Reference</h3>
            <p className="g-text-sm g-text-gray-600">
              Select the taxonomic backbone for species names
            </p>
          </div>
        </div>
        <div className="g-text-sm g-text-gray-500">{value.toUpperCase()}</div>
      </button>

      {isExpanded && (
        <div className="g-border-t g-border-gray-200 g-p-6">
          <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-3">
            Taxonomic Backbone
          </label>
          <div className="g-space-y-2">
            <label className="g-flex g-items-start g-p-4 g-border g-border-gray-300 g-rounded g-cursor-pointer hover:g-bg-gray-50 g-transition-colors">
              <input
                type="radio"
                name="taxonomy"
                value="gbif"
                checked={value === 'gbif'}
                onChange={(e) => onChange(e.target.value)}
                className="g-mt-1 g-h-4 g-w-4 g-text-primary-600 g-focus:ring-primary-500 g-border-gray-300"
              />
              <div className="g-ml-3">
                <span className="g-font-medium g-text-gray-900">GBIF Backbone Taxonomy</span>
                <p className="g-text-sm g-text-gray-600">Recommended - Most comprehensive</p>
              </div>
            </label>

            <label className="g-flex g-items-start g-p-4 g-border g-border-gray-300 g-rounded g-cursor-pointer hover:g-bg-gray-50 g-transition-colors">
              <input
                type="radio"
                name="taxonomy"
                value="col"
                checked={value === 'col'}
                onChange={(e) => onChange(e.target.value)}
                className="g-mt-1 g-h-4 g-w-4 g-text-primary-600 g-focus:ring-primary-500 g-border-gray-300"
              />
              <div className="g-ml-3">
                <span className="g-font-medium g-text-gray-900">Catalogue of Life</span>
                <p className="g-text-sm g-text-gray-600">International standard reference</p>
              </div>
            </label>

            <label className="g-flex g-items-start g-p-4 g-border g-border-gray-300 g-rounded g-cursor-pointer hover:g-bg-gray-50 g-transition-colors">
              <input
                type="radio"
                name="taxonomy"
                value="itis"
                checked={value === 'itis'}
                onChange={(e) => onChange(e.target.value)}
                className="g-mt-1 g-h-4 g-w-4 g-text-primary-600 g-focus:ring-primary-500 g-border-gray-300"
              />
              <div className="g-ml-3">
                <span className="g-font-medium g-text-gray-900">ITIS</span>
                <p className="g-text-sm g-text-gray-600">
                  Integrated Taxonomic Information System
                </p>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}