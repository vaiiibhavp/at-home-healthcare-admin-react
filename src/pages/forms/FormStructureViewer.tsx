import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Service } from './FormTypes';

interface FormStructureViewerProps {
  selectedService: Service | null;
  onMapService: () => void;
}

// CNO (Home Oral Nutrition Supplement) Form Component
const CNOForm: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 bg-white">
      {/* Form Header */}
      <div className="text-center border-b-2 border-slate-300 pb-4">
        <h1 className="text-lg font-bold text-slate-800">HOME ORAL NUTRITION SUPLEMENT PRESCRIPTION FORM</h1>
      </div>
      
      {/* Patient Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">PATIENT</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">Last name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">First name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Date of birth:</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Weight (kg):</label>
            <input type="number" className="w-24 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="block">Social Insurance number (NIR):</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Care related to a long-term condition (ALD)</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Prescriber Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">PRESCRIBER IDENTIFICATION</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">Last name: (automatic by Login)</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">First name: (automatic by Login)</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">Phone: (automatic by Login)</label>
            <input type="tel" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">RPPS ID: (automatic by Login)</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">*Shared directory of healthcare professionals</p>
      </div>
      
      {/* Practice/Facility Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">PRESCRIBER'S PRACTICE / FACILITY</h3>
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div>
            <label className="block">HOSPITAL name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Address:</label>
            <textarea className="w-full h-20 border border-slate-300 rounded mt-1 px-3 text-sm resize-none" />
          </div>
          <div>
            <label className="block">Geographic FINESS No.: (automatic by Login)</label>
            <input type="text" className="w-32 h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
      </div>
      
      {/* Prescription Details */}
      <div className="space-y-4">
        <div className="text-sm">
          <p>Done at 
            <input type="text" className="w-32 h-9 border border-slate-300 rounded mx-2 px-3 text-sm" />
            on 
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
            <span>Prescription outside ALD</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>Prescription outside ALD</span>
          </label>
        </div>
        
        <div className="text-sm space-y-3">
          <p>The health status of Mr/Ms 
            <input type="text" className="w-32 h-9 border border-slate-300 rounded mx-2 px-3 text-sm" />
            aged 
            <input type="number" className="w-16 h-9 border border-slate-300 rounded mx-2 px-3 text-sm" />
          </p>
          
          <p>Weighing 
            <input type="number" className="w-16 h-9 border border-slate-300 rounded mx-2 px-3 text-sm" />
            kg, requires oral nutritional supplements:
          </p>
        </div>
        
        <div className="border-2 border-slate-300 rounded-lg p-4 space-y-3">
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">Diabetic range</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">Standard carbohydrate range</span>
            </label>
          </div>
          
          <div className="space-y-2 text-sm">
            {[
              "High protein / high calorie ONS drink 1.5 kcal/ml",
              "High protein / high calorie ONS drink 1.5 kcal/ml + fiber",
              "High protein / high calorie ONS drink 2 kcal/ml",
              "High protein / high calorie ONS 2 kcal/ml concentrated (small volume)",
              "High protein / high calorie ONS cream 1.5 kcal/ml",
              "High protein / high calorie ONS soup 1.5 kcal",
              "Blended high-protein meals (300 g), 500 kcal",
              "Fruit juice ONS, standard protein, high calorie",
              "Compote 250 kcal + 6–9 g protein"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="flex-1">{item}</span>
                <input type="text" className="w-24 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>Qty</span>
                <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>/day</span>
              </div>
            ))}
            
            <div className="flex items-center gap-2">
              <span>Other:</span>
              <input type="text" className="w-full h-9 border border-slate-300 rounded px-3 text-sm" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">Patient Name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Date of Birth:</label>
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
          <h4 className="font-medium">Prescriber Identification</h4>
        </div>
        
        <div className="text-sm space-y-3">
          <p>To be consumed at least 2 hours before or after each meal for 1 month</p>
          
          <div>
            <label className="block">Texture:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          
          <p>Reassessment at 1 month</p>
          
          <p>Renewal to be carried out for 
            <input type="number" className="w-16 h-9 border border-slate-300 rounded mx-2 px-3 text-sm" />
            months
          </p>
          
          <p>After a reassessment including:</p>
          <div className="ml-4 space-y-1">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Weight</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Nutritional status</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Progression of the pathology</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Level of spontaneous oral intake</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Tolerance of oral nutritional supplements (ONS)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Compliance with ONS</span>
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">Date:</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Signature:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
        </div>
      </div>
      
      {/* Signature Section */}
      <div className="border-t-2 border-slate-300 pt-4 text-center">
        <div className="w-48 h-12 border-b-2 border-slate-400 mx-auto"></div>
        <p className="text-sm font-medium mt-2">Sign</p>
      </div>
    </div>
  );
};

// Wound Care Form Component
const WoundCareForm: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 bg-white">
      {/* Form Header */}
      <div className="text-center border-b-2 border-slate-300 pb-4">
        <h1 className="text-lg font-bold text-slate-800">Wound Dressing Prescription Support Form</h1>
      </div>
      
      {/* Physician Information */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">Physician Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">Last name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">First name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">RPPS No.:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">FINESS:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
        </div>
      </div>
      
      {/* Patient Information */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">Patient Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">Last name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">First name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Date of birth:</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
        </div>
      </div>

      {/* Care Related to ALD */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">Care Related to ALD</h3>
        <div className="space-y-3 text-sm">
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Care related to long-term condition (ALD)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Care not related to long-term condition (ALD)</span>
            </label>
          </div>
          <div>
            <label className="block">Date:</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
        </div>
      </div>
      
      {/* Type of Wound */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">Type of wound:</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <label className="block">Size:</label>
            <input type="text" className="w-32 h-9 border border-slate-300 rounded px-3 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Acute</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Chronic</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Ulcer</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Pressure ulcer</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Postoperative wound</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Cavity wound</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Wound with fibrin</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Other:</span>
              <input type="text" className="w-32 h-9 border border-slate-300 rounded px-3 text-sm" />
            </label>
          </div>
        </div>
      </div>
      
      {/* Desired Dressing Type */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">Desired dressing type</h3>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>Hyperabsorbent (ulcer-type wound)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>Post-op (e.g., Mediane Post-op)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>Debridement and healing dressing (e.g., Algosteril)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>Hydrocolloid: absorbs exudate and forms a moist gel on contact with the wound</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>Packing:</span>
          </label>
          <div className="ml-6 space-y-2">
            <div>- Fill a cavity</div>
            <div>- Occupy dead space</div>
            <div>- Prevent premature superficial closure</div>
          </div>
        </div>
      </div>
      
      {/* Additional Wound Assessment */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">Additional Wound Assessment</h3>
        <div className="space-y-3 text-sm">
          <div className="space-y-2">
            <label className="block">Exudate</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>No</span>
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block">Cavity</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>No</span>
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block">Septic wound:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>No</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Required Materials and Applicable Protocol */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">Required Materials and Applicable Protocol</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>Dressing kits</span>
            <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
            <span>per day</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>Nylex or Velpeau retention bandage</span>
            <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
            <span>per day</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>Cleaning with</span>
            <input type="text" className="w-48 h-9 border border-slate-300 rounded px-3 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>Disinfection with</span>
            <input type="text" className="w-48 h-9 border border-slate-300 rounded px-3 text-sm" />
          </div>
          <div className="space-y-2 ml-6">
            <div className="flex items-center gap-2">
              <span>1st layer in contact with the wound</span>
              <input type="text" className="w-32 h-9 border border-slate-300 rounded px-3 text-sm" />
            </div>
            <div className="flex items-center gap-2">
              <span>2nd overlapping layer</span>
              <input type="text" className="w-32 h-9 border border-slate-300 rounded px-3 text-sm" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Treatment Duration */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">Treatment Duration</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>Treatment duration</span>
            <input type="text" className="w-32 h-9 border border-slate-300 rounded px-3 text-sm" />
            <span>or</span>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>Until healed</span>
          </label>
        </div>
      </div>
      
      {/* Physician Signature */}
      <div className="border border-slate-200 rounded-lg p-4">
        <div className="flex items-center gap-4 text-sm">
          <label className="block">Physician signature:</label>
          <input type="text" className="w-64 h-9 border border-slate-300 rounded px-3 text-sm" />
        </div>
      </div>
      
      {/* Signature Section */}
      <div className="border-t-2 border-slate-300 pt-4 text-center">
        <div className="w-48 h-12 border-b-2 border-slate-400 mx-auto"></div>
        <p className="text-sm font-medium mt-2">Sign</p>
      </div>
    </div>
  );
};

// Generic Form Component with Free Text Zone
const GenericForm: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 bg-white">
      {/* Form Header */}
      <div className="text-center border-b-2 border-slate-300 pb-4">
        <h1 className="text-lg font-bold text-slate-800">FREE PRESCRIPTION FORMS</h1>
        <p className="text-sm text-slate-600 mt-2">TICK THE APPROPRIATE BOXES ON THE FORM</p>
      </div>
      
      {/* Prescription Type */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Prescription date:</span>
          <input type="date" className="w-40 h-9 border border-slate-300 rounded px-3 text-sm" />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">Start of home infusion therapy</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">Renewal or modification</span>
          </label>
        </div>
      </div>
      
      {/* Patient Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">PATIENT</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">Last name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">First name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Date of birth:</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Weight (kg):</label>
            <input type="number" className="w-24 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="block">Social Insurance number (NIR):</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Care related to a long-term condition (ALD)</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Prescriber Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">PRESCRIBER IDENTIFICATION</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">Last name: (automatic by Login)</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">First name: (automatic by Login)</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">Phone: (automatic by Login)</label>
            <input type="tel" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">RPPS ID: (automatic by Login)</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">*Shared directory of healthcare professionals</p>
      </div>
      
      {/* Practice/Facility Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">PRESCRIBER'S PRACTICE / FACILITY</h3>
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div>
            <label className="block">HOSPITAL name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Address:</label>
            <textarea className="w-full h-20 border border-slate-300 rounded mt-1 px-3 text-sm resize-none" />
          </div>
          <div>
            <label className="block">Geographic FINESS No.: (automatic by Login)</label>
            <input type="text" className="w-32 h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
      </div>
      
      {/* Free Text Zone */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm">Forms for</h3>
        
        <div className="border-2 border-slate-300 rounded-lg p-4">
          <h4 className="font-bold text-sm mb-4">FREE ZONE TEXTE</h4>
          
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
        <p className="text-sm font-medium mt-2">Sign</p>
      </div>
    </div>
  );
};

// Artificial Nutrition Form Component
const ArtificialNutritionForm: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 bg-white">
      {/* Form Header */}
      <div className="text-center border-b-2 border-slate-300 pb-4">
        <h1 className="text-lg font-bold text-slate-800">ARTIFICIAL NUTRITION PRESCRIPTION FORM</h1>
        <p className="text-sm text-slate-600 mt-2">TICK THE APPROPRIATE BOXES ON THE FORM</p>
      </div>
      
      {/* Prescription Type */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Prescription date:</span>
          <input type="date" className="w-40 h-9 border border-slate-300 rounded px-3 text-sm" />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">Start of home infusion therapy</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">Renewal or modification</span>
          </label>
        </div>
      </div>
      
      {/* Patient Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">PATIENT</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">Last name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">First name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Date of birth:</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Weight (kg):</label>
            <input type="number" className="w-24 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="block">Social Insurance number (NIR):</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Care related to a long-term condition (ALD)</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Prescriber Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">PRESCRIBER IDENTIFICATION</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">Last name: (automatic by Login)</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">First name: (automatic by Login)</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">Phone: (automatic by Login)</label>
            <input type="tel" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">RPPS ID: (automatic by Login)</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">*Shared directory of healthcare professionals</p>
      </div>
      
      {/* Practice/Facility Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">PRESCRIBER'S PRACTICE / FACILITY</h3>
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div>
            <label className="block">HOSPITAL name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Address:</label>
            <textarea className="w-full h-20 border border-slate-300 rounded mt-1 px-3 text-sm resize-none" />
          </div>
          <div>
            <label className="block">Geographic FINESS No.: (automatic by Login)</label>
            <input type="text" className="w-32 h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
      </div>
      
      {/* Artificial Nutrition Specific Section */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm">Forms for</h3>
        
        <div className="border-2 border-slate-300 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block">From:</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>/</span>
                <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>/</span>
                <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
              </div>
            </div>
            <div>
              <label className="block">Prescription for ……… week(s), to be renewed ……… times</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="number" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>week(s)</span>
                <input type="number" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>times</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm">
            <p className="font-medium mb-2">The health condition of MR (Name of patient) requires enteral nutrition by gravity (package 1), at home, for a duration of ..................... week(s), with:</p>
            
            <div className="space-y-3 mt-4">
              <div className="space-y-2">
                <h5 className="font-medium">Initial setup package for enteral nutrition</h5>
                <h5 className="font-medium">Weekly enteral nutrition package by:</h5>
                <div className="ml-4 space-y-2">
                  <div>- Gravity (package 1)</div>
                  <div>- Pump (package 2)</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block">Nasogastric tube CH:</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="text" className="w-24 h-9 border border-slate-300 rounded px-3 text-sm" />
                    <span>to be used at a rate of</span>
                    <input type="text" className="w-24 h-9 border border-slate-300 rounded px-3 text-sm" />
                    <span>per month</span>
                  </div>
                </div>
                <div>
                  <label className="block">Jejunostomy or gastrostomy tube CH:</label>
                  <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div>- Rental of an IV pole</div>
                <div>
                  <label className="block">Equipment for adult nasogastric tube care every ………… days</label>
                  <input type="number" className="w-20 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
                </div>
                <div>- Equipment for gastrostomy or jejunostomy care</div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4 space-y-3">
            <div>
              <h5 className="font-medium text-sm">Prescriptions unrelated to the recognized long-term condition (listed or not listed) (Intercurrent illnesses)</h5>
              <textarea className="w-full h-20 border border-slate-300 rounded p-3 text-sm resize-none mt-2" />
            </div>
            
            <div>
              <h5 className="font-medium text-sm">Prescriptions related to the treatment of the recognized long-term condition (listed or not listed) (Exempting condition)</h5>
              <textarea className="w-full h-20 border border-slate-300 rounded p-3 text-sm resize-none mt-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block">Jejunostomy care every ………… days</label>
                <input type="number" className="w-20 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
              </div>
              <div>
                <div>- Equipment in case of gastrostomy tube replacement</div>
              </div>
            </div>

            <div>
              <div>- One gastrostomy button extension set, to be renewed every 7 days</div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h5 className="font-medium text-sm mb-3">Nutrients:</h5>
            <div className="space-y-2">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center gap-2">
                  <span>{num})</span>
                  <input type="text" className="flex-1 h-9 border border-slate-300 rounded px-3 text-sm" placeholder="nutrient name" />
                  <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" placeholder="ml" />
                  <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" placeholder="times" />
                  <span>per day</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block">Signature:</label>
              <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
            </div>
            <div>
              <label className="block">Number of boxes checked:</label>
              <input type="number" className="w-20 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Signature Section */}
      <div className="border-t-2 border-slate-300 pt-4 text-center">
        <div className="w-48 h-12 border-b-2 border-slate-400 mx-auto"></div>
        <p className="text-sm font-medium mt-2">Sign</p>
      </div>
    </div>
  );
};

// Personal Hygiene Care Form Component
const PersonalHygieneCareForm: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 bg-white">
      {/* Form Header */}
      <div className="text-center border-b-2 border-slate-300 pb-4">
        <h1 className="text-lg font-bold text-slate-800">PRESCRIPTION FORM EXCLUSIVELY FOR NURSING CARE</h1>
        <p className="text-sm text-slate-600 mt-2">This prescription form is intended exclusively for the prescription of nursing care.</p>
        <p className="text-sm text-slate-600 mt-1">Cross out any items that do not apply.</p>
      </div>
      
      {/* Patient Information */}
      <div className="border border-slate-200 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">Patient's name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Date of birth:</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Prescriber identification:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Date:</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
        </div>
      </div>
      
      {/* Nursing Care Section */}
      <div className="border-2 border-slate-300 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">To be carried out by a private/home care nurse at the patient's home, every day, including Sundays and public holidays:</h3>
        
        <div className="space-y-4">
          {/* Hygiene Care */}
          <div>
            <h4 className="font-medium text-sm mb-2">Assistance with hygiene care:</h4>
            <div className="space-y-2 ml-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">Assistance with hygiene care twice a day</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">Complete bed hygiene care twice a day</span>
              </label>
            </div>
          </div>
          
          {/* Vital Signs Monitoring */}
          <div>
            <h4 className="font-medium text-sm mb-2">Monitoring of vital signs:</h4>
            <div className="space-y-2 ml-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">Blood pressure / Pulse</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">Temperature</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">Oxygen saturation</span>
              </label>
            </div>
          </div>
          
          {/* Weight Monitoring */}
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm font-medium">Weekly monitoring of body weight with maintenance of a weight chart</span>
            </label>
          </div>
          
          {/* Treatment Administration */}
          <div>
            <h4 className="font-medium text-sm mb-2">Preparation and administration of treatments</h4>
            <div className="space-y-2 ml-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">Capillary blood glucose monitoring and insulin injection according to medical prescription</span>
                <input type="number" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" placeholder="times" />
                <span className="text-sm">times per day</span>
              </label>
            </div>
          </div>
          
          {/* Dressing Changes */}
          <div>
            <h4 className="font-medium text-sm mb-2">Dressing changes</h4>
            <div className="space-y-2 ml-4">
              <div className="flex items-center gap-2">
                <label className="block">Location:</label>
                <input type="text" className="flex-1 h-9 border border-slate-300 rounded px-3 text-sm" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Simple</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Complex</span>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" placeholder="times" />
                <span className="text-sm">times per day / every</span>
                <input type="number" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" placeholder="days" />
                <span className="text-sm">days</span>
              </div>
            </div>
          </div>
          
          {/* Sutures/Staples Removal */}
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">Removal of sutures or staples in</span>
              <input type="number" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" placeholder="days" />
              <span className="text-sm">days</span>
            </label>
          </div>
          
          {/* Urinary Catheter Care */}
          <div>
            <div className="space-y-2 ml-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">Urinary catheter care</span>
                <input type="number" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" placeholder="times" />
                <span className="text-sm">times per day</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="text-sm">- Removal of the urinary catheter on:</div>
                <input type="date" className="w-40 h-9 border border-slate-300 rounded px-3 text-sm" />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">Monitoring of urine output</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Prescription Sections */}
      <div className="grid grid-cols-1 gap-4">
        <div className="border border-slate-200 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-2">Prescriptions not related to the recognized long-term condition (listed or unlisted) (INTERCURRENT ILLNESSES)</h4>
          <textarea className="w-full h-24 border border-slate-300 rounded p-3 text-sm resize-none" />
        </div>
        
        <div className="border border-slate-200 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-2">Prescriptions related to the treatment of the recognized long-term condition (listed or unlisted) (EXEMPTING LONG-TERM CONDITION)</h4>
          <textarea className="w-full h-24 border border-slate-300 rounded p-3 text-sm resize-none" />
        </div>
      </div>
      
      {/* Medical Certification */}
      <div className="border-2 border-slate-300 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">Medical certification</h3>
        <div className="space-y-3 text-sm">
          <p>I, the undersigned Dr. 
            <input type="text" className="w-48 h-9 border border-slate-300 rounded mx-2 px-3 text-sm" />
            , after examining Mr / Mrs / Ms 
            <input type="text" className="w-48 h-9 border border-slate-300 rounded mx-2 px-3 text-sm" />
            , certify that his/her state of health requires nursing care at home.
          </p>
          
          <div className="flex items-center gap-2">
            <label className="font-medium">Prescription for</label>
            <input type="number" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
            <span className="font-medium">days, renewable</span>
          </div>
        </div>
      </div>
      
      {/* Signature Section */}
      <div className="border-t-2 border-slate-300 pt-4 text-center">
        <div className="w-48 h-12 border-b-2 border-slate-400 mx-auto"></div>
        <p className="text-sm font-medium mt-2">Sign</p>
      </div>
    </div>
  );
};

// PCA (Pain Management) Form Component
const PCAPainManagementForm: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 bg-white">
      {/* Form Header */}
      <div className="text-center border-b-2 border-slate-300 pb-4">
        <h1 className="text-lg font-bold text-slate-800">PCA infusion prescription Forms</h1>
        <p className="text-sm text-slate-600 mt-2">TICK THE APPROPRIATE BOXES ON THE FORM</p>
      </div>
      
      {/* Prescription Type */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Prescription date:</span>
          <input type="date" className="w-40 h-9 border border-slate-300 rounded px-3 text-sm" />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">Start of home infusion therapy</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">Renewal or modification</span>
          </label>
        </div>
      </div>
      
      {/* Patient Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">PATIENT</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">Last name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">First name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Date of birth:</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Weight (kg):</label>
            <input type="number" className="w-24 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="block">Social Insurance number (NIR):</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Care related to a long-term condition (ALD)</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Prescriber Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">PRESCRIBER IDENTIFICATION</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">Last name: (automatic by Login)</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">First name: (automatic by Login)</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">Phone: (automatic by Login)</label>
            <input type="tel" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">RPPS ID: (automatic by Login)</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">*Shared directory of healthcare professionals</p>
      </div>
      
      {/* Practice/Facility Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">PRESCRIBER'S PRACTICE / FACILITY</h3>
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div>
            <label className="block">HOSPITAL name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Address:</label>
            <textarea className="w-full h-20 border border-slate-300 rounded mt-1 px-3 text-sm resize-none" />
          </div>
          <div>
            <label className="block">Geographic FINESS No.: (automatic by Login)</label>
            <input type="text" className="w-32 h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
      </div>
      
      {/* Important Notice */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm font-bold text-red-800">**This form must be accompanied by a handwritten secure prescription.</p>
      </div>
      
      {/* PCA Specific Section */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm">Forms for</h3>
        
        <div className="border-2 border-slate-300 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block">Effective from:</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>/</span>
                <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>/</span>
                <input type="text" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
              </div>
            </div>
            <div>
              <label className="block">Prescription for ……… week(s), to be renewed ……… times</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="number" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>week(s)</span>
                <input type="number" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>times</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm">
            <p className="font-medium mb-3">To be carried out at home by a home care nurse (RN), every day, including Sundays and public holidays, for PCA morphine administration.</p>
            
            <div className="space-y-2">
              <h5 className="font-medium">Nursing care to be provided:</h5>
              <div className="ml-4 space-y-2">
                <div>- Preparation and programming of a portable pump</div>
                <div>- Filling and setting up the portable pump</div>
                <div>- Connecting the infusion and starting the device</div>
                <div>- Reservoir change (flexible bag)</div>
                <div>- Stopping and removing the device</div>
                <div>- Flush / "heparinization"</div>
                <div>- Dressing change and replacement of the Huber needle once a week</div>
                <div>- Organization of infusion monitoring, care planning, and, where applicable, coordination of 24-hour monitoring services, including Saturdays, Sundays, and public holidays</div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h5 className="font-medium text-sm mb-3">Administration by continuous infusion PCA pump of:</h5>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block">Morphine hydrochloride injectable, concentration of</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="number" className="w-24 h-9 border border-slate-300 rounded px-3 text-sm" />
                  <span>mg/h</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input type="number" className="w-24 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>mg of pure morphine, i.e.</span>
                <input type="number" className="w-24 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>ml in a flexible bag with a maximum capacity of 50 ml</span>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h5 className="font-medium text-sm mb-3">Pump settings</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block">Basal rate:</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="number" className="w-24 h-9 border border-slate-300 rounded px-3 text-sm" />
                  <span>mg/h</span>
                </div>
              </div>
              <div>
                <label className="block">Bolus dose:</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="number" className="w-24 h-9 border border-slate-300 rounded px-3 text-sm" />
                  <span>mg</span>
                </div>
              </div>
              <div>
                <label className="block">Lockout period:</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="number" className="w-24 h-9 border border-slate-300 rounded px-3 text-sm" />
                  <span>minutes</span>
                </div>
              </div>
              <div>
                <label className="block">Maximum number of boluses per hour:</label>
                <input type="number" className="w-24 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4 text-sm">
            <p>To be renewed for connection 
              <input type="number" className="w-20 h-9 border border-slate-300 rounded mx-2 px-3 text-sm" />
              times per week for 28 days for administration by continuous infusion PCA pump of injectable morphine hydrochloride.
            </p>
          </div>
          
          <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block">Signature:</label>
              <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Signature Section */}
      <div className="border-t-2 border-slate-300 pt-4 text-center">
        <div className="w-48 h-12 border-b-2 border-slate-400 mx-auto"></div>
        <p className="text-sm font-medium mt-2">Sign</p>
      </div>
    </div>
  );
};

// Medical Oxygen Form Component
const MedicalOxygenForm: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 bg-white">
      {/* Form Header */}
      <div className="text-center border-b-2 border-slate-300 pb-4">
        <h1 className="text-lg font-bold text-slate-800">SHORT-TERM HOME OXYGEN THERAPY</h1>
      </div>
      
      {/* Patient Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">PATIENT</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">Last name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">First name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Date of birth:</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Weight (kg):</label>
            <input type="number" className="w-24 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="block">Social Insurance number (NIR):</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Care related to a long-term condition (ALD)</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Prescriber Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">PRESCRIBER IDENTIFICATION</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">Last name: (automatic by Login)</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">First name: (automatic by Login)</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">Phone: (automatic by Login)</label>
            <input type="tel" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">RPPS ID: (automatic by Login)</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">*Shared directory of healthcare professionals</p>
      </div>
      
      {/* Practice/Facility Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">PRESCRIBER'S PRACTICE / FACILITY</h3>
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div>
            <label className="block">HOSPITAL name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Address:</label>
            <textarea className="w-full h-20 border border-slate-300 rounded mt-1 px-3 text-sm resize-none" />
          </div>
          <div>
            <label className="block">Geographic FINESS No.: (automatic by Login)</label>
            <input type="text" className="w-32 h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
      </div>
      
      {/* Prescription Section */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm">Prescription</h3>
        
        <div className="border-2 border-slate-300 rounded-lg p-4 space-y-4">
          <div className="text-sm">
            <label className="block">Type of primary oxygen (O₂) source:</label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>stationary concentrator</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>compressed oxygen cylinder with pressure regulator and appropriate flowmeter*</span>
              </label>
            </div>
          </div>
          
          <div className="text-sm">
            <label className="block">Ambulatory cylinder:</label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>YES*</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>NO*</span>
              </label>
            </div>
          </div>
          
          <div className="text-sm">
            <label className="block">Oxygen delivery method:</label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>Oxygen nasal cannula*</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>Oxygen mask*</span>
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block">Duration:</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="number" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>hours / day / Month</span>
              </div>
            </div>
            <div>
              <label className="block">Flow rate:</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="number" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>L/min at rest and</span>
                <input type="number" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
                <span>L/min during exertion</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm">
            <label className="block">Humidifier compliant with NF EN ISO 8185 standard:</label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>YES*</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>NO*</span>
              </label>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div>- Backup source: compressed oxygen cylinder with pressure regulator and appropriate flowmeter</div>
            <div>- Mobility source: 1 small compressed oxygen cylinder with pressure regulator and appropriate flowmeter</div>
            <div>- Provision of a pulse oximeter</div>
            <div>- Non-kinking star-lumen oxygen tubing if possible</div>
          </div>
          
          <div className="text-sm">
            <label className="block">Adjust oxygen to obtain an SpO₂ ≥</label>
            <div className="flex items-center gap-2 mt-1">
              <input type="number" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
              <span>%</span>
            </div>
          </div>
          
          <div className="text-sm">
            <label className="block">Prescriber's phone number to call if contact is necessary:</label>
            <input type="tel" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          
          <div className="text-xs text-slate-500 italic">
            * Cross out any items that do not apply
          </div>
        </div>
      </div>
      
      {/* Patient Instructions */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm">PATIENT INSTRUCTIONS</h3>
        
        <div className="border-2 border-slate-300 rounded-lg p-4 space-y-4">
          <div className="text-sm">
            <p className="font-medium mb-3">It is essential to follow the instructions carefully.</p>
            <p className="mb-3">Use your oxygen daily for at least the duration indicated on your prescription.</p>
            <p className="mb-3">If oxygen comes into contact with a flame or combustible material, there is a risk of explosion, fire, and/or serious burns.</p>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-600">NEVER</span>
              <span>smoke or vape while using oxygen.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-600">NEVER</span>
              <span>smoke in the room where your oxygen is installed.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-600">NEVER</span>
              <span>cook while using oxygen.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-600">NEVER</span>
              <span>use aerosol sprays or flammable solvents near oxygen (alcohol, gasoline, etc.).</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-600">NEVER</span>
              <span>apply greasy ointment to the face and never handle the equipment with greasy hands.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-600">NEVER</span>
              <span>keep the equipment near heat sources.</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Palliative Care Section */}
      <div className="space-y-4">
        <div className="text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>HOME OXYGEN THERAPY AS PART OF PALLIATIVE CARE yes or no (box)</span>
          </label>
          <p className="text-xs text-slate-500 italic mt-1">Cross out any items that do not apply</p>
        </div>
      </div>
      
      {/* Signature Section */}
      <div className="border-t-2 border-slate-300 pt-4 text-center">
        <div className="w-48 h-12 border-b-2 border-slate-400 mx-auto"></div>
        <p className="text-sm font-medium mt-2">Sign</p>
      </div>
    </div>
  );
};

// Infusion Form Component (for both Antibiotherapy and Hydration)
const InfusionForm: React.FC<{ serviceName: string }> = ({ serviceName }) => {
  const [infusionProducts, setInfusionProducts] = useState([1]);
  
  const addInfusionProduct = () => {
    if (infusionProducts.length < 3) {
      setInfusionProducts([...infusionProducts, infusionProducts.length + 1]);
    }
  };
  
  const getFormTitle = () => {
    if (serviceName === 'Hydration Infusion') {
      return 'HYDRATION INFUSION PRESCRIPTION FORM';
    } else if (serviceName === 'Parenteral Nutrition (Central Line)') {
      return 'PARENTERAL NUTRITION (CENTRAL LINE) PRESCRIPTION FORM';
    } else if (serviceName === 'IV Therapy') {
      return 'IV THERAPY PRESCRIPTION FORM';
    } else if (serviceName === 'Pregnancy Related Care') {
      return 'PREGNANCY-RELATED CARE PRESCRIPTION FORM';
    }
    return 'ANTIBIOTHERAPY INFUSION PRESCRIPTION FORM';
  };
  
  return (
    <div className="max-w-5xl mx-auto space-y-6 bg-white">
      {/* Form Header */}
      <div className="text-center border-b-2 border-slate-300 pb-4">
        <h1 className="text-lg font-bold text-slate-800">{getFormTitle()}</h1>
        <p className="text-sm text-slate-600 mt-2">TICK THE APPROPRIATE BOXES ON THE FORM</p>
      </div>
      
      {/* Prescription Type */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Prescription date:</span>
          <input type="date" className="w-40 h-9 border border-slate-300 rounded px-3 text-sm" />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">Start of home infusion therapy</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">Renewal or modification</span>
          </label>
        </div>
      </div>
      
      {/* Patient Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">PATIENT</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">Last name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">First name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Date of birth:</label>
            <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Weight (kg):</label>
            <input type="number" className="w-24 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="block">Social Insurance number (NIR):</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Care related to a long-term condition (ALD)</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Prescriber Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">PRESCRIBER IDENTIFICATION</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block">Last name: (automatic by Login)</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">First name: (automatic by Login)</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">Phone: (automatic by Login)</label>
            <input type="tel" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
          <div>
            <label className="block">RPPS ID: (automatic by Login)</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">*Shared directory of healthcare professionals</p>
      </div>
      
      {/* Practice/Facility Section */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-4">PRESCRIBER'S PRACTICE / FACILITY</h3>
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div>
            <label className="block">HOSPITAL name:</label>
            <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
          </div>
          <div>
            <label className="block">Address:</label>
            <textarea className="w-full h-20 border border-slate-300 rounded mt-1 px-3 text-sm resize-none" />
          </div>
          <div>
            <label className="block">Geographic FINESS No.: (automatic by Login)</label>
            <input type="text" className="w-32 h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
          </div>
        </div>
      </div>
      
      {/* Infusion Products */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm">Forms for</h3>
        
        {infusionProducts.map((productNum) => (
          <div key={productNum} className="border-2 border-slate-300 rounded-lg p-4">
            <h4 className="font-bold text-sm mb-4">INFUSION PRODUCT No. {productNum}</h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm space-y-3">
              <div>
                <label className="block">Product name:</label>
                <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
              </div>
              <div>
                <label className="block">Strength (concentration):</label>
                <input type="text" className="w-full h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
              </div>
              <div>
                <label className="block">Diluent:</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="text" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
                  <span>/</span>
                  <input type="text" className="w-20 h-9 border border-slate-300 rounded px-3 text-sm" />
                  <span>ml</span>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Without Diluent</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block">Duration of one infusion administration:</label>
                <div className="flex items-center gap-2 mt-1">
                  <span>(x)</span>
                  <input type="number" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
                  <span>hour(s) and</span>
                  <input type="number" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
                  <span>minutes</span>
                </div>
              </div>
              <div>
                <label className="block">Frequency of infusion(s):</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="number" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
                  <span>per</span>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>day (a)</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Route of Access */}
            <div className="mt-4">
              <h5 className="font-bold text-sm mb-2">Route of access</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium">Central venous (CV):</p>
                  <div className="space-y-1 ml-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>implanted port</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>central catheter</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>peripherally inserted central catheter (PICC)</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Perineural</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Peripheral venous</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Subcutaneous</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Mode of Administration */}
            <div className="mt-4">
              <h5 className="font-bold text-sm mb-2">Mode of administration</h5>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Gravity</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Elastomeric diffuser</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Electric infusion pump</span>
                </label>
              </div>
            </div>
            
            {/* Additional Questions */}
            <div className="mt-4 space-y-2 text-sm">
              <div>
                <label className="block">The patient must remain ambulatory during treatment?:</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2">
                    <input type="radio" name={`ambulatory${productNum}`} className="w-4 h-4" />
                    <span>yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name={`ambulatory${productNum}`} className="w-4 h-4" />
                    <span>no</span>
                  </label>
                </div>
              </div>
              
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>If filled/prepared under the supervision of a healthcare facility, tick this box</span>
              </label>
            </div>
            
            {/* Treatment Schedule */}
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block">Start date of treatment cycle: (date «y»)</label>
                <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
              </div>
              <div>
                <label className="block">End date of treatment cycle: (date «p»)</label>
                <input type="date" className="w-40 h-9 border border-slate-300 rounded mt-1 px-3 text-sm" />
              </div>
              <div>
                <label className="block">or Treatment duration: (quantity «n»)</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="number" className="w-16 h-9 border border-slate-300 rounded px-3 text-sm" />
                  <span>days</span>
                </div>
              </div>
              <div>
                <label className="block">Total number of infusions (TNI): (Automatic)</label>
                <div className="text-xs text-slate-600 mt-1">
                  = (y-p)= «M» days. TNI= (M) x (a) or TNI =(n) x (a)
                </div>
                <input type="text" className="w-16 h-9 border border-slate-300 rounded mt-1 px-3 text-sm bg-slate-100" readOnly />
              </div>
            </div>
            
            <div className="mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>If this treatment must be infused ALONE, tick this box</span>
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
            <span>ADD a infusion Product</span>
          </button>
        )}
      </div>
      
      {/* Signature Section */}
      <div className="border-t-2 border-slate-300 pt-4 text-center">
        <div className="w-48 h-12 border-b-2 border-slate-400 mx-auto"></div>
        <p className="text-sm font-medium mt-2">Sign</p>
      </div>
    </div>
  );
};

export const FormStructureViewer: React.FC<FormStructureViewerProps> = ({
  selectedService,
  onMapService
}) => {
  const { t } = useTranslation();
  
  if (!selectedService) {
    return (
      <section className="flex-1 bg-white rounded-2xl border border-slate-200 tradingview-shadow flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50/50 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <i className="fa-solid fa-file-signature text-lg"></i>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">No Form Assigned</h2>
              <p className="text-[11px] text-slate-500">{t('forms.structuredFieldPreview')}</p>
            </div>
          </div>
          {/* <div className="flex gap-2">
            <button
              onClick={onMapService}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm border border-blue-700"
              style={{minWidth: '100px'}}
            >
              <i className="fa-solid fa-link mr-1.5"></i> Assign Form
            </button>
          </div> */}
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <div className="text-center">
            <i className="fa-solid fa-file-circle-question text-4xl mb-4"></i>
            <p className="text-sm font-medium">No form mapped for this service</p>
            <p className="text-xs text-slate-500 mt-2">This service cannot be used until a form is assigned</p>
          </div>
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
              {selectedService.formName || 'No Form Assigned'}
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
      
      <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
        {selectedService.name === 'Generic' ? (
          <div>
            {/* Read-only banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 mb-6">
              <i className="fa-solid fa-lock text-amber-600"></i>
              <p className="text-sm font-medium text-amber-800">This is read-only preview</p>
            </div>
            <GenericForm />
          </div>
        ) : selectedService.name === 'Wound Care' ? (
          <div>
            {/* Read-only banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 mb-6">
              <i className="fa-solid fa-lock text-amber-600"></i>
              <p className="text-sm font-medium text-amber-800">This is read-only preview</p>
            </div>
            <WoundCareForm />
          </div>
        ) : selectedService.name === 'CNO' ? (
          <div>
            {/* Read-only banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 mb-6">
              <i className="fa-solid fa-lock text-amber-600"></i>
              <p className="text-sm font-medium text-amber-800">This is read-only preview</p>
            </div>
            <CNOForm />
          </div>
        ) : selectedService.name === 'Artificial Nutrition' ? (
          <div>
            {/* Read-only banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 mb-6">
              <i className="fa-solid fa-lock text-amber-600"></i>
              <p className="text-sm font-medium text-amber-800">This is read-only preview</p>
            </div>
            <ArtificialNutritionForm />
          </div>
        ) : selectedService.name === 'Personal Hygiene Care' ? (
          <div>
            {/* Read-only banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 mb-6">
              <i className="fa-solid fa-lock text-amber-600"></i>
              <p className="text-sm font-medium text-amber-800">This is read-only preview</p>
            </div>
            <PersonalHygieneCareForm />
          </div>
        ) : selectedService.name === 'PCA (Pain Management)' ? (
          <div>
            {/* Read-only banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 mb-6">
              <i className="fa-solid fa-lock text-amber-600"></i>
              <p className="text-sm font-medium text-amber-800">This is read-only preview</p>
            </div>
            <PCAPainManagementForm />
          </div>
        ) : selectedService.name === 'Medical Oxygen' ? (
          <div>
            {/* Read-only banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 mb-6">
              <i className="fa-solid fa-lock text-amber-600"></i>
              <p className="text-sm font-medium text-amber-800">This is read-only preview</p>
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
              <p className="text-sm font-medium text-amber-800">This is read-only preview</p>
            </div>
            <InfusionForm serviceName={selectedService.name} />
          </div>
        ) : selectedService.formName ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Read-only banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3">
              <i className="fa-solid fa-lock text-amber-600"></i>
              <p className="text-sm font-medium text-amber-800">This is read-only preview</p>
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
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-400">
              <i className="fa-solid fa-file-circle-question text-4xl mb-4"></i>
              <p className="text-sm font-medium">No form mapped for this service</p>
              <p className="text-xs text-slate-500 mt-2">This service cannot be used until a form is assigned</p>
              {/* <button
                onClick={onMapService}
                className="mt-4 px-4 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:bg-primary/90 transition-all shadow-sm"
              >
                <i className="fa-solid fa-link mr-1.5"></i> Assign Form
              </button> */}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
