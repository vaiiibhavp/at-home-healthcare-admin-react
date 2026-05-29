import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Service } from './FormTypes';

interface FormStructureViewerProps {
  selectedService: Service | null;
  onMapService: () => void;
}

// CNO (Home Oral Nutrition Supplement) Form Component
const CNOForm: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-5xl mx-auto space-y-6 bg-white">
      {/* Form Header */}
      <div className="text-center border-b-2 border-slate-300 pb-4">
        <h1 className="text-lg font-bold text-slate-800">{t('forms.cnoFormTitle')}</h1>
      </div>
      
      {/* Patient Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.patient')}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.lastName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.firstName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.dateOfBirth')}</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.weight')}</label>
            <input type="number" className="w-24 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="block">{t('forms.socialInsuranceNumber')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.careRelatedALD')}</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Prescriber Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.prescriberIdentification')}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.lastNameAuto')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">{t('forms.firstNameAuto')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">{t('forms.phoneAuto')}</label>
            <input type="tel" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">{t('forms.rppsIdAuto')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">{t('forms.sharedDirectory')}</p>
      </div>
      
      {/* Practice/Facility Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.prescriberPractice')}</h3>
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.hospitalName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.addressLabel')}</label>
            <textarea className="w-full h-20 border border-slate-300 rounded mt-1 px-3 text-sm resize-none" />
          </div>
          <div>
            <label className="block">{t('forms.geographicFiness')}</label>
            <input type="text" className="w-32 h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
      </div>
      
      {/* Prescription Details */}
      <div className="space-y-4">
        <div className="text-sm">
          <p>{t('forms.doneAt')} 
            <input type="text" className="w-32 h-9 border border-slate-300 rounded mx-2 px-3 text-sm" />
            {t('forms.on')} 
            <div className="flex items-center gap-1 mx-2">
              <input type="text" className="w-12 h-9 border border-slate-300 rounded px-3 text-sm" />
              <span>/</span>
              <input type="text" className="w-12 h-9 border border-slate-300 rounded px-3 text-sm" />
              <span>/</span>
              <input type="text" className="w-12 h-9 border border-slate-300 rounded px-3 text-sm" />
            </div>
          </p>
        </div>
        
        <div className="flex gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>{t('forms.prescriptionOutsideALD')}</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>{t('forms.prescriptionOutsideALD')}</span>
          </label>
        </div>
        
        <div className="text-sm space-y-3">
          <p>{t('forms.healthStatusOf')} 
            <input type="text" className="w-32 h-9 border border-slate-300 rounded mx-2 px-3 text-sm" />
            {t('forms.aged')} 
            <input type="number" className="w-16 h-9 border border-slate-300 rounded mx-2 px-3 text-sm" />
          </p>
          
          <p>{t('forms.weighing')} 
            <input type="number" className="w-16 h-9 border border-slate-300 rounded mx-2 px-3 text-sm" />
            {t('forms.requiresONS')}
          </p>
        </div>
        
        <div className="border-2 border-slate-300 rounded-lg p-4 space-y-3">
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">{t('forms.diabeticRange')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">{t('forms.standardCarbohydrate')}</span>
            </label>
          </div>
          
          <div className="space-y-2 text-sm">
            {[
              t('forms.onsProduct1'),
              t('forms.onsProduct2'),
              t('forms.onsProduct3'),
              t('forms.onsProduct4'),
              t('forms.onsProduct5'),
              t('forms.onsProduct6'),
              t('forms.onsProduct7'),
              t('forms.onsProduct8'),
              t('forms.onsProduct9')
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="flex-1">{item}</span>
                <input type="text" className="w-24 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>{t('forms.qty')}</span>
                <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>{t('forms.perDay')}</span>
              </div>
            ))}
            
            <div className="flex items-center gap-2">
              <span>{t('forms.otherLabel')}</span>
              <input type="text" className="w-full h-9 border border-slate-300 rounded px-3 text-sm" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.patientNameLabel')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.dateOfBirthLabel')}</label>
            <div className="flex items-center gap-1 mt-1">
              <input type="text" className="w-12 h-9 border border-slate-300 rounded px-3 text-sm" />
              <span>/</span>
              <input type="text" className="w-12 h-9 border border-slate-300 rounded px-3 text-sm" />
              <span>/</span>
              <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
            </div>
          </div>
        </div>
        
        <div className="text-sm">
          <h4 className="font-medium">{t('forms.prescriberIdentificationLabel')}</h4>
        </div>
        
        <div className="text-sm space-y-3">
          <p>{t('forms.toBeConsumed')}</p>
          
          <div>
            <label className="block">{t('forms.texture')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          
          <p>{t('forms.reassessmentAt1Month')}</p>
          
          <p>{t('forms.renewalForMonths')} 
            <input type="number" className="w-16 h-9 border border-slate-300 rounded mx-2 px-3 text-sm" />
            {t('forms.months')}
          </p>
          
          <p>{t('forms.afterReassessment')}</p>
          <div className="ml-4 space-y-1">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.weightCheckbox')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.nutritionalStatus')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.progressionOfPathology')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.levelOfSpontaneousOralIntake')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.toleranceOfONS')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.complianceWithONS')}</span>
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.date')}</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
        </div>
      </div>
      
      {/* Signature Section */}
      <div className="border-t-2 border-slate-300 pt-4 text-center">
        <div className="w-48 h-12 border-b-2 border-slate-400 mx-auto"></div>
        <p className="text-sm font-medium mt-2">{t('forms.sign')}</p>
      </div>
    </div>
  );
};

// Wound Care Form Component
const WoundCareForm: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-5xl mx-auto space-y-6 bg-white">
      {/* Form Header */}
      <div className="text-center border-b-2 border-slate-300 pb-4">
        <h1 className="text-lg font-bold text-slate-800">{t('forms.woundCareFormTitle')}</h1>
      </div>
      
      {/* Physician Information */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.physicianInformation')}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.lastName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.firstName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.rppsNo')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.finess')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
        </div>
      </div>
      
      {/* Patient Information */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.patientInformation')}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.lastName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.firstName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.dateOfBirth')}</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
        </div>
      </div>

      {/* Care Related to ALD */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.careRelatedALDTitle')}</h3>
        <div className="space-y-3 text-sm">
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.careRelatedALD')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.careNotRelatedALD')}</span>
            </label>
          </div>
          <div>
            <label className="block">{t('forms.date')}</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
        </div>
      </div>
      
      {/* Type of Wound */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.typeOfWound')}</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <label className="block">{t('forms.sizeLabel')}</label>
            <input type="text" className="w-32 h-9 border border-slate-300 rounded px-3 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.acute')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.chronic')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.ulcer')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.pressureUlcer')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.postoperativeWound')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.cavityWound')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.woundWithFibrin')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.otherLabel')}</span>
              <input type="text" className="w-32 h-9 border border-slate-300 rounded px-3 text-sm" />
            </label>
          </div>
        </div>
      </div>
      
      {/* Desired Dressing Type */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.desiredDressingType')}</h3>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>{t('forms.hyperabsorbent')}</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>{t('forms.postOp')}</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>{t('forms.debridementHealing')}</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>{t('forms.hydrocolloid')}</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>{t('forms.packingLabel')}</span>
          </label>
          <div className="ml-6 space-y-2">
            <div>{t('forms.fillACavity')}</div>
            <div>{t('forms.occupyDeadSpace')}</div>
            <div>- {t('forms.preventPrematureClosure')}</div>
          </div>
        </div>
      </div>
      
      {/* Additional Wound Assessment */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.additionalWoundAssessment')}</h3>
        <div className="space-y-3 text-sm">
          <div className="space-y-2">
            <label className="block">{t('forms.exudate')}</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>{t('forms.yes')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>{t('forms.no')}</span>
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block">{t('forms.cavity')}</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>{t('forms.yes')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>{t('forms.no')}</span>
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block">{t('forms.septicWound')}</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>{t('forms.yes')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>{t('forms.no')}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Required Materials and Applicable Protocol */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.requiredMaterials')}</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>{t('forms.dressingKits')}</span>
            <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
            <span>{t('forms.perDay')}</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>{t('forms.nylexRetentionBandage')}</span>
            <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
            <span>{t('forms.perDay')}</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>{t('forms.cleaningWith')}</span>
            <input type="text" className="w-48 h-9 border border-slate-300 rounded px-3 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>{t('forms.disinfectionWith')}</span>
            <input type="text" className="w-48 h-9 border border-slate-300 rounded px-3 text-sm" />
          </div>
          <div className="space-y-2 ml-6">
            <div className="flex items-center gap-2">
              <span>{t('forms.firstLayer')}</span>
              <input type="text" className="w-32 h-9 border border-slate-300 rounded px-3 text-sm" />
            </div>
            <div className="flex items-center gap-2">
              <span>{t('forms.secondLayer')}</span>
              <input type="text" className="w-32 h-9 border border-slate-300 rounded px-3 text-sm" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Treatment Duration */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.treatmentDuration')}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>{t('forms.treatmentDurationLabel')}</span>
            <input type="text" className="w-32 h-9 border border-slate-300 rounded px-3 text-sm" />
            <span>{t('forms.or')}</span>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>{t('forms.untilHealed')}</span>
          </label>
        </div>
      </div>
      
      {/* Signature Section */}
      <div className="border-t-2 border-slate-300 pt-4 text-center">
        <div className="w-48 h-12 border-b-2 border-slate-400 mx-auto"></div>
        <p className="text-sm font-medium mt-2">{t('forms.sign')}</p>
      </div>
    </div>
  );
};

// Generic Form Component with Free Text Zone
const GenericForm: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-5xl mx-auto space-y-6 bg-white">
      {/* Form Header */}
      <div className="text-center border-b-2 border-slate-300 pb-4">
        <h1 className="text-lg font-bold text-slate-800">{t('forms.genericFormTitle')}</h1>
        <p className="text-sm text-slate-600 mt-2">{t('forms.tickAppropriateBoxes')}</p>
      </div>
      
      {/* Prescription Type */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{t('forms.prescriptionDate')}</span>
          <input type="date" className="w-40 h-9 border border-slate-300 rounded px-3 text-sm" />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">{t('forms.startOfHomeInfusion')}</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">{t('forms.renewalOrModification')}</span>
          </label>
        </div>
      </div>
      
      {/* Patient Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.patient')}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.lastName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.firstName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.dateOfBirth')}</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.weight')}</label>
            <input type="number" className="w-24 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="block">{t('forms.socialInsuranceNumber')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.careRelatedALD')}</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Prescriber Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.prescriberIdentification')}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.lastNameAuto')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">{t('forms.firstNameAuto')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">{t('forms.phoneAuto')}</label>
            <input type="tel" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">{t('forms.rppsIdAuto')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">{t('forms.sharedDirectory')}</p>
      </div>
      
      {/* Practice/Facility Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.prescriberPractice')}</h3>
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.hospitalName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.addressLabel')}</label>
            <textarea className="w-full h-20 border border-slate-300 rounded mt-1 px-3 text-sm resize-none" />
          </div>
          <div>
            <label className="block">{t('forms.geographicFiness')}</label>
            <input type="text" className="w-32 h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
      </div>
      
      {/* Free Text Zone */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm">{t('forms.formsFor')}</h3>
        
        <div className="border-2 border-slate-300 rounded-lg p-4">
          <h4 className="font-bold text-sm mb-4">{t('forms.freeZoneTexte')}</h4>
          
          <div className="space-y-4">
            <div>
              <textarea 
                className="w-full h-32 border border-slate-300 rounded p-3 text-sm resize-none" 
                placeholder="……………………………………………………………"
              />
            </div>
            <div>
              <textarea 
                className="w-full h-32 border border-slate-300 rounded p-3 text-sm resize-none" 
                placeholder="……………………………………………………………"
              />
            </div>
            <div>
              <textarea 
                className="w-full h-32 border border-slate-300 rounded p-3 text-sm resize-none" 
                placeholder="……………………………………………………………"
              />
            </div>
            <div>
              <textarea 
                className="w-full h-32 border border-slate-300 rounded p-3 text-sm resize-none" 
                placeholder="…………………………………………………………….."
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Signature Section */}
      <div className="border-t-2 border-slate-300 pt-4 text-center">
        <div className="w-48 h-12 border-b-2 border-slate-400 mx-auto"></div>
        <p className="text-sm font-medium mt-2">{t('forms.sign')}</p>
      </div>
    </div>
  );
};

// Artificial Nutrition Form Component
const ArtificialNutritionForm: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-5xl mx-auto space-y-6 bg-white">
      {/* Form Header */}
      <div className="text-center border-b-2 border-slate-300 pb-4">
        <h1 className="text-lg font-bold text-slate-800">{t('forms.artificialNutritionFormTitle')}</h1>
        <p className="text-sm text-slate-600 mt-2">{t('forms.tickAppropriateBoxes')}</p>
      </div>
      
      {/* Prescription Type */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{t('forms.prescriptionDate')}</span>
          <input type="date" className="w-40 h-9 border border-slate-300 rounded px-3 text-sm" />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">{t('forms.startOfHomeInfusion')}</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">{t('forms.renewalOrModification')}</span>
          </label>
        </div>
      </div>
      
      {/* Patient Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.patient')}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.lastName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.firstName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.dateOfBirth')}</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.weight')}</label>
            <input type="number" className="w-24 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="block">{t('forms.socialInsuranceNumber')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.careRelatedALD')}</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Prescriber Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.prescriberIdentification')}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.lastNameAuto')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">{t('forms.firstNameAuto')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">{t('forms.phoneAuto')}</label>
            <input type="tel" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">{t('forms.rppsIdAuto')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">{t('forms.sharedDirectory')}</p>
      </div>
      
      {/* Practice/Facility Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.prescriberPractice')}</h3>
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.hospitalName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.addressLabel')}</label>
            <textarea className="w-full h-20 border border-slate-300 rounded mt-1 px-3 text-sm resize-none" />
          </div>
          <div>
            <label className="block">{t('forms.geographicFiness')}</label>
            <input type="text" className="w-32 h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
      </div>
      
      {/* Artificial Nutrition Specific Section */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm">{t('forms.formsFor')}</h3>
        
        <div className="border-2 border-slate-300 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block">{t('forms.from')}</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>/</span>
                <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>/</span>
                <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
              </div>
            </div>
            <div>
              <label className="block">{t('forms.prescriptionForWeeks')}</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="number" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>{t('forms.weeks')}</span>
                <input type="number" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>{t('forms.times')}</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm">
            <p className="font-medium mb-2">{t('forms.healthConditionOfMR')}</p>
            
            <div className="space-y-3 mt-4">
              <div className="space-y-2">
                <h5 className="font-medium">{t('forms.initialSetupPackage')}</h5>
                <h5 className="font-medium">{t('forms.weeklyEnteralPackage')}</h5>
                <div className="ml-4 space-y-2">
                  <div>- {t('forms.gravityPackage1')}</div>
                  <div>- {t('forms.pumpPackage2')}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block">{t('forms.nasogastricTube')}</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="text" className="w-24 h-9 border border-slate-300 rounded px-3 text-sm" />
                    <span>{t('forms.toBeUsedAtRate')}</span>
                    <input type="text" className="w-24 h-9 border border-slate-300 rounded px-3 text-sm" />
                    <span>{t('forms.perMonth')}</span>
                  </div>
                </div>
                <div>
                  <label className="block">{t('forms.jejunostomyTube')}</label>
                  <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div>{t('forms.rentalIVPole')}</div>
                <div>
                  <label className="block">{t('forms.equipmentAdultNG')}</label>
                  <input type="number" className="w-20 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
                </div>
                <div>{t('forms.equipmentGastrostomy')}</div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4 space-y-3">
            <div>
              <h5 className="font-medium text-sm">{t('forms.prescriptionsUnrelatedALD')}</h5>
              <textarea className="w-full h-20 border border-slate-300 rounded p-3 text-sm resize-none mt-2" />
            </div>
            
            <div>
              <h5 className="font-medium text-sm">{t('forms.prescriptionsRelatedALD')}</h5>
              <textarea className="w-full h-20 border border-slate-300 rounded p-3 text-sm resize-none mt-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block">{t('forms.jejunostomyCareEveryDays')}</label>
                <input type="number" className="w-20 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
              </div>
              <div>
                <div>- {t('forms.equipmentInCaseOfGastrostomyTubeReplacement')}</div>
              </div>
            </div>

            <div>
              <div>- {t('forms.oneGastrostomyButtonExtensionSet')}</div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h5 className="font-medium text-sm mb-3">{t('forms.nutrients')}</h5>
            <div className="space-y-2">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center gap-2">
                  <span>{num})</span>
                  <input type="text" className="flex-1 h-9 border border-slate-300 rounded px-3 text-sm" placeholder={t('forms.nutrientName')} />
                  <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" placeholder={t('forms.ml')} />
                  <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" placeholder={t('forms.times')} />
                  <span>{t('forms.perDay')}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block">{t('forms.signature')}</label>
              <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
            </div>
            <div>
              <label className="block">{t('forms.numberOfBoxesChecked')}</label>
              <input type="number" className="w-20 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Signature Section */}
      <div className="border-t-2 border-slate-300 pt-4 text-center">
        <div className="w-48 h-12 border-b-2 border-slate-400 mx-auto"></div>
        <p className="text-sm font-medium mt-2">{t('forms.sign')}</p>
      </div>
    </div>
  );
};

// Personal Hygiene Care Form Component
const PersonalHygieneCareForm: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-5xl mx-auto space-y-6 bg-white">
      {/* Form Header */}
      <div className="text-center border-b-2 border-slate-300 pb-4">
        <h1 className="text-lg font-bold text-slate-800">{t('forms.personalHygieneFormTitle')}</h1>
        <p className="text-sm text-slate-600 mt-2">{t('forms.personalHygieneDescription')}</p>
        <p className="text-sm text-slate-600 mt-1">{t('forms.crossOutItems')}</p>
      </div>
      
      {/* Patient Information */}
      <div className="border border-slate-200 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.patientsNameLabel')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.dateOfBirth')}</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.prescriberIdentificationLabel2')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.date')}</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
        </div>
      </div>
      
      {/* Nursing Care Section */}
      <div className="border-2 border-slate-300 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.toBeCarriedOutByNurse')}</h3>
        
        <div className="space-y-4">
          {/* Hygiene Care */}
          <div>
            <h4 className="font-medium text-sm mb-2">{t('forms.assistanceHygieneCare')}</h4>
            <div className="space-y-2 ml-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">{t('forms.assistanceHygieneTwice')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">{t('forms.completeBedHygiene')}</span>
              </label>
            </div>
          </div>
          
          {/* Vital Signs Monitoring */}
          <div>
            <h4 className="font-medium text-sm mb-2">{t('forms.monitoringVitalSigns')}</h4>
            <div className="space-y-2 ml-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">{t('forms.bloodPressurePulse')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">{t('forms.temperature')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">{t('forms.oxygenSaturation')}</span>
              </label>
            </div>
          </div>
          
          {/* Weight Monitoring */}
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm font-medium">{t('forms.weeklyWeightMonitoring')}</span>
            </label>
          </div>
          
          {/* Treatment Administration */}
          <div>
            <h4 className="font-medium text-sm mb-2">{t('forms.preparationAdministrationTreatments')}</h4>
            <div className="space-y-2 ml-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">{t('forms.capillaryBloodGlucose')}</span>
                <input type="number" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" placeholder={t('forms.times')} />
                <span className="text-sm">{t('forms.timesPerDay')}</span>
              </label>
            </div>
          </div>
          
          {/* Dressing Changes */}
          <div>
            <h4 className="font-medium text-sm mb-2">{t('forms.dressingChanges')}</h4>
            <div className="space-y-2 ml-4">
              <div className="flex items-center gap-2">
                <label className="block">{t('forms.locationLabel')}</label>
                <input type="text" className="flex-1 h-9 border border-slate-300 rounded px-3 text-sm" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">{t('forms.simple')}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">{t('forms.complex')}</span>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" placeholder={t('forms.times')} />
                <span className="text-sm">{t('forms.timesPerDayEvery')}</span>
                <input type="number" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" placeholder={t('forms.days')} />
                <span className="text-sm">{t('forms.days')}</span>
              </div>
            </div>
          </div>
          
          {/* Sutures/Staples Removal */}
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">{t('forms.removalSutures')}</span>
              <input type="number" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" placeholder={t('forms.days')} />
              <span className="text-sm">{t('forms.days')}</span>
            </label>
          </div>
          
          {/* Urinary Catheter Care */}
          <div>
            <div className="space-y-2 ml-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">{t('forms.urinaryCatheterCare')}</span>
                <input type="number" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" placeholder={t('forms.times')} />
                <span className="text-sm">{t('forms.timesPerDay')}</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="text-sm">{t('forms.removalUrinaryCatheter')}</div>
                <input type="date" className="w-40 h-9 border border-slate-300 rounded px-3 text-sm" />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">{t('forms.monitoringOfUrineOutput')}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Prescription Sections */}
      <div className="grid grid-cols-1 gap-4">
        <div className="border border-slate-200 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-2">{t('forms.prescriptionsNotRelated')}</h4>
          <textarea className="w-full h-24 border border-slate-300 rounded p-3 text-sm resize-none" />
        </div>
        
        <div className="border border-slate-200 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-2">{t('forms.prescriptionsRelatedTreatmentALD')}</h4>
          <textarea className="w-full h-24 border border-slate-300 rounded p-3 text-sm resize-none" />
        </div>
      </div>
      
      {/* Medical Certification */}
      <div className="border-2 border-slate-300 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.medicalCertification')}</h3>
        <div className="space-y-3 text-sm">
          <p>{t('forms.certifyNursingCare')}
            <input type="text" className="w-48 h-9 border border-slate-300 rounded mx-2 px-3 text-sm" />
            {t('forms.afterExamining')}
            <input type="text" className="w-48 h-9 border border-slate-300 rounded mx-2 px-3 text-sm" />
            {t('forms.certifyNursingCare2')}
          </p>
          
          <div className="flex items-center gap-2">
            <label className="font-medium">{t('forms.prescriptionForDaysLabel')}</label>
            <input type="number" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
            <span className="font-medium">{t('forms.daysRenewable')}</span>
          </div>
        </div>
      </div>
      
      {/* Signature Section */}
      <div className="border-t-2 border-slate-300 pt-4 text-center">
        <div className="w-48 h-12 border-b-2 border-slate-400 mx-auto"></div>
        <p className="text-sm font-medium mt-2">{t('forms.sign')}</p>
      </div>
    </div>
  );
};

// PCA (Pain Management) Form Component
const PCAPainManagementForm: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-5xl mx-auto space-y-6 bg-white">
      {/* Form Header */}
      <div className="text-center border-b-2 border-slate-300 pb-4">
        <h1 className="text-lg font-bold text-slate-800">{t('forms.pcaFormTitle')}</h1>
        <p className="text-sm text-slate-600 mt-2">{t('forms.tickAppropriateBoxes')}</p>
      </div>
      
      {/* Prescription Type */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{t('forms.prescriptionDate')}</span>
          <input type="date" className="w-40 h-9 border border-slate-300 rounded px-3 text-sm" />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">{t('forms.startOfHomeInfusion')}</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">{t('forms.renewalOrModification')}</span>
          </label>
        </div>
      </div>
      
      {/* Patient Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.patient')}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.lastName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.firstName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.dateOfBirth')}</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.weight')}</label>
            <input type="number" className="w-24 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="block">{t('forms.socialInsuranceNumber')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.careRelatedALD')}</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Prescriber Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.prescriberIdentification')}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.lastNameAuto')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">{t('forms.firstNameAuto')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">{t('forms.phoneAuto')}</label>
            <input type="tel" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">{t('forms.rppsIdAuto')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">{t('forms.sharedDirectory')}</p>
      </div>
      
      {/* Practice/Facility Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.prescriberPractice')}</h3>
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.hospitalName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.addressLabel')}</label>
            <textarea className="w-full h-20 border border-slate-300 rounded mt-1 px-3 text-sm resize-none" />
          </div>
          <div>
            <label className="block">{t('forms.geographicFiness')}</label>
            <input type="text" className="w-32 h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
      </div>
      
      {/* Important Notice */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm font-bold text-red-800">{t('forms.importantNotice')}</p>
      </div>
      
      {/* PCA Specific Section */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm">{t('forms.formsFor')}</h3>
        
        <div className="border-2 border-slate-300 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block">{t('forms.effectiveFrom')}</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>/</span>
                <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>/</span>
                <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
              </div>
            </div>
            <div>
              <label className="block">{t('forms.prescriptionForWeeks')}</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="number" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>{t('forms.weeks')}</span>
                <input type="number" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>{t('forms.times')}</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm">
            <p className="font-medium mb-3">{t('forms.pcaMorphineAdministration')}</p>
            
            <div className="space-y-2">
              <h5 className="font-medium">{t('forms.nursingCareProvided')}</h5>
              <div className="ml-4 space-y-2">
                <div>- {t('forms.preparationProgrammingPump')}</div>
                <div>- {t('forms.fillingSettingUpPump')}</div>
                <div>- {t('forms.connectingTheInfusion')}</div>
                <div>- {t('forms.reservoirChange')}</div>
                <div>- {t('forms.stoppingRemovingDevice')}</div>
                <div>- {t('forms.flushHeparinization')}</div>
                <div>- {t('forms.dressingChangeHuber')}</div>
                <div>- {t('forms.organizationMonitoring')}</div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h5 className="font-medium text-sm mb-3">{t('forms.administrationContinuousInfusion')}</h5>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block">{t('forms.morphineHydrochloride')}</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="number" className="w-24 h-9 border border-slate-300 rounded px-3 text-sm" />
                  <span>{t('forms.mgPerHour')}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input type="number" className="w-24 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>{t('forms.mgPureMorphine')}</span>
                <input type="number" className="w-24 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>{t('forms.mlFlexibleBag')}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h5 className="font-medium text-sm mb-3">{t('forms.pumpSettings')}</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block">{t('forms.basalRate')}</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="number" className="w-24 h-9 border border-slate-300 rounded px-3 text-sm" />
                  <span>{t('forms.mgPerHour')}</span>
                </div>
              </div>
              <div>
                <label className="block">{t('forms.bolusDose')}</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="number" className="w-24 h-9 border border-slate-300 rounded px-3 text-sm" />
                  <span>{t('forms.mg')}</span>
                </div>
              </div>
              <div>
                <label className="block">{t('forms.lockoutPeriod')}</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="number" className="w-24 h-9 border border-slate-300 rounded px-3 text-sm" />
                  <span>{t('forms.minutes')}</span>
                </div>
              </div>
              <div>
                <label className="block">{t('forms.maxBolusesPerHour')}</label>
                <input type="number" className="w-24 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4 text-sm">
            <p>{t('forms.renewedForConnection')}
              <input type="number" className="w-20 h-9 border border-slate-300 rounded mx-2 px-3 text-sm" />
              {t('forms.timesPerWeekFor28Days')}
            </p>
          </div>
          
        </div>
      </div>
      
      {/* Signature Section */}
      <div className="border-t-2 border-slate-300 pt-4 text-center">
        <div className="w-48 h-12 border-b-2 border-slate-400 mx-auto"></div>
        <p className="text-sm font-medium mt-2">{t('forms.sign')}</p>
      </div>
    </div>
  );
};

// Medical Oxygen Form Component
const MedicalOxygenForm: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-5xl mx-auto space-y-6 bg-white">
      {/* Form Header */}
      <div className="text-center border-b-2 border-slate-300 pb-4">
        <h1 className="text-lg font-bold text-slate-800">{t('forms.medicalOxygenFormTitle')}</h1>
      </div>
      
      {/* Patient Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.patient')}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.lastName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.firstName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.dateOfBirth')}</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.weight')}</label>
            <input type="number" className="w-24 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="block">{t('forms.socialInsuranceNumber')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.careRelatedALD')}</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Prescriber Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.prescriberIdentification')}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.lastNameAuto')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">{t('forms.firstNameAuto')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">{t('forms.phoneAuto')}</label>
            <input type="tel" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">{t('forms.rppsIdAuto')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">{t('forms.sharedDirectory')}</p>
      </div>
      
      {/* Practice/Facility Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.prescriberPractice')}</h3>
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.hospitalName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.addressLabel')}</label>
            <textarea className="w-full h-20 border border-slate-300 rounded mt-1 px-3 text-sm resize-none" />
          </div>
          <div>
            <label className="block">{t('forms.geographicFiness')}</label>
            <input type="text" className="w-32 h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
      </div>
      
      {/* Prescription Section */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm">{t('forms.prescription')}</h3>
        
        <div className="border-2 border-slate-300 rounded-lg p-4 space-y-4">
          <div className="text-sm">
            <label className="block">{t('forms.typeOfOxygenSource')}</label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>{t('forms.stationaryConcentrator')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>{t('forms.compressedOxygenCylinder')}</span>
              </label>
            </div>
          </div>
          
          <div className="text-sm">
            <label className="block">{t('forms.ambulatoryCylinder')}</label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>{t('forms.yes')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>{t('forms.no')}</span>
              </label>
            </div>
          </div>
          
          <div className="text-sm">
            <label className="block">{t('forms.oxygenDeliveryMethod')}</label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>{t('forms.oxygenNasalCannula')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>{t('forms.oxygenMask')}</span>
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block">{t('forms.durationLabel')}</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="number" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>{t('forms.hoursDayMonth')}</span>
              </div>
            </div>
            <div>
              <label className="block">{t('forms.flowRate')}</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="number" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>{t('forms.lMinAtRest')}</span>
                <input type="number" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>{t('forms.lMinDuringExertion')}</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm">
            <label className="block">{t('forms.humidifierCompliant')}</label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>{t('forms.yes')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>{t('forms.no')}</span>
              </label>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div>{t('forms.backupSource')}</div>
            <div>{t('forms.mobilitySource')}</div>
            <div>{t('forms.provisionPulseOximeter')}</div>
            <div>{t('forms.nonKinkingTubing')}</div>
          </div>
          
          <div className="text-sm">
            <label className="block">{t('forms.adjustOxygenSpO2')}</label>
            <div className="flex items-center gap-2 mt-1">
              <input type="number" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
              <span>{t('forms.percent')}</span>
            </div>
          </div>
          
          <div className="text-sm">
            <label className="block">{t('forms.prescriberPhoneNumber')}</label>
            <input type="tel" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          
          <div className="text-xs text-slate-500 italic">
            * {t('forms.crossOutItems')}
          </div>
        </div>
      </div>
      
      {/* Patient Instructions */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm">{t('forms.patientInstructions')}</h3>
        
        <div className="border-2 border-slate-300 rounded-lg p-4 space-y-4">
          <div className="text-sm">
            <p className="font-medium mb-3">{t('forms.followInstructionsCarefully')}</p>
            <p className="mb-3">{t('forms.useOxygenDaily')}</p>
            <p className="mb-3">{t('forms.oxygenExplosionWarning')}</p>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-600">{t('forms.never')}</span>
              <span>{t('forms.neverSmokeVape')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-600">{t('forms.never')}</span>
              <span>{t('forms.neverSmokeRoom')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-600">{t('forms.never')}</span>
              <span>{t('forms.neverCook')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-600">{t('forms.never')}</span>
              <span>{t('forms.neverAerosol')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-600">{t('forms.never')}</span>
              <span>{t('forms.neverGreasyOintment')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-600">{t('forms.never')}</span>
              <span>{t('forms.neverHeatSources')}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Palliative Care Section */}
      <div className="space-y-4">
        <div className="text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>{t('forms.homeOxygenPalliativeCare')}</span>
          </label>
          <p className="text-xs text-slate-500 italic mt-1">{t('forms.crossOutItems')}</p>
        </div>
      </div>
      
      {/* Signature Section */}
      <div className="border-t-2 border-slate-300 pt-4 text-center">
        <div className="w-48 h-12 border-b-2 border-slate-400 mx-auto"></div>
        <p className="text-sm font-medium mt-2">{t('forms.sign')}</p>
      </div>
    </div>
  );
};

// Infusion Form Component (for both Antibiotherapy and Hydration)
const InfusionForm: React.FC<{ serviceName: string }> = ({ serviceName }) => {
  const { t } = useTranslation();
  const [infusionProducts, setInfusionProducts] = useState([1]);
  
  const addInfusionProduct = () => {
    if (infusionProducts.length < 3) {
      setInfusionProducts([...infusionProducts, infusionProducts.length + 1]);
    }
  };
  
  const getFormTitle = () => {
    if (serviceName === 'Hydration Infusion') {
      return t('forms.hydrationInfusionTitle');
    } else if (serviceName === 'Parenteral Nutrition (Central Line)') {
      return t('forms.parenteralNutritionTitle');
    } else if (serviceName === 'IV Therapy') {
      return t('forms.ivTherapyTitle');
    } else if (serviceName === 'Pregnancy Related Care') {
      return t('forms.pregnancyRelatedCareTitle');
    }
    return t('forms.antibiotherapyInfusionTitle');
  };
  
  return (
    <div className="max-w-5xl mx-auto space-y-6 bg-white">
      {/* Form Header */}
      <div className="text-center border-b-2 border-slate-300 pb-4">
        <h1 className="text-lg font-bold text-slate-800">{getFormTitle()}</h1>
        <p className="text-sm text-slate-600 mt-2">{t('forms.tickAppropriateBoxes')}</p>
      </div>
      
      {/* Prescription Type */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{t('forms.prescriptionDate')}</span>
          <input type="date" className="w-40 h-9 border border-slate-300 rounded px-3 text-sm" />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">{t('forms.startOfHomeInfusion')}</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">{t('forms.renewalOrModification')}</span>
          </label>
        </div>
      </div>
      
      {/* Patient Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.patient')}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.lastName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.firstName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.dateOfBirth')}</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.weight')}</label>
            <input type="number" className="w-24 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="block">{t('forms.socialInsuranceNumber')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('forms.careRelatedALD')}</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Prescriber Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.prescriberIdentification')}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.lastNameAuto')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">{t('forms.firstNameAuto')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">{t('forms.phoneAuto')}</label>
            <input type="tel" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">{t('forms.rppsIdAuto')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">{t('forms.sharedDirectory')}</p>
      </div>
      
      {/* Practice/Facility Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">{t('forms.prescriberPractice')}</h3>
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div>
            <label className="block">{t('forms.hospitalName')}</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">{t('forms.addressLabel')}</label>
            <textarea className="w-full h-20 border border-slate-300 rounded mt-1 px-3 text-sm resize-none" />
          </div>
          <div>
            <label className="block">{t('forms.geographicFiness')}</label>
            <input type="text" className="w-32 h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
      </div>
      
      {/* Infusion Products */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm">{t('forms.formsFor')}</h3>
        
        {infusionProducts.map((productNum) => (
          <div key={productNum} className="border-2 border-slate-300 rounded-lg p-4">
            <h4 className="font-bold text-sm mb-4">{t('forms.infusionProduct', { num: productNum })}</h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm space-y-3">
              <div>
                <label className="block">{t('forms.productName')}</label>
                <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
              </div>
              <div>
                <label className="block">{t('forms.strength')}</label>
                <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
              </div>
              <div>
                <label className="block">{t('forms.diluent')}</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="text" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
                  <span>/</span>
                  <input type="text" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
                  <span>{t('forms.ml')}</span>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>{t('forms.withoutDiluent')}</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block">{t('forms.durationOfInfusion')}</label>
                <div className="flex items-center gap-2 mt-1">
                  <span>(x)</span>
                  <input type="number" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
                  <span>{t('forms.hoursAnd')}</span>
                  <input type="number" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
                  <span>{t('forms.minutes')}</span>
                </div>
              </div>
              <div>
                <label className="block">{t('forms.frequencyOfInfusion')}</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="number" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
                  <span>{t('forms.per')}</span>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>{t('forms.dayA')}</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Route of Access */}
            <div className="mt-4">
              <h5 className="font-bold text-sm mb-2">{t('forms.routeOfAccess')}</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium">{t('forms.centralVenous')}</p>
                  <div className="space-y-1 ml-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>{t('forms.implantedPort')}</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>{t('forms.centralCatheter')}</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>{t('forms.picc')}</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>{t('forms.perineural')}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>{t('forms.peripheralVenous')}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>{t('forms.subcutaneous')}</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Mode of Administration */}
            <div className="mt-4">
              <h5 className="font-bold text-sm mb-2">{t('forms.modeOfAdministration')}</h5>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>{t('forms.gravity')}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>{t('forms.elastomericDiffuser')}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>{t('forms.electricInfusionPump')}</span>
                </label>
              </div>
            </div>
            
            {/* Additional Questions */}
            <div className="mt-4 space-y-2 text-sm">
              <div>
                <label className="block">{t('forms.ambulatoryDuringTreatment')}</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2">
                    <input type="radio" name={`ambulatory${productNum}`} className="w-4 h-4" />
                    <span>{t('forms.yesSmall')}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name={`ambulatory${productNum}`} className="w-4 h-4" />
                    <span>{t('forms.noSmall')}</span>
                  </label>
                </div>
              </div>
              
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>{t('forms.supervisionBox')}</span>
              </label>
            </div>
            
            {/* Treatment Schedule */}
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block">{t('forms.startDateCycle')}</label>
                <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
              </div>
              <div>
                <label className="block">{t('forms.endDateCycle')}</label>
                <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
              </div>
              <div>
                <label className="block">{t('forms.treatmentDurationDays')}</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="number" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
                  <span>{t('forms.days')}</span>
                </div>
              </div>
              <div>
                <label className="block">{t('forms.totalInfusions')}</label>
                <div className="text-xs text-slate-600 mt-1">
                  {t('forms.formulaTNI')}
                </div>
                <input type="text" className="w-16 h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
              </div>
            </div>
            
            <div className="mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>{t('forms.infusedAlone')}</span>
              </label>
            </div>
          </div>
        ))}
        
        {infusionProducts.length < 3 && (
          <button
            onClick={addInfusionProduct}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
          >
            <i className="fa-solid fa-plus-circle"></i>
            <span>{t('forms.addInfusionProduct')}</span>
          </button>
        )}
      </div>
      
      {/* Signature Section */}
      <div className="border-t-2 border-slate-300 pt-4 text-center">
        <div className="w-48 h-12 border-b-2 border-slate-400 mx-auto"></div>
        <p className="text-sm font-medium mt-2">{t('forms.sign')}</p>
      </div>
    </div>
  );
};

export const FormStructureViewer: React.FC<FormStructureViewerProps> = ({
  selectedService,
  onMapService
}) => {
  const { t } = useTranslation();
  const formPreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formPreviewRef.current) {
      const inputs = formPreviewRef.current.querySelectorAll('input, textarea, select');
      inputs.forEach((el) => {
        const field = el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        field.disabled = true;
        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
          field.readOnly = true;
        }
      });
    }
  }, [selectedService]);

  if (!selectedService) {
    return (
      <section className="flex-1 bg-white rounded-2xl border border-slate-200 tradingview-shadow flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50/50 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <i className="fa-solid fa-file-signature text-lg"></i>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">{t('forms.antibiotherapyInfusionTitle')}</h2>
              <p className="text-[11px] text-slate-500">{t('forms.structuredFieldPreview')}</p>
            </div>
          </div>
        </div>
        <div ref={formPreviewRef} className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
          {/* Read-only banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 mb-6">
            <i className="fa-solid fa-lock text-amber-600"></i>
            <p className="text-sm font-medium text-amber-800">{t('forms.readOnlyPreview')}</p>
          </div>
          <InfusionForm serviceName="Antibiotherapy Infusion" />
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 bg-white rounded-2xl border border-slate-200 tradingview-shadow flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50/50 to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <i className="fa-solid fa-file-signature text-lg"></i>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {selectedService.formName || t('forms.noFormAssignedTitle')}
            </h2>
            <p className="text-[11px] text-slate-500">{t('forms.structuredFieldPreview')}</p>
          </div>
        </div>
        {/* <div className="flex gap-2">
          <button
            onClick={onMapService}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm border border-blue-700"
            style={{minWidth: '100px'}}
          >
            <i className="fa-solid fa-link mr-1.5"></i> {selectedService.formName ? 'Change Form' : 'Assign Form'}
          </button>
        </div> */}
      </div>
      
      <div ref={formPreviewRef} className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
        {selectedService.name === 'Generic' ? (
          <div>
            {/* Read-only banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 mb-6">
              <i className="fa-solid fa-lock text-amber-600"></i>
              <p className="text-sm font-medium text-amber-800">{t('forms.readOnlyPreview')}</p>
            </div>
            <GenericForm />
          </div>
        ) : selectedService.name === 'Wound Care' ? (
          <div>
            {/* Read-only banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 mb-6">
              <i className="fa-solid fa-lock text-amber-600"></i>
              <p className="text-sm font-medium text-amber-800">{t('forms.readOnlyPreview')}</p>
            </div>
            <WoundCareForm />
          </div>
        ) : selectedService.name === 'CNO' ? (
          <div>
            {/* Read-only banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 mb-6">
              <i className="fa-solid fa-lock text-amber-600"></i>
              <p className="text-sm font-medium text-amber-800">{t('forms.readOnlyPreview')}</p>
            </div>
            <CNOForm />
          </div>
        ) : selectedService.name === 'Artificial Nutrition' ? (
          <div>
            {/* Read-only banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 mb-6">
              <i className="fa-solid fa-lock text-amber-600"></i>
              <p className="text-sm font-medium text-amber-800">{t('forms.readOnlyPreview')}</p>
            </div>
            <ArtificialNutritionForm />
          </div>
        ) : selectedService.name === 'Personal Hygiene Care' ? (
          <div>
            {/* Read-only banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 mb-6">
              <i className="fa-solid fa-lock text-amber-600"></i>
              <p className="text-sm font-medium text-amber-800">{t('forms.readOnlyPreview')}</p>
            </div>
            <PersonalHygieneCareForm />
          </div>
        ) : selectedService.name === 'PCA (Pain Management)' ? (
          <div>
            {/* Read-only banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 mb-6">
              <i className="fa-solid fa-lock text-amber-600"></i>
              <p className="text-sm font-medium text-amber-800">{t('forms.readOnlyPreview')}</p>
            </div>
            <PCAPainManagementForm />
          </div>
        ) : selectedService.name === 'Medical Oxygen' ? (
          <div>
            {/* Read-only banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 mb-6">
              <i className="fa-solid fa-lock text-amber-600"></i>
              <p className="text-sm font-medium text-amber-800">{t('forms.readOnlyPreview')}</p>
            </div>
            <MedicalOxygenForm />
          </div>
        ) : selectedService.name === 'Antibiotherapy Infusion' || 
          selectedService.name === 'Hydration Infusion' || 
          selectedService.name === 'Parenteral Nutrition (Central Line)' || 
          selectedService.name === 'IV Therapy' || 
          selectedService.name === 'Pregnancy Related Care' ? (
          <div>
            {/* Read-only banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 mb-6">
              <i className="fa-solid fa-lock text-amber-600"></i>
              <p className="text-sm font-medium text-amber-800">{t('forms.readOnlyPreview')}</p>
            </div>
            <InfusionForm serviceName={selectedService.name} />
          </div>
        ) : selectedService.formName ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Read-only banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3">
              <i className="fa-solid fa-lock text-amber-600"></i>
              <p className="text-sm font-medium text-amber-800">{t('forms.readOnlyPreview')}</p>
            </div>
            
            {/* Section: Patient Demographics */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
                {t('forms.patientDemographics')}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">{t('forms.firstName')}</label>
                  <div className="w-full h-9 bg-slate-100 border border-slate-200 rounded-lg"></div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">{t('forms.lastName')}</label>
                  <div className="w-full h-9 bg-slate-100 border border-slate-200 rounded-lg"></div>
                </div>
              </div>
            </div>

            {/* Section: Clinical Information */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
                {t('forms.clinicalInformation')}
              </h4>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">{t('forms.currentMedications')}</label>
                  <div className="w-full bg-slate-100 border border-slate-200 rounded-lg h-[94px] relative"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border border-slate-300 rounded bg-slate-100"></div>
                  <label className="text-xs text-slate-600">{t('forms.hasKnownAllergies')}</label>
                </div>
              </div>
            </div>

            {/* Section: End of Form Preview */}
            <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-2">
              <i className="fa-solid fa-plus-circle text-xl"></i>
              <p className="text-xs font-medium">{t('forms.endOfFormPreview')}</p>
            </div>
          </div>
        ) : (
          <div>
            {/* Read-only banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 mb-6">
              <i className="fa-solid fa-lock text-amber-600"></i>
              <p className="text-sm font-medium text-amber-800">{t('forms.readOnlyPreview')}</p>
            </div>
            <InfusionForm serviceName="Antibiotherapy Infusion" />
          </div>
        )}
      </div>
    </section>
  );
};
