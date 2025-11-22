import * as CryptoJS from 'crypto-js';


export function encryptMobile(text: string): string {
    return CryptoJS.AES.encrypt(text, process.env.CRYPTO_SECRET_KEY).toString();
}

export function decryptMobile(encryptedText: string): string {
    const bytes  = CryptoJS.AES.decrypt(encryptedText, process.env.CRYPTO_SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}
