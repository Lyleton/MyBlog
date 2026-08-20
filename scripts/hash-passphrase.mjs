#!/usr/bin/env node
// 用法: node scripts/hash-passphrase.mjs [口令]（省略则从 stdin 读取，避免留在 shell 历史）
import { createInterface } from 'node:readline'
import { randomBytes, scryptSync } from 'node:crypto'

async function readPassphrase() {
  if (process.argv[2]) return process.argv[2]
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => rl.question('输入管理口令: ', (answer) => { rl.close(); resolve(answer) }))
}

const passphrase = await readPassphrase()
if (!passphrase) {
  console.error('口令不能为空')
  process.exit(1)
}
const salt = randomBytes(16)
const hash = scryptSync(passphrase, salt, 64)
console.log(`scrypt:${salt.toString('hex')}:${hash.toString('hex')}`)
