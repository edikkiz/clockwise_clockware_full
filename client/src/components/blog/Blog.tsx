import './styles.css'
import { Editor } from '@tinymce/tinymce-react'
import { FC } from 'react'

interface ControllerBlogProps {}
const Blog: FC<ControllerBlogProps> = () => {
  const handleEditorChange = (content: any, editor: any) => {
    console.log('Content was updated:', content)
  }

  return (
    <div>
      {/* // <Editor
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
        apiKey="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc"
        // initialValue="<p>This is the initial content of the editor</p>"
        init={{
          skin: 'snow',
          icons: 'thin',
          placeholder: 'Ask a question or post an update...',

          height: 200,
          menubar: true,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
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

      <input />
    </div>
  )
}

export default Blog
