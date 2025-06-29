function convertHoursToDHM(hours: number): string {
    const totalMinutes = Math.round(hours * 60);
    const days = Math.floor(totalMinutes / (24 * 60));
    const remainingMinutesAfterDays = totalMinutes % (24 * 60);
    const hrs = Math.floor(remainingMinutesAfterDays / 60);
    const mins = remainingMinutesAfterDays % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}일`);
    if (hrs > 0) parts.push(`${hrs}시간`);
    if (mins > 0) parts.push(`${mins}분`);

    return parts.join(" ");
}

export default convertHoursToDHM;
