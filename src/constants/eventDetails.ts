import { EventInfo } from '../types';

export const YUVA_SANGAM_EVENT: EventInfo = {
  title: "तरुणोदय : अम्बाला",
  organizer: "Tarunodaya Ambala",
  date: "2026-08-30",
  formattedDate: "Sunday, 30 August 2026",
  time: "03:00 PM - 06:00 PM",
  venue: "Shri Atmanand Jain College",
  address: "Ambala",
  landmark: "Near College Gate, Ambala",
  city: "Ambala",
  state: "Haryana",
};

export interface VillagePreset {
  village: string;
  subDivision: string;
}

export const AMBALA_VILLAGES_PRESETS: VillagePreset[] = [
  { village: "Mathedi", subDivision: "Ambala Sadar" },
  { village: "Sonda", subDivision: "Ambala Sadar" },
  { village: "Ambala Cantt", subDivision: "Ambala Sadar" },
  { village: "Ambala City", subDivision: "Ambala City" },
  { village: "Naggal", subDivision: "Ambala City" },
  { village: "Jansui", subDivision: "Ambala City" },
  { village: "Durana", subDivision: "Ambala City" },
  { village: "Barara", subDivision: "Barara" },
  { village: "Mullana", subDivision: "Barara" },
  { village: "Saha", subDivision: "Saha" },
  { village: "Naraingarh", subDivision: "Naraingarh" },
  { village: "Shahzadpur", subDivision: "Naraingarh" },
  { village: "Patreheri", subDivision: "Ambala Sadar" },
  { village: "Naneola", subDivision: "Ambala City" },
  { village: "Kardhan", subDivision: "Ambala Sadar" },
  { village: "Boh", subDivision: "Ambala Sadar" },
];

export const INITIAL_DEMO_REGISTRATIONS: any[] = [];
