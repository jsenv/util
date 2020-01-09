import { fileSystemPathToUrl } from "./fileSystemPathToUrl.js"

const isWindows = process.platform === "win32"

const baseUrlFallback = fileSystemPathToUrl(process.cwd())

export const resolveUrl = (specifier, baseUrl) => {
  if (typeof baseUrl === "undefined") {
    throw new TypeError(`baseUrl missing to resolve ${specifier}`)
  }

  const url = String(new URL(specifier, baseUrl))
  if (isWindows) {
    /*
    we want the following a special url resolution on windows regarding files:

    resolveUrl("/file.js", "file:///C:/dir/file.js")
    -> file:///C:/file.js

    resolveUrl("file:///file.js", "file:///C:/dir/file.js")
    -> file:///C:/file.js

    resolveUrl("//file.js", "file:///C:/dir/file.js")
    -> file:///C:/file.js

    This is to be sure we don't loose the drive letter otherwise the url becomes invalid
    when we try to read the corresponding file later on
    */
    if (url.startsWith("file:///")) {
      const afterProtocol = url.slice("file:///".length)
      // we still have the windows drive letter
      if (/[a-zA-Z]/.test(afterProtocol[0]) && afterProtocol[1] === ":") {
        return url
      }

      // drive letter was lost, restore it
      const driveLetter = (baseUrl.startsWith("file:///") ? baseUrl : baseUrlFallback).slice(
        "file:///".length,
      )[0]
      return `file:///${driveLetter}:${afterProtocol}`
    }
  }
  return url
}
