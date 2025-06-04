import * as jalaali from 'jalaali-js';

export function toJalaliDateTimeString(date: Date | string): string | null {
  if (!date) return null;
  const d = new Date(date);

  const { jy, jm, jd } = jalaali.toJalaali(
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
  );
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  const ss = String(d.getUTCSeconds()).padStart(2, '0');
  return `${jy}-${String(jm).padStart(2, '0')}-${String(jd).padStart(2, '0')}T${hh}:${mm}:${ss}`;
}

export function mapTimeLogToJalaliClock(log: any): any {
  if (!log) return log;
  return {
    ...log,
    clockIn: log.clockIn ? toJalaliDateTimeString(log.clockIn) : null,
    clockOut: log.clockOut ? toJalaliDateTimeString(log.clockOut) : null,
  };
}

export function jalaliDateTimeToGregorian(dateTime: string): string {
  const [date, time = '00:00'] = dateTime.split('T');
  const [jy, jm, jd] = date.split('-').map(Number);
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
  let isoTime = time;
  if (/^\d{2}:\d{2}$/.test(time)) {
    isoTime += ':00';
  }
  return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(
    2,
    '0',
  )}T${isoTime}Z`;
}

export function jalaliToGregorianString(
  jy: number,
  jm: number,
  jd: number,
): string {
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
  return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
}
