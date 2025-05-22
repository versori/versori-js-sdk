/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
    branches: ['main', { name: 'next', prerelease: true }],
    extends: ['semantic-release-monorepo'],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/changelog',
        '@semantic-release/git',
        '@semantic-release/github',
        '@semantic-release/npm',
    ],
};
