import { YUVA_SANGAM_EVENT } from '../constants/eventDetails';

export function getGoogleCalendarUrl(): string {
  const title = encodeURIComponent("तरुणोदय : अम्बाला");
  const details = encodeURIComponent(
    `तरुणोदय : अम्बाला\n\n` +
    `📅 Date: 30 August 2026\n` +
    `⏰ Time: 03:00 PM to 06:30 PM\n` +
    `📍 Venue: ${YUVA_SANGAM_EVENT.venue}, ${YUVA_SANGAM_EVENT.address}\n\n` +
    `🔔 EVENT REMINDERS:\n` +
    `• 1 Day Before (29 Aug 2026 at 03:00 PM)\n` +
    `• 1 Hour Before (30 Aug 2026 at 02:00 PM)\n` +
    `• 30 Minutes Before (30 Aug 2026 at 02:30 PM)`
  );
  const location = encodeURIComponent(
    `${YUVA_SANGAM_EVENT.venue}, ${YUVA_SANGAM_EVENT.address}, ${YUVA_SANGAM_EVENT.city}, ${YUVA_SANGAM_EVENT.state}`
  );

  // August 30, 2026: 03:00 PM IST to 06:30 PM IST
  // 03:00 PM IST = 09:30:00 UTC
  // 06:30 PM IST = 13:00:00 UTC
  const dates = "20260830T093000Z/20260830T130000Z";

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

export function getOutlookCalendarUrl(): string {
  const title = encodeURIComponent("तरुणोदय : अम्बाला");
  const details = encodeURIComponent(
    `तरुणोदय : अम्बाला\nDate: 30 August 2026\nTime: 03:00 PM to 06:30 PM\nVenue: ${YUVA_SANGAM_EVENT.venue}, ${YUVA_SANGAM_EVENT.address}.\nReminders: 1 day before, 1 hour before, 30 minutes before.`
  );
  const location = encodeURIComponent(
    `${YUVA_SANGAM_EVENT.venue}, ${YUVA_SANGAM_EVENT.address}, ${YUVA_SANGAM_EVENT.city}, ${YUVA_SANGAM_EVENT.state}`
  );

  const startdt = "2026-08-30T15:00:00+05:30";
  const enddt = "2026-08-30T18:30:00+05:30";

  return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&startdt=${startdt}&enddt=${enddt}&body=${details}&location=${location}`;
}

export function downloadIcsFile(): void {
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Tarunodaya Ambala 2026//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:तरुणोदय : अम्बाला
DESCRIPTION:तरुणोदय : अम्बाला\\nDate: 30 August 2026\\nTime: 03:00 PM to 06:30 PM\\nVenue: ${YUVA_SANGAM_EVENT.venue}\\, ${YUVA_SANGAM_EVENT.address}\\n\\nReminders:\\n- 1 day before\\n- 1 hour before\\n- 30 minutes before
LOCATION:${YUVA_SANGAM_EVENT.venue}\\, ${YUVA_SANGAM_EVENT.address}\\, ${YUVA_SANGAM_EVENT.city}\\, ${YUVA_SANGAM_EVENT.state}
DTSTART:20260830T093000Z
DTEND:20260830T130000Z
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:Reminder: तरुणोदय : अम्बाला is tomorrow at 3:00 PM!
END:VALARM
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:Reminder: तरुणोदय : अम्बाला starts in 1 hour at 3:00 PM!
END:VALARM
BEGIN:VALARM
TRIGGER:-PT30M
ACTION:DISPLAY
DESCRIPTION:Reminder: तरुणोदय : अम्बाला starts in 30 minutes!
END:VALARM
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Tarunodaya_Ambala_2026.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

