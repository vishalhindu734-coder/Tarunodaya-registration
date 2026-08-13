import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Registration } from '../types';
import { saveRegistration, calculateAgeYears, getAgeNumber, getRegistrationsByPhone, getAgeCategoryDetails } from '../utils/storage';
import { MANDAL_VILLAGE_DATA, VillageEntry, MANDALS_LIST } from '../constants/villages';
import { FastDobInput } from './FastDobInput';
import confetti from 'canvas-confetti';
import { User, Calendar, MapPin, Phone, FileText, ShieldCheck, ArrowRight, RotateCcw, Check, Building2, Sparkles, Search, AlertTriangle, X, ChevronDown } from 'lucide-react';

interface RegistrationFormProps {
  onSuccess: (reg: Registration) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  
  // Village & Mandal State
  const [villageInput, setVillageInput] = useState('');
  const [mandalInput, setMandalInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const [phone, setPhone] = useState('');
  const [otherInfo, setOtherInfo] = useState('');
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regretState, setRegretState] = useState<{ name: string; age: number | null } | null>(null);

  // Duplicate Phone Warning State
  const [existingPassesWarning, setExistingPassesWarning] = useState<{
    passes: Registration[];
    pendingData: {
      name: string;
      dob: string;
      village: string;
      subDivision?: string;
      phone: string;
      otherInfo: string;
    };
  } | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter village entries based on Basti input (matching exclusively against Hindi and English Basti name)
  const cleanQuery = villageInput.trim().toLowerCase();
  const matchingVillages = useMemo(() => {
    if (!cleanQuery) return MANDAL_VILLAGE_DATA;
    return MANDAL_VILLAGE_DATA.filter((item) => {
      const gHi = item.gram.toLowerCase();
      const gEn = (item.gramEn || '').toLowerCase();
      return (
        gHi.includes(cleanQuery) ||
        gEn.includes(cleanQuery)
      );
    });
  }, [cleanQuery]);

  const handleVillageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setVillageInput(val);
    setIsDropdownOpen(true);

    if (!val.trim()) {
      setMandalInput('');
      return;
    }

    // If exact match found in database while typing, sync mandal
    const exactMatch = MANDAL_VILLAGE_DATA.find(
      (item) =>
        item.gram.toLowerCase() === val.trim().toLowerCase() ||
        (item.gramEn && item.gramEn.toLowerCase() === val.trim().toLowerCase())
    );
    if (exactMatch) {
      setMandalInput(exactMatch.mandal);
    }
  };

  const handleSelectVillage = (entry: VillageEntry) => {
    setVillageInput(entry.gram);
    setMandalInput(entry.mandal);
    setIsDropdownOpen(false);
    setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 50);
  };

  const resetForm = () => {
    setName('');
    setDob('');
    setVillageInput('');
    setMandalInput('');
    setIsDropdownOpen(false);
    setPhone('');
    setOtherInfo('');
    setError('');
    setIsSubmitting(false);
    setExistingPassesWarning(null);
    setRegretState(null);
  };

  const executeSaveRegistration = async (data: {
    name: string;
    dob: string;
    village: string;
    subDivision?: string;
    phone: string;
    otherInfo: string;
  }) => {
    setIsSubmitting(true);
    setExistingPassesWarning(null);

    try {
      // Save attendee registration details directly to cloud and local storage
      const newReg = await saveRegistration({
        name: data.name,
        dob: data.dob,
        village: data.village,
        subDivision: data.subDivision,
        phone: data.phone,
        otherInfo: data.otherInfo,
      });

      setIsSubmitting(false);

      const calculatedAge = getAgeNumber(data.dob);
      const isEligible = calculatedAge !== null && calculatedAge >= 15 && calculatedAge <= 40;

      if (isEligible) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D97706', '#EA580C', '#B45309', '#78350F'],
        });

        // Clear form inputs so fresh registration starts completely clean
        resetForm();

        onSuccess(newReg);
      } else {
        setRegretState({
          name: data.name,
          age: calculatedAge,
        });
      }
    } catch (err) {
      console.error('Registration save error:', err);
      setIsSubmitting(false);
      setError('An error occurred while saving registration. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const finalVillage = villageInput.trim();
    const finalMandal = mandalInput.trim();

    if (!cleanName || cleanName.length < 2) {
      setError('Please enter your full name.');
      return;
    }

    if (!dob) {
      setError('Please select your Date of Birth.');
      return;
    }

    if (!finalVillage) {
      setError('Please enter or select your Basti.');
      return;
    }

    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (!digitsOnly || digitsOnly.length < 10) {
      setError('Please enter a valid 10-digit mobile contact number.');
      return;
    }

    let formattedPhone = cleanPhone;
    if (digitsOnly.length === 10 && !cleanPhone.startsWith('+')) {
      formattedPhone = `+91 ${digitsOnly.slice(0, 5)} ${digitsOnly.slice(5)}`;
    }

    // Check if phone number is already registered with existing passes
    const existingPasses = getRegistrationsByPhone(cleanPhone);
    if (existingPasses.length > 0) {
      setExistingPassesWarning({
        passes: existingPasses,
        pendingData: {
          name: cleanName,
          dob,
          village: finalVillage,
          subDivision: finalMandal || undefined,
          phone: formattedPhone,
          otherInfo: otherInfo.trim(),
        },
      });
      return;
    }

    await executeSaveRegistration({
      name: cleanName,
      dob,
      village: finalVillage,
      subDivision: finalMandal || undefined,
      phone: formattedPhone,
      otherInfo: otherInfo.trim(),
    });
  };

  // Render regret message after capturing details if user is outside 15-35 age range
  if (regretState) {
    return (
      <div className="bg-gradient-to-b from-amber-50/90 via-white to-orange-50/40 rounded-2xl sm:rounded-3xl border border-amber-200/90 shadow-md p-5 sm:p-7 text-center relative overflow-hidden animate-fade-in">
        <div className="w-12 h-12 bg-amber-100 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-3 text-amber-800 shadow-2xs">
          <ShieldCheck className="w-6 h-6 text-orange-600" />
        </div>

        <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 inline-block mb-2">
          Details Recorded • Pass Criteria Notice
        </span>

        <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
          Registration Recorded
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto mb-4 leading-relaxed">
          Thank you <strong className="text-slate-900 font-bold">{regretState.name}</strong>. Your attendee details have been captured and recorded in our system. However, official event entry passes are generated for <strong className="text-orange-700 font-bold">male youth aged between 15 and 40 years</strong>.
        </p>

        <div className="bg-white border border-amber-200/80 rounded-xl p-3 max-w-sm mx-auto mb-5 text-left text-xs space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-700 font-medium">
            <span>Registration Status:</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Details Captured
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-700 font-medium">
            <span>Attendee Name:</span>
            <span className="font-bold text-slate-900">{regretState.name}</span>
          </div>
          <div className="flex items-center justify-between text-slate-700 font-medium">
            <span>Calculated Age:</span>
            <span className="font-black font-mono text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {regretState.age !== null ? `${regretState.age} Years` : 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-700 font-medium border-t border-slate-100 pt-1.5">
            <span>Pass Generation Criteria:</span>
            <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              15 to 40 Years (5 Categories)
            </span>
          </div>
        </div>

        <button
          onClick={resetForm}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-md cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>Register Another Candidate</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-indigo-50/70 via-white to-amber-50/40 rounded-2xl sm:rounded-3xl border border-indigo-200/90 shadow-md shadow-indigo-950/5 p-4 sm:p-7 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between mb-3.5 pb-2.5 sm:pb-3.5 border-b border-indigo-100/80 gap-2">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-tiro text-indigo-900 bg-indigo-100/90 border border-indigo-200 px-2.5 py-0.5 rounded-full tracking-wider">
              युवा शक्ति • राष्ट्र निर्माण
            </span>
          </div>
          <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Tarunodaya Registration Form</span>
            <span className="text-indigo-900 font-tiro text-sm sm:text-base font-normal">| तरुणोदय</span>
          </h2>
          <p className="text-[11px] text-slate-600 font-medium mt-0.5">
            Fill attendee details to generate your verified Tarunodaya 2026 pass. <span className="font-bold text-orange-700">(Invited: Male youth aged 15 to 40 years)</span>
          </p>
        </div>

        {(name || dob || villageInput || phone || otherInfo) && (
          <button
            type="button"
            onClick={resetForm}
            className="px-2.5 py-1 bg-indigo-100/80 hover:bg-indigo-200 text-indigo-950 border border-indigo-300 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all shrink-0 cursor-pointer"
            title="Clear all form fields to start fresh"
          >
            <RotateCcw className="w-3 h-3 text-indigo-800" />
            <span>Clear</span>
          </button>
        )}
      </div>


      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {error && (
          <div className="p-2.5 sm:p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            {error}
          </div>
        )}

        {/* Grid layout for fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* 1) Name Field */}
          <div className="sm:col-span-2">
            <label htmlFor="user-name" className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-950/80 mb-1">
              1) Full Name <span className="text-orange-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-600/70">
                <User className="w-4 h-4" />
              </div>
              <input
                id="user-name"
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-indigo-50/40 border border-indigo-200/90 rounded-xl text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* 2) Date of Birth Field (Fast Keyboard Entry) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-950/80">
                2) Date of Birth (जन्म तिथि) <span className="text-orange-600">*</span>
              </label>
            </div>
            <FastDobInput
              value={dob}
              onChange={(iso) => setDob(iso)}
            />
          </div>

          {/* 3) Basti & Upnagar Auto-complete Field */}
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Basti Field */}
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="village-input" className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-950/80">
                  3) Basti (बस्ती) <span className="text-orange-600">*</span>
                </label>
                <span className="text-[9px] font-bold text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200">
                  {matchingVillages.length} {matchingVillages.length === 1 ? 'option' : 'options'}
                </span>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-600/70">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="village-input"
                  type="text"
                  required
                  placeholder="Select or search Basti (e.g. Ram, Arjun, Bhagatsingh...)"
                  value={villageInput}
                  onChange={handleVillageInputChange}
                  onFocus={() => setIsDropdownOpen(true)}
                  onClick={() => setIsDropdownOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (matchingVillages.length > 0) {
                        handleSelectVillage(matchingVillages[0]);
                      } else {
                        setIsDropdownOpen(false);
                        phoneInputRef.current?.focus();
                      }
                    } else if (e.key === 'Tab' && !e.shiftKey) {
                      if (matchingVillages.length > 0 && isDropdownOpen) {
                        handleSelectVillage(matchingVillages[0]);
                      } else {
                        setIsDropdownOpen(false);
                      }
                    }
                  }}
                  className="w-full pl-9 pr-14 py-2 sm:py-2.5 bg-indigo-50/40 border border-indigo-200/90 rounded-xl text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-700 hover:text-indigo-950 transition-colors cursor-pointer"
                  title="Toggle Basti dropdown"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Dynamic Dropdown List */}
              {isDropdownOpen && (
                <div className="absolute z-30 left-0 right-0 mt-1.5 bg-white border border-indigo-300 rounded-2xl shadow-xl max-h-60 overflow-y-auto divide-y divide-indigo-100/60 animate-fade-in">
                  <div className="p-2 bg-indigo-50/90 sticky top-0 z-10 border-b border-indigo-200/60 text-[10px] font-bold text-indigo-900 uppercase tracking-wider flex items-center justify-between">
                    <span>Select Basti (Basti - Upnagar)</span>
                    <span className="text-[9px] font-mono text-indigo-700">Click to choose</span>
                  </div>
                  {matchingVillages.length > 0 ? (
                    matchingVillages.map((item, idx) => (
                      <button
                        key={`${item.gram}-${item.mandal}-${idx}`}
                        type="button"
                        onClick={() => handleSelectVillage(item)}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-indigo-100/70 text-xs text-slate-800 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <span className="font-bold text-slate-900 group-hover:text-indigo-950">
                          {item.formatted}
                        </span>
                        <span className="text-[10px] font-semibold text-indigo-900 bg-indigo-100/90 px-2 py-0.5 rounded border border-indigo-200/70 shrink-0 ml-2">
                          Upnagar: {item.mandal}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-500 italic">
                      No matching basti found for "{villageInput}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Upnagar Field - Auto-filled & skipped on Tab */}
            <div>
              <label htmlFor="mandal-input" className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-950/80 mb-1">
                4) Upnagar (उपनगर) <span className="text-[9px] text-indigo-700 font-normal ml-1">(Auto-filled)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-600/70">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  id="mandal-input"
                  type="text"
                  tabIndex={-1}
                  readOnly
                  placeholder="Auto-filled Upnagar Name"
                  value={mandalInput}
                  onChange={(e) => setMandalInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-indigo-100/30 border border-indigo-200/90 rounded-xl text-slate-900 text-xs sm:text-sm font-bold focus:outline-none cursor-default select-none"
                />
              </div>
              <p className="text-[10px] text-indigo-950/60 font-medium mt-1">
                Automatically assigned from Basti selection
              </p>
            </div>
          </div>

          {/* 5) Mobile Number Field */}
          <div>
            <label htmlFor="user-phone" className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-950/80 mb-1">
              5) Mobile Number <span className="text-orange-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-600/70">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="user-phone"
                ref={phoneInputRef}
                type="tel"
                required
                placeholder="10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-indigo-50/40 border border-indigo-200/90 rounded-xl text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* 6) Additional Info Field (Optional) */}
          <div>
            <label htmlFor="user-info" className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-950/80 mb-1">
              6) Additional Note <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-600/70">
                <FileText className="w-4 h-4" />
              </div>
              <input
                id="user-info"
                type="text"
                placeholder="e.g. Student, Volunteer"
                value={otherInfo}
                onChange={(e) => setOtherInfo(e.target.value)}
                className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-indigo-50/40 border border-indigo-200/90 rounded-xl text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <span className="flex items-center gap-1 font-semibold text-indigo-900">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            Verified entry pass • Males 15–40 Years
          </span>
          <span className="font-mono text-slate-500">Aug 30, 2026</span>
        </div>

        {/* Submit Button */}
        <button
          id="btn-submit-registration"
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-orange-600 via-amber-600 to-indigo-700 hover:from-orange-500 hover:to-indigo-800 text-white rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Registering Attendee...</span>
            </div>
          ) : (
            <>
              <span>Complete Registration & Generate Pass</span>
              <ArrowRight className="w-4 h-4 text-amber-200" />
            </>
          )}
        </button>
      </form>

      {/* Duplicate Registration Warning Dialogue */}
      {existingPassesWarning && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-indigo-200 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative space-y-4">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 border border-indigo-300 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <AlertTriangle className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                  Mobile Number Already Registered
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
                  Mobile number <strong className="text-slate-900 font-mono font-bold">{existingPassesWarning.pendingData.phone}</strong> is already registered with {existingPassesWarning.passes.length} pass{existingPassesWarning.passes.length > 1 ? 'es' : ''}:
                </p>
              </div>
            </div>

            {/* List View of existing registrations */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {existingPassesWarning.passes.map((pass) => {
                const catDetails = getAgeCategoryDetails(pass.dob);
                return (
                  <div
                    key={pass.ticketId}
                    className="bg-indigo-50/70 border border-indigo-200/90 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                          {pass.name}
                        </span>
                        <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-indigo-200/80 text-indigo-950 border border-indigo-300 shrink-0">
                          #{pass.ticketId}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium truncate mt-0.5 flex items-center gap-1.5">
                        {pass.village && <span>{pass.village}</span>}
                        {pass.subDivision && <span>({pass.subDivision})</span>}
                        {catDetails && <span className="font-bold text-indigo-800">• {catDetails.shortWarriorName}</span>}
                      </p>
                    </div>

                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                      pass.checkedIn ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                    }`}>
                      {pass.checkedIn ? 'Checked-In' : 'Ready'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 font-medium">
              Would you like to proceed and generate a new pass for <strong className="text-slate-900 font-bold">{existingPassesWarning.pendingData.name}</strong> anyway?
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setExistingPassesWarning(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeSaveRegistration(existingPassesWarning.pendingData)}
                className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-indigo-700 hover:from-orange-500 hover:to-indigo-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer active:scale-95"
              >
                Proceed & Generate Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




