import crypto from 'crypto'

const generateDailyToken = (businessId) => {
  const today = new Date().toISOString().split("T")[0]; // e.g., "2025-03-23"
  const hash = crypto
    .createHmac("sha256", process.env.QR_CODE_SECRET)
    .update(today + businessId)
    .digest("hex")
    .slice(0, 10); // Shorten for simplicity
  return `${today}.${hash}`;
};

export default generateDailyToken