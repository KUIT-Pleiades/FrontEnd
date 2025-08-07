export function getImage(itemName: string) {
  const PINATA_ENDPOINT = import.meta.env.VITE_PINATA_ENDPOINT;
  const requestPoint = `${PINATA_ENDPOINT}${itemName}`;
  return requestPoint;
}
