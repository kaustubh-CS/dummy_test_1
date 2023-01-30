import * as core from '@actions/core'
import { Inputs, UploadInputs } from './inputs'

export function getInputs() {
  const managementToken = core.getInput(Inputs.ManagementToken, {
    required: true
  })

  const apiKey = core.getInput(Inputs.ApiKey, {
    required: true
  })

  const filePath = core.getInput(Inputs.FilePath, {
    required: true
  })

  const folderUid = core.getInput(Inputs.FolderUid) || null

  const hostUrl = core.getInput(Inputs.HostUrl)

  const inputs = {
    managementToken,
    apiKey,
    folderUid,
    filePath,
    hostUrl
  } as UploadInputs

  return inputs
}
