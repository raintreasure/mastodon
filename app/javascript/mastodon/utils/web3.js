export function minifyAddress(address) {
  if(address.length < 16) return address;
  const start = address.slice(0, 7);
  const end = address.slice(address.length - 7);
  return `${start}...${end}`;
}
