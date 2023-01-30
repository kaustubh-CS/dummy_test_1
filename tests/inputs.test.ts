import path from 'path'
import { getInputs } from '../src/input-helper'
import * as core from '@actions/core'

describe('Inputs', () => {
  let mockInput
  const defaults = {
    folder_uid: '',
    host_url: 'https://api.contentstack.io/v3/assets'
  }
  beforeEach(() => {
    mockInput = {
      path: 'path',
      management_token: 'management_token',
      api_key: 'api_key',
      folder_uid: 'folder_uid',
      file_path: path.join('./', 'action.yml'),
      host_url: 'https://eu-api.contentstack.io/v3/assets'
    }
  })

  jest
    .spyOn(core, 'getInput')
    .mockImplementation(key => mockInput[key] || defaults[key])

  test('get all the inputs', () => {
    expect(getInputs()).toStrictEqual({
      managementToken: 'management_token',
      apiKey: 'api_key',
      folderUid: 'folder_uid',
      filePath: path.join('./', 'action.yml'),
      hostUrl: 'https://eu-api.contentstack.io/v3/assets'
    })
  })

  test('required inputs', () => {
    delete mockInput['host_url']
    delete mockInput['folder_uid']

    expect(getInputs()).toStrictEqual({
      managementToken: 'management_token',
      apiKey: 'api_key',
      folderUid: null,
      filePath: path.join('./', 'action.yml'),
      hostUrl: 'https://api.contentstack.io/v3/assets'
    })
  })
})
