import path from 'path'
import { run } from '../src/upload-file'
import axios from 'axios'
import fs from 'fs'

let mockOutput = {} as any
let failedMsg
jest.mock('../src/input-helper', () => ({
  getInputs: () => ({
    managementToken: 'mgmt_token',
    apiKey: 'api_key',
    folderUid: 'folder_uid',
    filePath: path.join('./', 'jest.config.js'),
    hostUrl: 'https://eu-api.contentstack.io/v3/assets'
  })
}))

jest.mock('@actions/core', () => ({
  setFailed: err => {
    failedMsg = err
  },
  debug: jest.fn(),
  setOutput: (key, value) => (mockOutput[key] = value)
}))

jest.mock('axios', () => ({
  __esModule: true,
  default: jest.fn()
}))

describe('Upload File', () => {
  const mockedAxios = axios as unknown as jest.Mock

  beforeEach(() => {
    mockOutput = {}
    mockedAxios.mockClear()
    failedMsg = undefined
  })

  test('Sucessfull upload', async () => {
    mockedAxios.mockResolvedValueOnce({
      data: {
        asset: { url: 'https://mockLink.com' }
      }
    })
    await run()
    expect(mockOutput.link).toBe('https://mockLink.com')
    expect(failedMsg).toBe(undefined)
  })

  test('Fetch Error', async () => {
    mockedAxios.mockRejectedValueOnce(new Error('Error while fetching'))
    await run()
    expect(failedMsg).toMatch('Error while fetching')
    expect(mockOutput.link).toBeFalsy()
  })

  test('Host Url Domain Not found', async () => {
    mockedAxios.mockRejectedValueOnce(
      JSON.stringify({
        message: 'getaddrinfo mockDomain.com ENOTFOUND',
        syscall: 'getaddrinfo',
        hostname: 'mockDomain.com',
        code: 'ENOTFOUND'
      })
    )
    await run()
    expect(failedMsg).toMatch('getaddrinfo mockDomain.com ENOTFOUND')
    expect(mockOutput.link).toBeFalsy()
  })

  test('Cannot POST data to host URL', async () => {
    mockedAxios.mockRejectedValueOnce(
      JSON.stringify({
        message: 'Request failed with status code 404',
        response: {
          status: 404,
          statusText: 'Not Found',
          data: []
        }
      })
    )
    await run()
    expect(failedMsg).toMatch('Request failed with status code 404')
    expect(mockOutput.link).toBeFalsy()
  })

  test('Response Error from CS', async () => {
    mockedAxios.mockRejectedValueOnce({
      response: {
        data: {
          error_message: 'Cannot get stack / parent folder / not allowed'
        }
      }
    })
    await run()
    expect(failedMsg).toBe('Cannot get stack / parent folder / not allowed')
    expect(mockOutput.link).toBeFalsy()
  })

  test('File Error', async () => {
    jest.spyOn(fs, 'createReadStream').mockImplementation(() => {
      throw Error('File not found')
    })
    await run()
    expect(failedMsg).toBe('File not found')
    expect(mockOutput.link).toBeFalsy()
  })
})
