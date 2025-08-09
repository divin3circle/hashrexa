// @ts-check
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    'overview',
    'quick-start',
    'getting-started',
    'architecture',
    {
      type: 'category',
      label: 'API Reference',
      items: ['api-reference', 'api/java', 'api/backend', 'api/streaming'],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Guides & Examples',
      items: ['usage', 'ai-tools', 'hedera-ops', 'streaming', 'frontend-integration'],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Advanced',
      items: ['repositories', 'performance', 'security', 'deployment'],
      collapsed: true,
    },
    'troubleshooting',
    'faq',
    'examples',
    'references',
    'contributing',
    'license'
  ],
};

module.exports = sidebars;


