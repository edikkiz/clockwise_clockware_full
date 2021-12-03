// import './styles.css'
import { Editor } from '@tinymce/tinymce-react'
import axios from 'axios'
import { FC, useState } from 'react'

interface ControllerBlogProps {}
const Blog: FC<ControllerBlogProps> = () => {
  const handleEditorChange = (content: any, editor: any) => {
    setContent(content)
  }

  const [content, setContent] = useState<string>()

  const onUploadImage = async () => {
    await axios.post(`${process.env.REACT_APP_API_URL}/upload/img`, {
      content,
    })
  }

  return (
    <div>
      {/* // <Editor            blobInfo, success, failure, progress
    //   apiKey="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc"
    //   initialValue="Once upon a time..."
    //   // plugins="wordcount"
    //   init={{
    //     skin: "snow",
    //     icons: "thin",
    //     height: 500,
    //     menubar: false,
    //     plugins: ["wordcount"],
    //     toolbar:
    //       "undo redo | styleselect | fontsizeselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent"
    //   }}
    // /> */}
      <Editor
        apiKey="2a5j3zv485lz12e39kwm48dyrs61drkph0k8ksntwsbfjhhh"
        // initialValue="<p>This is the initial content of the editor</p>"
        init={{
          images_upload_handler: onUploadImage,
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
        // toolbar="code"
      />
      {/* <button onClick={() => onSubmit()}>Submit</button> */}
    </div>
  )
}

export default Blog
