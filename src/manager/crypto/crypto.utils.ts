import {
  BinaryLike,
  BinaryToTextEncoding,
  Cipher,
  Decipher,
  createCipheriv,
  createDecipheriv,
  createHash,
} from "crypto";

export function sha512(data: BinaryLike): Buffer;
export function sha512(
  data: BinaryLike,
  outEncoding: BinaryToTextEncoding
): string;
export function sha512(
  data: BinaryLike,
  outEncoding?: BinaryToTextEncoding
): Buffer | string {
  const hasher = createHash("sha512");
  const hashedData = hasher.update(data);
  return outEncoding ? hashedData.digest(outEncoding) : hashedData.digest();
}

function getKeyAndIv(password: string) {
  const hashPass = sha512(password, "hex");
  const key = hashPass.substring(0, 32);
  const iv = hashPass.substring(32, 48);
  return { key, iv };
}

export function encryptor(password: string): Cipher {
  const { key, iv } = getKeyAndIv(password);
  return createCipheriv("aes-256-cbc", key, iv);
}

export function decryptor(password: string): Decipher {
  const { key, iv } = getKeyAndIv(password);
  return createDecipheriv("aes-256-cbc", key, iv);
}
