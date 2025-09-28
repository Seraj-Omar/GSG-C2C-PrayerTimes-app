export async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("API Error:", err.message);
    throw new Error("Failed to load data. Please try again.");
  }
}

export function formatCountdown(ms) {
  let totalSec = Math.floor(ms / 1000);
  let h = Math.floor(totalSec / 3600);
  let m = Math.floor((totalSec % 3600) / 60);
  let s = totalSec % 60;
  return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
}

export function getNextPrayer(prayers) {
  const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const now = new Date();
   // now.setHours(23, 30, 0, 0);
  const prayerEntries = Object.entries(prayers);
  
  const prayerTimes = prayerEntries.filter(([name]) => prayerNames.includes(name)).map(([name, timeStr]) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const prayerTime = new Date();
    prayerTime.setHours(hours, minutes, 0, 0);
    
    return {
      name,
      time: timeStr,
      datetime: prayerTime
    };
  });

  for (let prayer of prayerTimes) {
    if (prayer.datetime > now) {
      return {
        name: prayer.name,
        time: prayer.time,
        remaining: prayer.datetime - now,
        isTomorrow: false
      };
    }
  }

  if (prayerTimes.length > 0) {
    const firstPrayerTomorrow = new Date(prayerTimes[0].datetime);
    firstPrayerTomorrow.setDate(firstPrayerTomorrow.getDate() + 1);
    
    return {
      name: prayerTimes[0].name,
      time: prayerTimes[0].time,
      remaining: firstPrayerTomorrow - now,
      isTomorrow: true
    };
  }

  return null;
}