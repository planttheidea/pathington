import { createEslintConfig } from '@planttheidea/build-tools';

export default createEslintConfig({
  config: 'config',
  configs: [
    {
      rules: {
        '@typescript-eslint/prefer-optional-chain': 'off',
      },
    },
  ],
  development: 'dev',
  react: true,
  source: 'src',
});
