module.exports = {
  input: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!**/node_modules/**'
  ],
  output: './public/locales/$LOCALE/$NAMESPACE.json',
  options: {
    debug: false,
    func: {
      list: ['t', 'i18next.t', 'i18n.t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    trans: {
      component: 'Trans',
      i18nKey: 'i18nKey',
      defaultsKey: 'defaults',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      fallbackKey: function(ns, value) {
        return value;
      }
    },
    lngs: ['en', 'hi', 'mr', 'ta', 'te', 'bn', 'gu', 'kn', 'ml', 'or', 'pa', 'as'],
    ns: [
      'common',
      'navigation',
      'dashboard',
      'aicoach',
      'investment',
      'budget',
      'policy',
      'mandi',
      'literacy',
      'forms',
      'errors'
    ],
    defaultLng: 'en',
    defaultNs: 'common',
    defaultValue: '__STRING_NOT_TRANSLATED__',
    resource: {
      loadPath: './public/locales/{{lng}}/{{ns}}.json',
      savePath: './public/locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '\n'
    },
    nsSeparator: ':',
    keySeparator: '.',
    interpolation: {
      prefix: '{{',
      suffix: '}}'
    }
  }
}