import argon2 from "argon2"; // https://www.npmjs.com/package/argon2

// Hash a plaintext password with Argon2id
export async function hashPassword(plain: string): Promise<string> {
  return await argon2.hash(plain, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3,
    parallelism: 1
  });
}

// Verify function must accept a single object { hash, password }
export async function verifyPassword(data: { hash: string; password: string }): Promise<boolean> {
  return await argon2.verify(data.hash, data.password);
}
