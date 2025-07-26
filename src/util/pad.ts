function pad(n: number): string {
  const absNum = Math.abs(n);
  if (absNum < 10) {
    return n < 0 ? `-0${absNum}` : `0${absNum}`;
  }

  return String(n);
}

export default pad;
