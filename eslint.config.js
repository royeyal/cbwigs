import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default [
  js.configs.recommended,
  {
    ignores: ['external/**/*', 'dist/**/*', 'node_modules/**/*']
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        gsap: 'readonly',
        ScrollTrigger: 'readonly',
        SplitText: 'readonly',
        CustomEase: 'readonly',
        Draggable: 'readonly',
        InertiaPlugin: 'readonly',
        Flip: 'readonly',
        Swiper: 'readonly',
        YT: 'readonly',
        getComputedStyle: 'readonly',
        innerWidth: 'readonly',
        clearTimeout: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        MutationObserver: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }]
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**', '.husky/**']
  },
  // Formatting (quotes, semicolons, indentation, commas) is Prettier's job (.prettierrc);
  // this turns off every ESLint rule that would fight it. Keep it last.
  eslintConfigPrettier
];
