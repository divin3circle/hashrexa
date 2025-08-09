// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'HashRexa Docs',
  tagline: 'Hedera + Spring Boot + Spring AI + Mirror Node',
  url: 'https://your-username.github.io', // Replace with your GitHub username
  baseUrl: '/hashrexa/', // Replace with your repository name
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  
  // GitHub Pages deployment config
  organizationName: 'your-username', // Usually your GitHub org/user name
  projectName: 'hashrexa', // Usually your repo name
  deploymentBranch: 'gh-pages',
  trailingSlash: false,
  themes: ['@docusaurus/theme-mermaid'],
  markdown: { mermaid: true },
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */ ({
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editCurrentVersion: false,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  themeConfig: {
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    navbar: {
      title: 'HashRexa',
      items: [
        { to: '/', label: 'Docs', position: 'left' }
      ],
    },
    footer: {
      style: 'dark',
      copyright: `© ${new Date().getFullYear()} HashRexa` ,
    },
  },
};

module.exports = config;


