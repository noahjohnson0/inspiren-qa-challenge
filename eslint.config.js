import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  // Test-specific rules for consistency
  {
    files: ['tests/**/*.{ts,tsx}'],
    rules: {
      // Enforce consistent move execution patterns
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForOfStatement[left.declarations.0.id.name="move"][right.property.name="moves"]',
          message: 'Use TestUtils.executeSequence() instead of manual for-of loops for move execution'
        }
      ],
      // Enforce consistent verification patterns (exclude grid-specific methods)
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.object.name="gamePage"][callee.property.name=/^verify(State|SquareValues|WinningState|InitialState|EmptyBoard|FullBoard)$/]',
          message: 'Use TestUtils.verify*() methods directly instead of gamePage.verify*() for consistency'
        }
      ]
    }
  }
)
