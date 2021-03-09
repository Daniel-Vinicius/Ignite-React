module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    ['@babel/preset-react', {
      // Pra não precisar importar o react em todos os arquivos .jsx/.tsx
      runtime: 'automatic'
    }]
  ]
}