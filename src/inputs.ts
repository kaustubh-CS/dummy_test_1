export enum Inputs {
  FilePath = 'file_path',
  ManagementToken = 'management_token',
  ApiKey = 'api_key',
  FolderUid = 'folder_uid',
  HostUrl = 'host_url'
}

export interface UploadInputs {
  managementToken: string
  apiKey: string
  folderUid: string
  filePath: string
  hostUrl: string
}
