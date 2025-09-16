function convertHoursToDHM(hours: number): string {
    const totalSeconds = Math.round(hours * 3600); // 시간 → 초
    const days = Math.floor(totalSeconds / (24 * 3600));
    const remainingAfterDays = totalSeconds % (24 * 3600);
    const hrs = Math.floor(remainingAfterDays / 3600);
    const remainingAfterHours = remainingAfterDays % 3600;
    const mins = Math.floor(remainingAfterHours / 60);
    const secs = remainingAfterHours % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}일`);
    if (hrs > 0) parts.push(`${hrs}시간`);
    if (mins > 0) parts.push(`${mins}분`);
    if (secs > 0) parts.push(`${secs}초`);

    return parts.join(" ");
}

export default convertHoursToDHM;
