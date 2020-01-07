import { assert } from "@jsenv/assert"
import {
  resolveUrl,
  writeDirectory,
  ensureEmptyDirectory,
  ensureParentDirectories,
  testFileSystemNodePresence,
} from "../../index.js"

const tempDirectoryUrl = import.meta.resolve("./temp/")
await ensureEmptyDirectory(tempDirectoryUrl)

// destination parent does not exists
{
  const parentDirectoryUrl = resolveUrl("dir/", tempDirectoryUrl)
  const destinationUrl = resolveUrl("dir/file.js", tempDirectoryUrl)

  await ensureParentDirectories(destinationUrl)
  const actual = await testFileSystemNodePresence(parentDirectoryUrl)
  const expected = true
  assert({ actual, expected })
  await ensureEmptyDirectory(tempDirectoryUrl)
}

// destination parent is a directory
{
  const parentDirectoryUrl = resolveUrl("dir/", tempDirectoryUrl)
  const destinationUrl = resolveUrl("dir/file.js", tempDirectoryUrl)
  await writeDirectory(parentDirectoryUrl)

  await ensureParentDirectories(destinationUrl)
  const actual = await testFileSystemNodePresence(parentDirectoryUrl)
  const expected = true
  assert({ actual, expected })
  await ensureEmptyDirectory(tempDirectoryUrl)
}