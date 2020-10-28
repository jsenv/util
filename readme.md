# util

Set of functions often needed when using Node.js.

[![github package](https://img.shields.io/github/package-json/v/jsenv/jsenv-util.svg?logo=github&label=package)](https://github.com/jsenv/jsenv-util/packages)
[![npm package](https://img.shields.io/npm/v/@jsenv/util.svg?logo=npm&label=package)](https://www.npmjs.com/package/@jsenv/util)
[![github ci](https://github.com/jsenv/jsenv-util/workflows/ci/badge.svg)](https://github.com/jsenv/jsenv-util/actions?workflow=ci)
[![codecov coverage](https://codecov.io/gh/jsenv/jsenv-util/branch/master/graph/badge.svg)](https://codecov.io/gh/jsenv/jsenv-util)

# Table of contents

- [Presentation](#Presentation)
- [Installation](#Installation)
- [Url preference](#Url-preference)
- [Url parts naming](#Url-parts-naming)
- [assertAndNormalizeDirectoryUrl](#assertAndNormalizeDirectoryUrl)
- [assertAndNormalizeFileUrl](#assertAndNormalizeFileUrl)
- [assertDirectoryPresence](#assertDirectoryPresence)
- [assertFilePresence](#assertFilePresence)
- [bufferToEtag](#bufferToEtag)
- [collectFiles](#collectFiles)
- [comparePathnames](#comparePathnames)
- [copyFileSystemNode](#copyFileSystemNode)
- [ensureEmptyDirectory](#ensureEmptyDirectory)
- [ensureParentDirectories](#ensureParentDirectories)
- [fileSystemPathToUrl](#fileSystemPathToUrl)
- [isFileSystemPath](#isFileSystemPath)
- [memoize](#memoize)
- [moveFileSystemNode](#moveFileSystemNode)
- [readDirectory](#readDirectory)
- [readFile](#readFile)
- [readFileSystemNodeModificationTime](#readFileSystemNodeModificationTime)
- [readFileSystemNodeStat](#readFileSystemNodeStat)
- [readSymbolicLink](#readSymbolicLink)
- [registerDirectoryLifecycle](#registerDirectoryLifecycle)
- [registerFileLifecycle](#registerFileLifecycle)
- [removeFileSystemNode](#removeFileSystemNode)
- [resolveDirectoryUrl](#resolveDirectoryUrl)
- [resolveUrl](#resolveUrl)
- [urlIsInsideOf](#urlIsInsideOf)
- [urlToBasename](#urlToBasename)
- [urlToExtension](#urlToExtension)
- [urlToFilename](#urlToFilename)
- [urlToFileSystemPath](#urlToFileSystemPath)
- [urlToOrigin](#urlToOrigin)
- [urlToParentUrl](#urlToParentUrl)
- [urlToPathname](#urlToPathname)
- [urlToRelativeUrl](#urlToRelativeUrl)
- [urlToRessource](#urlToRessource)
- [urlToScheme](#urlToScheme)
- [writeDirectory](#writeDirectory)
- [writeFile](#writeFile)
- [writeFileSystemNodeModificationTime](#writeFileSystemNodeModificationTime)
- [writeSymbolicLink](#writeSymbolicLink)
- [Advanced api](#Advanced-api)

# Presentation

This repository exists mostly to work with files relative to a directory with an approach that works on windows and linux filesystems as shown in the code example below.

```js
import { readFileSync } from "fs"
import { resolveUrl, urlToFileSystemPath, assertAndNormalizeDirectoryUrl } from "@jsenv/util"

const directoryUrl = assertAndNormalizeDirectoryUrl(__dirname)
const packageFileUrl = resolveUrl("package.json", directoryUrl)
const packageFilePath = urlToFileSystemPath(packageFileUrl)
const packageFileBuffer = readFileSync(packageFilePath)
```

With times more functions were added, all util are documented below.

# Installation

```console
npm install @jsenv/util
```

# Url preference

In this package functions related to filesystem work with url string instead of a filesystem path.

```js
const url = "file:///directory/file.js"
const filesystemPath = "/directory/file.js"
```

This allows function to manipulate a value that is the same across operating systems. Because on windows a filesystem path looks like `C:\\directory\\file.js` while linux/mac equivalent looks like `/directory/file.js`. Also url are standard. A standard is more robust and knowledge acquired on a standard is reusable.

You might also notice a slight preference for url string over url object in the documentation or codebase. This is a deliberate choice because over time it appeared that an url string is easier to work with. Certainly because a string is a well known primitive while an url object is a more complex structure.

```js
const urlString = "file:///directory/file.js"
const urlObject = new URL("file:///directory/file.js")
```

# Url parts naming

This documentation and source code uses a naming taken from url standard specifications with minor differences. The following graph links each term with the corresponding part in an url.

<pre>
                                                           href
                   ┌────────────────────────────────────────┴──────────────────────────────────────────────┐
                origin                                                                                     │
      ┌────────────┴──────────────┐                                                                        │
      │                       authority                                                                    │
      │           ┌───────────────┴───────────────────────────┐                                            │
      │           │                                         host                                        ressource
      │           │                                ┌──────────┴────────────────┐             ┌──────────────┴────────┬──────┐
      │           │                             hostname                       │          pathname                   │      │
      │           │                 ┌──────────────┴────────────┐              │      ┌──────┴──────┐                │      │
  protocol     userinfo         subdomain                    domain            │      │          filename            │      │
   ┌─┴──┐     ┌───┴────┐            │                  ┌────────┴───────┐      │      │         ┌───┴─────┐          │      │
scheme  │username password lowerleveldomains secondleveldomain topleveldomain port dirname   basename extension   search   hash
┌──┴───┐│┌──┴───┐ ┌──┴───┐ ┌──┬─┬─┴─────┬───┐┌───────┴───────┐ ┌──────┴──────┐┌┴┐┌────┴─────┐ ┌──┴───┐ ┌───┴───┐ ┌────┴────┐ ┌┴┐
│      │││      │ │      │ │  │ │       │   ││               │ │             ││ ││          │ │      │ │       │ │         │ │ │
scheme://username:password@test.abcdedgh.www.secondleveldomain.topleveldomain:123/hello/world/basename.extension?name=ferret#hash
</pre>

# assertAndNormalizeDirectoryUrl

`assertAndNormalizeDirectoryUrl` is a function ensuring the received value can be normalized to a directory url string. This function is great to make a function accept various values as directory url and normalize it to a standard directory url like `file:///directory/`. Jsenv uses it for every function having a directory url parameter.

```js
import { assertAndNormalizeDirectoryUrl } from "@jsenv/util"

assertAndNormalizeDirectoryUrl("/directory") // file:///directory/
```

— source code at [src/assertAndNormalizeDirectoryUrl.js](./src/assertAndNormalizeDirectoryUrl.js).

# assertAndNormalizeFileUrl

`assertAndNormalizeFileUrl` is a function ensuring the received value can be normalized to a file url string. This function is great to make a function accept various values as file url and normalize it to a standard file url like `file:///directory/file.js`. Jsenv uses it for every function having a file url parameter.

```js
import { assertAndNormalizeFileUrl } from "@jsenv/util"

assertAndNormalizeFileUrl("/directory/file.js") // file:///directory/file.js
```

— source code at [src/assertAndNormalizeFileUrl.js](./src/assertAndNormalizeFileUrl.js).

# assertDirectoryPresence

`assertDirectoryPresence` is an async function throwing if directory does not exists on the filesystem. This function is great to assert a directory existence before going further. Jsenv uses it to throw early when a directory presence is mandatory for a given function to work properly.

```js
import { assertDirectoryPresence } from "@jsenv/util"

await assertDirectoryPresence("file:///Users/directory/")
```

— source code at [src/assertDirectoryPresence.js](./src/assertDirectoryPresence.js).

# assertFilePresence

`assertFilePresence` is an async function throwing if a file does not exists on the filesystem. This function is great to assert a file existence before going further. Jsenv uses it to throw early when a file presence is mandatory for a given function to work properly.

```js
import { assertFilePresence } from "@jsenv/util"

await assertFilePresence("file:///Users/directory/file.js")
```

— source code at [src/assertFilePresence.js](./src/assertFilePresence.js).

# bufferToEtag

`bufferToEtag` is a function receiving a buffer and converting it into an eTag. This function returns a hash (a small string) representing a file content. You can later check if the file content has changed by comparing a previously generated eTag with the current file content. Jsenv uses it to generate eTag headers and to know if a file content has changed in specific scenarios.

```js
import { bufferToEtag } from "@jsenv/util"

const eTag = bufferToEtag(Buffer.from("Hello world"))
const otherEtag = bufferToEtag(Buffer.from("Hello world"))
eTag === otherEtag
```

— see [Buffer documentation on Node.js](https://nodejs.org/docs/latest-v13.x/api/buffer.html)<br />
— see [eTag documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)<br />
— source code at [src/bufferToEtag.js](./src/bufferToEtag.js).

# collectFiles

`collectFiles` is an async function collectings a subset of files inside a directory.

```js
import { collectFiles } from "@jsenv/util"

const files = await collectFiles({
  directoryUrl: "file:///Users/you/directory",
  specifierMetaMap: {
    "./**/*.js": {
      whatever: 42,
    },
  },
  predicate: (meta) => {
    return meta.whatever === 42
  },
})
```

— source code at [src/collectFiles.js](./src/collectFiles.js).

# comparePathnames

`comparePathnames` is a function compare two pathnames and returning which pathnames comes first in a filesystem.

```js
import { comparePathnames } from "@jsenv/util"

const pathnames = ["a/b.js", "a.js"]
pathnames.sort(comparePathnames)
```

— source code at [src/comparePathnames.js](./src/comparePathnames.js).

# copyFileSystemNode

`copyFileSystemNode` is an async function creating a copy of the filesystem node at a given destination

```js
import { copyFileSystemNode } from "@jsenv/util"

await copyFileSystemNode(`file:///file.js`, "file:///destination/file.js")
await copyFileSystemNode(`file:///directory`, "file:///destination/directory")
```

— source code at [src/copyFileSystemNode.js](./src/copyFileSystemNode.js).

# ensureEmptyDirectory

`ensureEmptyDirectory` is an async function ensuring a directory is empty. It removes a directory content when it exists or create an empty directory.
This function was written for testing. It is meant to clean up a directory in case a previous test execution let some files and you want to clean them before running your test. Jsenv uses it in some tests involving the filesystem.

```js
import { ensureEmptyDirectory } from "@jsenv/util"

await ensureEmptyDirectory(`file:///directory`)
```

— source code at [src/ensureEmptyDirectory.js](./src/ensureEmptyDirectory.js).

# ensureParentDirectories

`ensureParentDirectories` is an async function creating every directory leading to a file. This function is useful to ensure a given file directories exists before doing any operation on that file. Jsenv uses it to write file in directories that does not exists yet.

```js
import { ensureParentDirectories } from "@jsenv/util"

await ensureParentDirectories(`file:///directory/subdirectory/file.js`)
```

— source code at [src/ensureParentDirectories.js](./src/ensureParentDirectories.js).

# writeDirectory

`writeDirectory` is an async function creating a directory on the filesystem. `writeDirectory` is equivalent to [fs.promises.mkdir](https://nodejs.org/docs/latest-v13.x/api/fs.html#fs_fspromises_mkdir_path_options) but accepts url strings as directory path.

```js
import { writeDirectory } from "@jsenv/util"

await writeDirectory(`file:///directory`)
```

— source code at [src/writeDirectory.js](./src/writeDirectory.js).

# fileSystemPathToUrl

`fileSystemPathToUrl` is a function returning a filesystem path from an url string. `fileSystemPathToUrl` is equivalent to [pathToFileURL from Node.js](https://nodejs.org/docs/latest-v13.x/api/url.html#url_url_pathtofileurl_path) but returns string instead of url objects.

```js
import { fileSystemPathToUrl } from "@jsenv/util"

fileSystemPathToUrl("/directory/file.js")
```

— source code at [src/fileSystemPathToUrl.js](./src/fileSystemPathToUrl.js).

# isFileSystemPath

`isFileSystemPath` is a function returning a filesystem path from an url string.

```js
import { isFileSystemPath } from "@jsenv/util"

isFileSystemPath("/directory/file.js") // true
isFileSystemPath("C:\\directory\\file.js") // true
isFileSystemPath("directory/file.js") // false
isFileSystemPath("file:///directory/file.js") // false
```

— source code at [src/isFileSystemPath.js](./src/isFileSystemPath.js).

# memoize

`memoize` is a function wrapping an other function to ensure it is called once.

```js
import { memoize } from "@jsenv/util"

let callCount = 0

const fn = memoize(async () => {
  callCount++
  const value = await Promise.resolve("hello")
  return value
})

const firstCallValue = await fn()
const secondCallValue = await fn()

firstCallValue // "hello"
secondCallValue // "hello"
callCount // 1
```

— source code at [src/memoize.js](./src/memoize.js).

# moveFileSystemNode

`moveFileSystemNode` is an async function moving a filesystem node to a destination.

```js
import { moveFileSystemNode } from "@jsenv/util"

await moveFileSystemNode("file:///file.js", "file:///destination/file.js")
await moveFileSystemNode("file:///directory", "file:///destination/directory")
```

— source code at [src/moveFileSystemNode.js](./src/moveFileSystemNode.js).

# readDirectory

`readDirectory` is an async function returning an array of string representing all filesystem nodes inside that directory.

```js
import { readDirectory } from "@jsenv/util"

const content = await readDirectory("file:///directory")
```

— source code at [src/readDirectory.js](./src/readDirectory.js).

# readFileSystemNodeModificationTime

`readFileSystemNodeModificationTime` is an async function returning a number of milliseconds representing the date when the file was modified.

```js
import { readFileSystemNodeModificationTime } from "@jsenv/util"

const mtimeMs = await readFileSystemNodeModificationTime("file:///directory/file.js")
```

— source code at [src/readFileSystemNodeModificationTime.js](./src/readFileSystemNodeModificationTime.js).

# readFile

`readFile` is an async function returning the content of a file as string, buffer, or json.

```js
import { readFile } from "@jsenv/util"

const fileContentAsString = await readFile("file:///directory/file.json")
const fileContentAsBuffer = await readFile("file:///directory/file.json", { as: "buffer" })
const fileContentAsJSON = await readFile("file:///directory/file.json", { as: "json" })
```

— source code at [src/readFile.js](./src/readFile.js).

# readFileSystemNodeStat

`readFileSystemNodeStat` is an async function returning a filesystem node stats object. `readFileSystemNodeStat` is equivalent to [fs.promises.stats from Node.js](https://nodejs.org/docs/latest-v13.x/api/fs.html#fs_fspromises_stat_path_options) but accepts url strings as file path.

```js
import { readFileSystemNodeStat } from "@jsenv/util"

const stats = await readFileSystemNodeStat("file:///directory/file.js")
```

— see also [stats object documentation on Node.js](https://nodejs.org/docs/latest-v13.x/api/fs.html#fs_class_fs_stats)<br />
— source code at [src/readFileSystemNodeStat.js](./src/readFileSystemNodeStat.js).

# readSymbolicLink

`readSymbolicLink` is an async function returning a symbolic link target as url string.

```js
import { readSymbolicLink } from "@jsenv/util"

const targetUrlOrRelativeUrl = await readSymbolicLink("file:///directory/link")
```

— see also [symlink documentation on Node.js](https://nodejs.org/docs/latest-v13.x/api/fs.html#fs_fs_symlink_target_path_type_callback)<br />
— source code at [src/readSymbolicLink.js](./src/readSymbolicLink.js).

# registerDirectoryLifecycle

`registerDirectoryLifecycle` is a function watching a directory at a given path and calling `added`, `updated`, `removed` according to what is happening inside that directory. Usually, filesystem takes less than 100ms to notify something has changed.

```js
import { registerDirectoryLifecycle } from "@jsenv/util"

const contentMap = {}
const unregister = registerDirectoryLifecycle("file:///directory", {
  added: ({ relativeUrl, type }) => {
    contentMap[relativeUrl] = type
  },
  removed: ({ relativeUrl }) => {
    delete contentMap[relativeUrl]
  },
})

// you can call unregister when you want to stop watching the directory
unregister()
```

— source code at [src/registerDirectoryLifecycle.js](./src/registerDirectoryLifecycle.js).

# registerFileLifecycle

`registerFileLifecycle` is a function watching a file and calling `added`, `updated`, `removed` according to what is happening to that file. Usually, filesystem takes less than 100ms to notify something has changed.

```js
import { readFileSync } from "fs"
import { registerFileLifecycle } from "@jsenv/file-watcher"

const filePath = "/file.config.json"
let currentConfig = null
const unregister = registerFileLifecycle(filePath, {
  added: () => {
    currentConfig = JSON.parse(String(readFileSync(filePath)))
  },
  updated: () => {
    currentConfig = JSON.parse(String(readFileSync(filePath)))
  },
  removed: () => {
    currentConfig = null
  },
  notifyExistent: true,
})

// you can call unregister() when you want to stop watching the file
unregister()
```

— source code at [src/registerFileLifecycle.js](./src/registerFileLifecycle.js).

# removeFileSystemNode

`removeFileSystemNode` is an async function removing a node (directory, file, symbolic link) from the filesystem.

```js
import { removeFileSystemNode } from "@jsenv/util"

await removeFileSystemNode("file:///file.js")
await removeFileSystemNode("file:///directory")
```

— source code at [src/removeFileSystemNode.js](./src/removeFileSystemNode.js).

# resolveDirectoryUrl

`resolveDirectoryUrl` is a function resolving a relative url to an absolute directory url string. This function applies url resolution and ensure the returned url ends with a slash. Enforcing the trailing slash indicates explicitely that the url is a directory. `file:///directory/whatever/` shows `whatever` is a directory while `file:///directory/whatever` is ambiguous. This specificity helps url resolution against a directory as shown in the code below.

```js
const urlA = new URL("file.js", "file:///directory/")
const urlB = new URL("file.js", "file:///directory")

urlA.href // file:///directory/file.js
urlB.href // file:///file.js
```

```js
import { resolveDirectoryUrl } from "@jsenv/util"

const directoryUrl = resolveDirectoryUrl("src", "file:///directory")
directoryUrl // file:///directory/src/
```

— source code at [src/resolveDirectoryUrl.js](./src/resolveDirectoryUrl.js).

# resolveUrl

`resolveUrl` is a function resolving a relative url to an absolute url string. As explained before jsenv prefer to work with url string. When it comes to url resolution it implies to write code like `String(new URL(relativeUrl, url))`. But it makes `relativeUrl` and `url` values less readable in the middle of `String(new URL())`. `resolveUrl` exists just to increase code readability.

```js
import { resolveUrl } from "@jsenv/util"

resolveUrl("file.js", "file:///directory/")
```

— source code at [src/resolveUrl.js](./src/resolveUrl.js).

# urlIsInsideOf

`urlIsInsideOf` is a function returning a boolean indicating if an url is inside an other url.

```js
import { urlIsInsideOf } from "@jsenv/util"

urlIsInsideOf("file:///directory/file.js", "file:///directory/") // true
urlIsInsideOf("file:///file.js", "file:///directory/") // false
```

— source code at [src/urlIsInsideOf.js](./src/urlIsInsideOf.js).

# urlToBasename

`urlToBasename` is receiving an url and returning its basename.

```js
import { urlToBasename } from "@jsenv/util"

urlToBasename("file:///directory/file.js") // "file"
urlToBasename("file:///directory/") // "directory"
urlToBasename("http://example.com") // ""
```

— source code at [src/urlToBasename.js](./src/urlToBasename.js).

# urlToExtension

`urlToExtension` is receiving an url and returning its extension.

```js
import { urlToExtension } from "@jsenv/util"

urlToExtension("file:///directory/file.js") // ".js"
urlToExtension("file:///directory/file.") // "."
urlToExtension("http://example.com/file") // ""
```

— source code at [src/urlToExtension.js](./src/urlToExtension.js).

# urlToFilename

`urlToFilename` is receiving an url and returning its filename.

```js
import { urlToFilename } from "@jsenv/util"

urlToFilename("file:///directory/file.js") // "file.js"
urlToFilename("file:///directory/file.") // "file."
urlToFilename("http://example.com/file") // "file"
```

— source code at [src/urlToFilename.js](./src/urlToFilename.js).

# urlToFileSystemPath

`urlToFileSystemPath` is a function returning a filesystem path from an url. `urlToFileSystemPath` is equivalent to [pathToFileURL from Node.js](https://nodejs.org/docs/latest-v13.x/api/url.html#url_url_pathtofileurl_path) but returns string instead of url objects.

```js
import { urlToFileSystemPath } from "@jsenv/util"

urlToFileSystemPath("file:///directory/file.js")
```

— source code at [src/urlToFileSystemPath.js](./src/urlToFileSystemPath.js).

# urlToOrigin

`urlToOrigin` is a function receiving an url and returning its origin.

```js
import { urlToOrigin } from "@jsenv/util"

urlToOrigin("file:///directory/file.js") // "file://"
urlToOrigin("http://example.com/file.js") // "http://example.com"
```

— source code at [src/urlToOrigin.js](./src/urlToOrigin.js).

# urlToParentUrl

`urlToParentUrl` is a function receiving an url and returning its parent url if any or the url itself.

```js
import { urlToParentUrl } from "@jsenv/util"

urlToParentUrl("http://example.com/dir/file.js") // "http://example.com/dir/"
urlToParentUrl("http://example.com/dir/") // "http://example.com/"
urlToParentUrl("http://example.com/") // "http://example.com/"
```

— source code at [src/urlToParentUrl.js](./src/urlToParentUrl.js).

# urlToPathname

`urlToPathname` is a function receiving an url and returning its pathname.

```js
import { urlToPathname } from "@jsenv/util"

urlToPathname("http://example.com/dir/file.js") // "/dir/file.js"
urlToPathname("http://example.com/dir/") // "/dir/"
urlToPathname("http://example.com/") // "/"
```

— source code at [src/urlToPathname.js](./src/urlToPathname.js).

# urlToRelativeUrl

`urlToRelativeUrl` is a function receiving two absolute urls and returning the first url relative to the second one. `urlToRelativeUrl` is the url equivalent to [path.relative from Node.js](https://nodejs.org/docs/latest-v13.x/api/path.html#path_path_relative_from_to).

```js
import { urlToRelativeUrl } from "@jsenv/util"

urlToRelativeUrl("file:///directory/file.js", "file:///directory/")
urlToRelativeUrl("http://example.com/directory/file.js", "http://example.com/directory/")
```

— source code at [src/urlToRelativeUrl.js](./src/urlToRelativeUrl.js).

# urlToRessource

`urlToRessource` is a function receiving an url and returning its ressource.

```js
import { urlToRessource } from "@jsenv/util"

urlToRessource("http://example.com/dir/file.js?foo=bar#10") // "/dir/file.js?foo=bar#10"
```

# urlToScheme

`urlToScheme` is a function receiving an url and returning its scheme.

```js
import { urlToScheme } from "@jsenv/util"

urlToScheme("http://example.com") // "http"
urlToScheme("file:///dir/file.js") // "file"
urlToScheme("about:blank") // "about"
```

# writeFile

`writeFile` is an async function writing file and its content on the filesystem. This function auto create file parent directories if they do not exists.

```js
import { writeFile } from "@jsenv/util"

await writeFile("file:///directory/file.txt", "Hello world")
```

— source code at [src/writeFile.js](./src/writeFile.js).

# writeFileSystemNodeModificationTime

`writeFileSystemNodeModificationTime` is an async function writing file and its content on the filesystem. `writeFileSystemNodeModificationTime` is like [fs.promises.utimes](https://nodejs.org/docs/latest-v13.x/api/fs.html#fs_fspromises_utimes_path_atime_mtime) but accepts url strings as file path.

```js
import { writeFileSystemNodeModificationTime } from "@jsenv/util"

await writeFileSystemNodeModificationTime("file:///directory/file.js", Date.now())
```

— source code at [src/writeFileSystemNodeModificationTime.js](./src/writeFileSystemNodeModificationTime.js).

# writeSymbolicLink

`writeSymbolicLink` is an async function writing a symlink link to a file or directory on the filesystem.

```js
import { writeSymbolicLink } from "@jsenv/util"

await writeSymbolicLink("file:///foo.js", "./bar.js")
```

— see also [symlink documentation on Node.js](https://nodejs.org/docs/latest-v13.x/api/fs.html#fs_fs_symlink_target_path_type_callback)<br />
— source code at [src/writeSymbolicLink.js](./src/writeSymbolicLink.js).

# Advanced api

There is a few more functions but they are more specific, you probably don't need them: [Advanced api](./docs/internal-api.md)
