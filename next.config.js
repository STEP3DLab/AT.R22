/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',            // статический экспорт
  basePath: '/AT.R22',         // подкаталог репозитория
  assetPrefix: '/AT.R22/',     // чтобы статика грузилась с подкаталога
  images: { unoptimized: true }
}
