// @ts-check
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    'overview',
    'getting-started',
    'architecture',
    'setup',
    'usage',
    {
      type: 'category',
      label: 'API Reference',
      items: ['api-reference', 'api/java', 'api/backend', 'api/streaming'],
      collapsed: false,
    },
    'ai-tools',
    'hedera-ops',
    'streaming',
    'frontend-integration',
    'repositories',
    'references',
    'troubleshooting',
    'contributing',
    'license'
  ],
};

module.exports = sidebars;


