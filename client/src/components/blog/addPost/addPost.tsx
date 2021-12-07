import './add-post-module.css'
import { Editor } from '@tinymce/tinymce-react'
import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { useHistory } from 'react-router-dom'
import FileInput from '../../reusableСomponents/fileInput/FileInput'
import Preloader from '../../Preloader'
import { useToasts } from 'react-toast-notifications'
import AdminHeader from '../../Admin/adminHeader/AdminHeader'

type LocationState = {
  post: {
    content: string
    title: string
    titleImg: string
    previewText: string
    postId: number
    id: number
  }
}
const regex = /<img.*?src="(.*?)"/g
interface ControllerAddPostProps {}
const AddPost: FC<ControllerAddPostProps> = () => {
  const handleEditorChange = (innerContent: any, editor: any) => {
    setContent(innerContent)
  }

  const location = useLocation<LocationState | undefined>()

  const props = location.state

  const [title, setTitle] = useState<string>()
  const [titleImage, setTitleImage] = useState<string[]>([])

  const [content, setContent] = useState<string>()

  const [previewText, setPreviewText] = useState<string>()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const history = useHistory()

  const { addToast } = useToasts()

  const createPost = () => {
    if (content) {
      setIsLoading(true)
      const src = content.matchAll(regex)
      const srcArray = Array.from(src)
      const images = srcArray.map(image => image[1])
      let i = 0
      const contentWithOutImages = content.replace(regex, () => {
        i++
        return `<img src="${i}"`
      })
      axios
        .post(`/admin/add-post`, {
          images: images,
          content: contentWithOutImages,
          titleImg: titleImage[0],
          title: title,
          previewText: previewText,
        })
        .then(() => {
          setIsLoading(false)
          addToast('Post created', {
            appearance: 'success',
          })
          history.push('/admin/blogTable')
        })
        .catch(() => {
          addToast('Something wrong, please try again later', {
            appearance: 'error',
          })
          setIsLoading(false)
        })
    }
  }

  const updatePost = () => {
    console.log(content, props)
    if (content && props) {
      setIsLoading(true)
      const src = content.matchAll(regex)
      const srcArray = Array.from(src)
      const images = srcArray.map(image => image[1])
      let i = 0
      const contentWithOutImages = content.replace(regex, () => {
        i++
        return `<img src="${i}"`
      })
      axios
        .put(`/admin/update-post`, {
          images: images,
          content: contentWithOutImages,
          titleImg: titleImage[0],
          title: title,
          previewText: previewText,
          id: props.post.id,
        })
        .then(() => {
          setIsLoading(false)
          addToast('Post updated', {
            appearance: 'success',
          })
          history.push('/admin/blogTable')
        })
        .catch(() => {
          addToast('Something wrong, please try again later', {
            appearance: 'error',
          })
          setIsLoading(false)
        })
    }
  }

  useEffect(() => {
    if (props) {
      setTitle(props.post.title)
      setTitleImage([props.post.titleImg])
      setPreviewText(props.post.previewText)
    }
  }, [props])

  return (
    <div>
      <AdminHeader />
      <Preloader isLoading={isLoading} />
      <Editor
        initialValue={props?.post.content}
        apiKey="2a5j3zv485lz12e39kwm48dyrs61drkph0k8ksntwsbfjhhh"
        init={{
          paste_data_images: true,
          images_replace_blob_uris: true,
          images_file_types: 'jpeg,jpg,png',
          skin: 'snow',
          icons: 'thin',
          placeholder: 'Ask a question or post an update...',
          height: 600,
          menubar: true,
          plugins: [
            'advlist autolink lists link image charmap preview anchor',
            'searchreplace visualblocks code fullscreen textcolor ',
            'insertdatetime media table paste code help wordcount',
          ],
          textcolor_rows: '4',
          toolbar:
            'undo redo | styleselect | fontsizeselect| code | bold italic | alignleft aligncenter alignright alignjustify | outdent indent ',
        }}
        onEditorChange={handleEditorChange}
        outputFormat="html"
      />
      <div className="titleInputsAndImage">
        <FileInput
          files={titleImage}
          setFiles={setTitleImage}
          filesLimit={1}
          fileNames={props && ['prev Image']}
        />
        <div className="titleInputs">
          <input
            className="wrapper_form__input"
            value={title}
            onChange={event => setTitle(event.currentTarget.value)}
            type="text"
            placeholder="Article title"
          />
          <textarea
            className="wrapper_form__input"
            maxLength={200}
            value={previewText}
            onChange={event => setPreviewText(event.currentTarget.value)}
            placeholder="Preview text"
          />
        </div>
      </div>
      <div className="titleInputsAndImage">
        {!props ? (
          <button className="wrapper_form__button" onClick={() => createPost()}>
            Submit
          </button>
        ) : (
          <button className="wrapper_form__button" onClick={() => updatePost()}>
            Update
          </button>
        )}
      </div>
    </div>
  )
}

export default AddPost
