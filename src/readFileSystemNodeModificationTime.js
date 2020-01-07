import { readFileSystemNodeStat } from "./readFileSystemNodeStat.js"

export const readFileSystemNodeModificationTime = async (source) => {
  const stats = await readFileSystemNodeStat(source)
  return stats.mtimeMs
}
