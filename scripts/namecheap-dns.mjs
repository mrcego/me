#!/usr/bin/env node
/**
 * Namecheap DNS helper — get/set host records for cesargomez.dev
 * Requires .env with NAMECHEAP_API_USER, NAMECHEAP_API_KEY, NAMECHEAP_USERNAME, NAMECHEAP_CLIENT_IP
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');

function loadEnv() {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const API_BASE = 'https://api.namecheap.com/xml.response';
const SLD = 'cesargomez';
const TLD = 'dev';

const required = [
  'NAMECHEAP_API_USER',
  'NAMECHEAP_API_KEY',
  'NAMECHEAP_USERNAME',
  'NAMECHEAP_CLIENT_IP',
];

function getCreds() {
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`Missing env vars: ${missing.join(', ')}`);
    console.error(`Copy .env.example to .env and fill Namecheap API credentials.`);
    process.exit(1);
  }
  return {
    ApiUser: process.env.NAMECHEAP_API_USER,
    ApiKey: process.env.NAMECHEAP_API_KEY,
    UserName: process.env.NAMECHEAP_USERNAME,
    ClientIp: process.env.NAMECHEAP_CLIENT_IP,
  };
}

function parseHosts(xml) {
  const hosts = [];
  const re = /<host\s+([^>]+)\/>/g;
  let match;
  while ((match = re.exec(xml)) !== null) {
    const attrs = match[1];
    const get = (name) => {
      const m = attrs.match(new RegExp(`${name}="([^"]*)"`));
      return m ? m[1] : '';
    };
    hosts.push({
      Name: get('Name'),
      Type: get('Type'),
      Address: get('Address'),
      MXPref: get('MXPref') || '10',
      TTL: get('TTL') || '1800',
    });
  }
  return hosts;
}

function apiStatus(xml) {
  const m = xml.match(/<ApiResponse Status="([^"]+)"/);
  return m?.[1] ?? 'UNKNOWN';
}

function apiErrors(xml) {
  const errors = [];
  const re = /<Error Number="[^"]*">([^<]*)<\/Error>/g;
  let match;
  while ((match = re.exec(xml)) !== null) errors.push(match[1]);
  return errors;
}

async function apiGet(command, extra = {}) {
  const creds = getCreds();
  const params = new URLSearchParams({ ...creds, Command: command, SLD, TLD, ...extra });
  const res = await fetch(`${API_BASE}?${params}`);
  const xml = await res.text();
  if (apiStatus(xml) !== 'OK') {
    throw new Error(apiErrors(xml).join('; ') || `API error for ${command}`);
  }
  return xml;
}

async function apiPost(command, fields) {
  const creds = getCreds();
  const body = new URLSearchParams({ ...creds, Command: command, SLD, TLD, ...fields });
  const res = await fetch(API_BASE, { method: 'POST', body });
  const xml = await res.text();
  if (apiStatus(xml) !== 'OK') {
    throw new Error(apiErrors(xml).join('; ') || `API error for ${command}`);
  }
  return xml;
}

async function getHosts() {
  const xml = await apiGet('namecheap.domains.dns.getHosts');
  return parseHosts(xml);
}

async function setHosts(hosts) {
  const fields = {};
  hosts.forEach((host, i) => {
    const n = i + 1;
    fields[`HostName${n}`] = host.Name;
    fields[`RecordType${n}`] = host.Type;
    fields[`Address${n}`] = host.Address;
    fields[`TTL${n}`] = host.TTL || '1800';
    if (host.Type === 'MX' || host.Type === 'MXE') {
      fields[`MXPref${n}`] = host.MXPref || '10';
    }
  });
  return apiPost('namecheap.domains.dns.setHosts', fields);
}

async function addRecord({ name, type, address, ttl = '1800', mxPref = '10' }) {
  const hosts = await getHosts();
  const exists = hosts.some((h) => h.Name === name && h.Type === type);
  if (exists) {
    console.log(`Record already exists: ${type} ${name}`);
    return hosts;
  }
  hosts.push({ Name: name, Type: type, Address: address, TTL: ttl, MXPref: mxPref });
  await setHosts(hosts);
  console.log(`Added ${type} record: ${name} -> ${address}`);
  return hosts;
}

const [, , cmd, ...args] = process.argv;

if (cmd === 'list') {
  const hosts = await getHosts();
  console.table(hosts);
} else if (cmd === 'add-cname') {
  const [host, target] = args;
  if (!host || !target) {
    console.error('Usage: node scripts/namecheap-dns.mjs add-cname <host> <target>');
    process.exit(1);
  }
  await addRecord({ name: host, type: 'CNAME', address: target });
} else if (cmd === 'gsc-verify') {
  await addRecord({
    name: 'lsj7zdus2f5r',
    type: 'CNAME',
    address: 'gv-ry2ohoojskjxan.dv.googlehosted.com',
  });
} else {
  console.log(`Usage:
  node scripts/namecheap-dns.mjs list
  node scripts/namecheap-dns.mjs add-cname <host> <target>
  node scripts/namecheap-dns.mjs gsc-verify`);
}
