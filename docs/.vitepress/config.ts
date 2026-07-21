import { defineConfig } from 'vitepress';

const repository = 'https://github.com/querry-kit/nest';

const nav = [
  { text: 'Guide', link: '/guide/getting-started' },
  { text: 'API', link: '/api/' },
  { text: 'Changelog', link: '/changelog' },
];

const sidebar = [
  {
    text: 'Guide',
    items: [
      { text: 'Getting Started', link: '/guide/getting-started' },
      { text: 'Example App', link: '/guide/example-app' },
      { text: 'NestJS main.ts', link: '/guide/main-bootstrap' },
      { text: 'CRUD Controller', link: '/guide/crud-controller' },
    ],
  },
  {
    text: 'Concepts',
    items: [
      { text: 'Fields Projection', link: '/concepts/fields' },
      { text: 'Query Transformation', link: '/concepts/query-transform' },
    ],
  },
  {
    text: 'API Reference',
    items: [
      { text: 'Overview', link: '/api/' },
      { text: 'Fields', link: '/api/fields/' },
      { text: 'DTO Schema', link: '/api/fields/dto-schema' },
      { text: 'Query Service', link: '/api/query-service' },
      { text: 'DTOs and Pagination', link: '/api/dtos-pagination' },
      { text: 'CASL', link: '/api/casl' },
      { text: 'OpenAPI Decorators', link: '/api/openapi' },
      { text: 'Decorators', link: '/api/decorators/' },
      { text: 'Pipes', link: '/api/pipes/' },
      { text: 'Object Utilities', link: '/api/object-utils' },
    ],
  },
  {
    text: 'Releases',
    items: [{ text: 'Changelog', link: '/changelog' }],
  },
];

export default defineConfig({
  base: '/nest/',
  title: '@querry-kit/nest',
  description: 'Developer documentation for @querry-kit/nest.',
  cleanUrls: true,
  head: [['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }]],
  lastUpdated: true,
  themeConfig: {
    search: {
      provider: 'local',
    },
    editLink: {
      pattern: `${repository}/edit/main/docs/:path`,
      text: 'Edit this page on GitHub',
    },
    lastUpdated: {
      text: 'Last updated',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Tobias Wälde',
    },
    nav,
    sidebar,
    socialLinks: [{ icon: 'github', link: repository }],
  },
});
