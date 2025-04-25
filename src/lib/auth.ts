import crypto from 'crypto';

export const generateSalt = (): string => {
  return crypto.randomBytes(16).toString('hex').normalize();
}

export const gethashedPassword = (password: string, salt: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password.normalize(), salt, 64, (err, hash) => {
      if (err) reject(err)
      resolve(hash.toString('hex').normalize())
    })
  })
}

export const checkCredential = async (password: string, hashedPassword: string, salt: string) => {
  const formHashPassword = await gethashedPassword(password, salt)
  return formHashPassword === hashedPassword
}