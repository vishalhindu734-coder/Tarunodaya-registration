export interface VillageEntry {
  gram: string; // Basti name in Hindi
  mandal: string; // Upnagar name in Hindi
  gramEn: string; // Basti name in English
  mandalEn: string; // Upnagar name in English
  formatted: string; // Display text
  altSearch: string;
}

export const MANDAL_VILLAGE_DATA: VillageEntry[] = [
  // श्री कृष्ण उपनगर
  { gram: 'राम', mandal: 'श्री कृष्ण', gramEn: 'Ram', mandalEn: 'Shri Krishna', formatted: 'राम - श्री कृष्ण (Ram - Shri Krishna)', altSearch: 'Ram Shri Krishna' },
  { gram: 'अर्जुन', mandal: 'श्री कृष्ण', gramEn: 'Arjun', mandalEn: 'Shri Krishna', formatted: 'अर्जुन - श्री कृष्ण (Arjun - Shri Krishna)', altSearch: 'Arjun Shri Krishna' },
  { gram: 'प्रताप', mandal: 'श्री कृष्ण', gramEn: 'Pratap', mandalEn: 'Shri Krishna', formatted: 'प्रताप - श्री कृष्ण (Pratap - Shri Krishna)', altSearch: 'Pratap Shri Krishna' },
  { gram: 'कृष्ण', mandal: 'श्री कृष्ण', gramEn: 'Krishna', mandalEn: 'Shri Krishna', formatted: 'कृष्ण - श्री कृष्ण (Krishna - Shri Krishna)', altSearch: 'Krishna Shri Krishna' },
  { gram: 'गोविंद', mandal: 'श्री कृष्ण', gramEn: 'Govind', mandalEn: 'Shri Krishna', formatted: 'गोविंद - श्री कृष्ण (Govind - Shri Krishna)', altSearch: 'Govind Shri Krishna' },
  { gram: 'शिवाजी', mandal: 'श्री कृष्ण', gramEn: 'Shivaji', mandalEn: 'Shri Krishna', formatted: 'शिवाजी - श्री कृष्ण (Shivaji - Shri Krishna)', altSearch: 'Shivaji Shri Krishna' },
  { gram: 'घेल', mandal: 'श्री कृष्ण', gramEn: 'Ghel', mandalEn: 'Shri Krishna', formatted: 'घेल - श्री कृष्ण (Ghel - Shri Krishna)', altSearch: 'Ghel Shri Krishna' },

  // वीर सावरकर उपनगर
  { gram: 'भगतसिंह', mandal: 'वीर सावरकर', gramEn: 'Bhagat Singh', mandalEn: 'Veer Savarkar', formatted: 'भगतसिंह - वीर सावरकर (Bhagat Singh - Veer Savarkar)', altSearch: 'Bhagat Singh Bhagatsingh Veer Savarkar' },
  { gram: 'अभिमन्यु', mandal: 'वीर सावरकर', gramEn: 'Abhimanyu', mandalEn: 'Veer Savarkar', formatted: 'अभिमन्यु - वीर सावरकर (Abhimanyu - Veer Savarkar)', altSearch: 'Abhimanyu Veer Savarkar' },
  { gram: 'सावरकर', mandal: 'वीर सावरकर', gramEn: 'Savarkar', mandalEn: 'Veer Savarkar', formatted: 'सावरकर - वीर सावरकर (Savarkar - Veer Savarkar)', altSearch: 'Savarkar Veer Savarkar' },
  { gram: 'गोपाल', mandal: 'वीर सावरकर', gramEn: 'Gopal', mandalEn: 'Veer Savarkar', formatted: 'गोपाल - वीर सावरकर (Gopal - Veer Savarkar)', altSearch: 'Gopal Veer Savarkar' },
  { gram: 'सुल्तानपुर', mandal: 'वीर सावरकर', gramEn: 'Sultanpur', mandalEn: 'Veer Savarkar', formatted: 'सुल्तानपुर - वीर सावरकर (Sultanpur - Veer Savarkar)', altSearch: 'Sultanpur Veer Savarkar' },
  { gram: 'मंडोर', mandal: 'वीर सावरकर', gramEn: 'Mandor', mandalEn: 'Veer Savarkar', formatted: 'मंडोर - वीर सावरकर (Mandor - Veer Savarkar)', altSearch: 'Mandor Veer Savarkar' }
];

export const MANDALS_LIST: string[] = Array.from(
  new Set(MANDAL_VILLAGE_DATA.map((item) => item.mandal))
);
