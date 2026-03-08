/**
 * Generate a PromptPay QR Code payload string (EMV QR Spec)
 * Compatible with Thai banking apps
 */

function crc16(data: string): string {
    let crc = 0xffff;
    for (let i = 0; i < data.length; i++) {
        crc ^= data.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = ((crc << 1) ^ 0x1021) & 0xffff;
            } else {
                crc = (crc << 1) & 0xffff;
            }
        }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

function tlv(tag: string, value: string): string {
    const len = value.length.toString().padStart(2, '0');
    return `${tag}${len}${value}`;
}

/**
 * Generate PromptPay QR payload for a phone number and amount
 * @param phone Thai phone number e.g. "0616900908"
 * @param amount Amount in THB (e.g. 435)
 */
export function generatePromptPayPayload(phone: string, amount: number): string {
    // Format phone: 0616900908 -> 0066616900908
    const normalized = phone.replace(/^0/, '').replace(/[^0-9]/g, '');
    const promptPayId = `0066${normalized}`;

    const merchantAccount =
        tlv('00', 'A000000677010111') +
        tlv('01', promptPayId);

    let payload =
        tlv('00', '01') +          // Payload Format Indicator
        tlv('01', '12') +          // One-time use
        tlv('29', merchantAccount) + // Merchant Account Info
        tlv('53', '764') +         // THB currency
        tlv('54', amount.toFixed(2)) + // Amount
        tlv('58', 'TH') +          // Country Code
        '6304';                     // CRC placeholder

    payload += crc16(payload);
    return payload;
}
