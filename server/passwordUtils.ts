import { execSync } from 'child_process';
import path from 'path';

export function hashPassword(password: string): string {
  const scriptPath = path.join(__dirname, 'hash_utils.py');
  const result = execSync(`python3 ${scriptPath} hash "${password.replace(/"/g, '\\"')}"`).toString().trim();
  return result;
}

export function verifyPassword(password: string, hashed: string): boolean {
  const scriptPath = path.join(__dirname, 'hash_utils.py');
  const result = execSync(`python3 ${scriptPath} check "${password.replace(/"/g, '\\"')}" "${hashed.replace(/"/g, '\\"')}"`).toString().trim();
  return result === 'true';
}
