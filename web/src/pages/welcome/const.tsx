import { Database, HardDrive, Server } from 'lucide-react';

export const ADMIN_LINKS = [
  {
    label: 'API Swagger',
    icon: <Server />,
    getLink: (baseUrl = `${location.protocol}//${location.hostname}`) =>
      `${baseUrl}:9001/api-docs`,
  },
  {
    label: 'MinIO OBJECT STORE',
    getLink: (baseUrl = `${location.protocol}//${location.hostname}`) =>
      `${baseUrl}:9101`,
    icon: <HardDrive />,
  },
  {
    label: 'sqlite-web',
    icon: <Database />,
    getLink: (baseUrl = `${location.protocol}//${location.hostname}`) =>
      `${baseUrl}:9105`,
  },
  {
    label: 'phpMyAdmin',
    icon: <Database />,
    getLink: (baseUrl = `${location.protocol}//${location.hostname}`) =>
      `${baseUrl}:9107`,
  },
  {
    label: 'Inngest',
    icon: <Server />,
    getLink: (baseUrl = `${location.protocol}//${location.hostname}`) =>
      `${baseUrl}:9108`,
  },
];
