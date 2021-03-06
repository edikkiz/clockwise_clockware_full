import { FC, useCallback, useEffect, useState } from 'react'
import { useToasts } from 'react-toast-notifications'

interface FileInputProps {
  fileNames?: string[]
  files: string[]
  setFiles: (files: string[]) => void
  filesLimit: number
}
const FileInput: FC<FileInputProps> = ({
  setFiles,
  files,
  filesLimit,
  fileNames,
}) => {
  const { addToast } = useToasts()

  const [innerFiles, setInnerFiles] = useState<File[]>()

  const [innerFileNames, setInnerFileNames] = useState<string[]>([])

  const fileRender = useCallback(async () => {
    if (innerFiles) {
      if (innerFiles.some(file => file.size > 1024 * 1024)) {
        addToast('max 1 mb for one file')
        return
      }
      const readFiles = await Promise.all<string | null>(
        innerFiles.map(async innerFile => {
          setInnerFileNames(prevInnerFileNames => [
            ...prevInnerFileNames,
            innerFile.name,
          ])
          return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(innerFile)
            fileReader.onload = () => {
              const res = fileReader.result
              resolve(typeof res === 'string' ? res : null)
            }
          })
        }),
      )
      setFiles(readFiles.filter((file): file is string => typeof file === 'string'))
    }
  }, [innerFiles])

  useEffect(() => {
    fileRender()
  }, [fileRender])

  useEffect(() => {
    if (files.length > filesLimit) {
      setFiles([])
      setInnerFileNames([])
      addToast(`max ${filesLimit} files`, { appearance: 'error' })
    } else {
      return
    }
  }, [files])

  useEffect(() => {
    fileNames && setInnerFileNames(fileNames)
  }, [])

  return (
    <div>
      <input
        type="file"
        multiple={true}
        accept=".PNG, .JPG, .JPEG"
        onChange={event => {
          if (
            event.currentTarget.files &&
            event.currentTarget.files.length <= filesLimit
          ) {
            const localCopy: File[] = []
            for (let i = 0; i < event.currentTarget.files.length; i++) {
              localCopy.push(event.currentTarget.files[i])
            }
            setInnerFiles(localCopy)
          } else {
            addToast(`max ${filesLimit} file`, { appearance: 'error' })
            return
          }
        }}
      />
      <div id="filesName">
        {files.length ? (
          innerFileNames.map(name => <div>{name}</div>)
        ) : (
          <div></div>
        )}
      </div>
      <button
        className="wrapper_form__button"
        onClick={() => {
          setInnerFileNames([])
          setFiles([])
        }}
      >
        {filesLimit === 1 ? "Clean photo" : "Clean photos"}
      </button>
    </div>
  )
}

export default FileInput
