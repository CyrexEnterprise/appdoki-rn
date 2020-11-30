const fse = require('fs-extra')

module.exports = async (config) => {
  return Promise.all([
    bumpAppJson(config),
    bumpIOS(config),
    bumpAndroid(config),
  ])
}

async function bumpAppJson ({ version }) {
  const appJsonData = JSON.parse(fse.readFileSync('app.json', { encoding: 'utf8' }))
  appJsonData.version = version

  return fse.writeFile('app.json', JSON.stringify(appJsonData, null, 2) + '\n')
}

async function bumpIOS (config) {
  const filePath = 'ios/appdoki/info.plist'
  let body = await fse.readFile(filePath)

  body = body.toString().split('\n')

  let i = 0
  const leng = body.length
  let shortVersionLine = -1
  let versionLine = -1
  for (i; i < leng; i++) {
    if (shortVersionLine < 0 && RegExp('<key>CFBundleShortVersionString</key>').test(body[i])) {
      shortVersionLine = i + 1
    }

    if (versionLine < 0 && RegExp('<key>CFBundleVersion</key>').test(body[i])) {
      versionLine = i + 1
    }

    if (shortVersionLine >= 0 && versionLine >= 0) {
      break
    }
  }

  if (shortVersionLine < 0 || versionLine < 0) {
    throw new Error(`Could not find version lines on ${filePath}`)
  }

  const searchBegin = '<string>'
  const searchEnd = '</string>'

  const shortVersionText = body[shortVersionLine]
  const shortVersion = shortVersionText.substring(
    shortVersionText.indexOf(searchBegin) + searchBegin.length, shortVersionText.indexOf(searchEnd),
  )

  body[shortVersionLine] = body[shortVersionLine].replace(shortVersion, config.version)

  const versionText = body[versionLine]
  const version = Number(versionText.substring(
    versionText.indexOf(searchBegin) + searchBegin.length, versionText.indexOf(searchEnd),
  ))

  // timestamp version
  body[versionLine] = body[versionLine].replace(version, Date.now())

  const output = body.join('\n')
  return fse.writeFile(filePath, output)
}

async function bumpAndroid (config) {
  const filePath = 'android/app/build.gradle'
  let body = await fse.readFile(filePath)

  body = body.toString().split('\n')

  let i = 0
  const leng = body.length
  let beginVersionsLine = -1
  for (i; i < leng; i++) {
    if (RegExp('\\/\\/ BEGIN VERSIONS').test(body[i])) {
      beginVersionsLine = i
      break
    }
  }

  if (beginVersionsLine < 0) {
    throw new Error(`Could not find versions line on ${filePath}`)
  }

  const versionCodeLine = beginVersionsLine + 1
  const versionNameLine = beginVersionsLine + 2

  const versionCodeText = body[versionCodeLine]
  const versionCode = Number(versionCodeText.substring(versionCodeText.lastIndexOf(' '), versionCodeText.length))
  body[versionCodeLine] = body[versionCodeLine].replace(versionCode, versionCode + 1)

  const versionNameText = body[versionNameLine]
  const versionName = versionNameText.substring(versionNameText.lastIndexOf(' '), versionNameText.length)
  body[versionNameLine] = body[versionNameLine].replace(versionName, ` "${config.version}"`)

  const output = body.join('\n')
  return fse.writeFile(filePath, output)
}
