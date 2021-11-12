import { FC, useCallback, useEffect, useState } from 'react'
import { useToasts } from 'react-toast-notifications'

interface FileInputProps {
  files: string[]
  setFiles: React.Dispatch<React.SetStateAction<string[]>>
}
const FileInput: FC<FileInputProps> = ({ setFiles, files }) => {
  const { addToast } = useToasts()

  const [innerFiles, setInnerFiles] = useState<File[]>()

  const [fileNames, setFileNames] = useState<string[]>([])

  const fileRender = useCallback(() => {
    if (innerFiles) {
      if (innerFiles.some(file => file.size > 1024 * 1024)) {
        addToast('max 1 mb for one file')
        return
      }
      if (files.length + innerFiles.length > 5) {
        addToast('max 5 file', { appearance: 'error' })
        return
      }
      innerFiles.forEach(innerFiles => {
        setFileNames(prevFileNames => [...prevFileNames, innerFiles.name])
        const fileReader = new FileReader()
        fileReader.readAsDataURL(innerFiles)
        fileReader.onload = () => {
          const res = fileReader.result
          if (res && typeof res === 'string') {
            setFiles(prevFiles => [...prevFiles, res])
          }
        }
      })
    }
  }, [innerFiles])

  useEffect(() => {
    fileRender()
  }, [fileRender])

  return (
    <div>
      <input
        type="file"
        multiple={true}
        accept=".PNG, .JPG, .JPEG"
        onChange={event => {
          if (
            event.currentTarget.files &&
            event.currentTarget.files.length <= 5
          ) {
            const localCopy: File[] = []
            for (let i = 0; i < event.currentTarget.files.length; i++) {
              localCopy.push(event.currentTarget.files[i])
            }
            setInnerFiles(localCopy)
          } else {
            addToast('max 5 file', { appearance: 'error' })
            return
          }
        }}
      />
      {files.length ? fileNames.map(name => <div>{name}</div>) : <div></div>}
      <button
        className="wrapper_form__button"
        onClick={() => {
          setFileNames([])
          setFiles([])
        }}
      >
        Clean photos
      </button>
    </div>
  )
}

export default FileInput
