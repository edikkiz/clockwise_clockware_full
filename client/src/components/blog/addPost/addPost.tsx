import './add-post-module.css'
import { Editor } from '@tinymce/tinymce-react'
import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import FileInput from '../../reusableСomponents/fileInput/FileInput'
import Preloader from '../../Preloader'
import { useToasts } from 'react-toast-notifications'
import AdminHeader from '../../Admin/adminHeader/AdminHeader'
import { Post } from 'src/models'
import { debounce } from 'debounce'

const regex = /<img.*?src="(.*?)"/g
const AddPost = () => {
  const { id: postId } = useParams<{ id: string }>()
  const [postContentForUpdate, setPostContentForUpdate] = useState<string>('')

  const [title, setTitle] = useState<string>('')

  const [previewImg, setPreviewImg] = useState<string>()

  const [content, setContent] = useState<string>('')

  const [previewText, setPreviewText] = useState<string>('')

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const history = useHistory()

  const { addToast } = useToasts()

  const textWithoutImgBlob = (text: string) => {
    let i = -1
    const contentWithoutImages = content.replace(regex, () => {
      i++
      return `<img src="${i}"`
    })
    return contentWithoutImages
  }

  const allImg = (text: string) => Array.from(text.matchAll(regex))

  const maxSymbolErr = debounce(() => {
    addToast('Max 10 000 symbol', { appearance: 'error' })
  }, 1000)

  const maxImagesErr = debounce(() => {
    addToast('Max 10 image', { appearance: 'error' })
  }, 1000)

  const handleEditorChange = (innerContent: string) => {
    if (textWithoutImgBlob(innerContent).length > 10500) {
      maxSymbolErr()
    }
    if (allImg(innerContent).length > 10) {
      maxImagesErr()
    }
    else {
      setContent(innerContent)
    }
  }

  const createPost = async () => {
    if (content) {
      try {
        setIsLoading(true)
        const srcArray = allImg(content)
        const images = srcArray.map(image => image[1])
        const contentWithoutImages = textWithoutImgBlob(content)
        await axios.post(`/admin/add-post`, {
          images: images,
          content: contentWithoutImages,
          previewImg: previewImg,
          title: title,
          previewText: previewText,
        })
        setIsLoading(false)
        addToast('Post created', {
          appearance: 'success',
        })
        history.push('/admin/blogTable')
      } catch {
        addToast('Something wrong, please try again later', {
          appearance: 'error',
        })
        setIsLoading(false)
      }
    } else {
      addToast('type content for post', { appearance: 'info' })
    }
  }

  const updatePost = async () => {
    if (content && postId) {
      try {
        setIsLoading(true)
        const srcArray = allImg(content)
        const images = srcArray.map(image => image[1])
        const contentWithoutImages = textWithoutImgBlob(content)
        await axios.put(`/admin/update-post`, {
          images: images,
          content: contentWithoutImages,
          previewImg: previewImg,
          title: title,
          previewText: previewText,
          id: Number(postId),
        })
        setIsLoading(false)
        addToast('Post updated', {
          appearance: 'success',
        })
        history.push('/admin/blogTable')
      } catch {
        addToast('Something wrong, please try again later', {
          appearance: 'error',
        })
        setIsLoading(false)
      }
    } else {
      addToast('type content for post', { appearance: 'info' })
    }
  }

  useEffect(() => {
    if (postId) {
      const getPostForUpdate = async () => {
        try {
          setIsLoading(true)
          const { data } = await axios.get<Post>('/one-post', {
            params: {
              id: postId,
            },
          })
          setTitle(data.title)
          setPreviewImg(data.previewImg)
          setPreviewText(data.previewText)
          setContent(data.content)
          setPostContentForUpdate(data.content)
          setIsLoading(false)
        } catch {
          addToast('Something wrong, please try again later', {
            appearance: 'error',
          })
          setIsLoading(false)
        }
      }
      getPostForUpdate()
    }
  }, [postId])

  return (
    <div>
      <AdminHeader />
      <Preloader isLoading={isLoading} />
      <Editor
        initialValue={postContentForUpdate}
        apiKey="2a5j3zv485lz12e39kwm48dyrs61drkph0k8ksntwsbfjhhh"
        init={{
          paste_data_images: true,
          images_replace_blob_uris: true,
          images_file_types: 'jpeg,jpg,png',
          skin: 'snow',
          icons: 'thin',
          placeholder: 'type here',
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
        value={content}
        onEditorChange={handleEditorChange}
        outputFormat="html"
      />
      <div className="title-inputs-and-image">
        <FileInput
          files={previewImg ? [previewImg] : []}
          setFiles={files => {
            setPreviewImg(files[0])
          }}
          filesLimit={1}
          fileNames={postId ? ['prev Image'] : []}
        />
        <div className="title-inputs">
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
      <div className="title-inputs-and-image">
        {postId ? (
          <button className="wrapper_form__button" onClick={() => updatePost()}>
            Update
          </button>
        ) : (
          <button className="wrapper_form__button" onClick={() => createPost()}>
            Submit
          </button>
        )}
      </div>
      <button onClick={() =>
        console.log(allImg(content))}>asdasd</button>
    </div>
  )
}

export default AddPost
