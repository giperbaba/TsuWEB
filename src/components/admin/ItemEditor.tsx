import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

interface ItemEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function ItemEditor({ value, onChange }: ItemEditorProps) {
    const editorRef = useRef<any>(null);

    return (
        <Editor
            apiKey="saq0ocgdsr9b8ku32huns1z7x09lrifh6exonjvpm3zda8ju" // TinyMCE API key
            onInit={(_, editor) => (editorRef.current = editor)}
            value={value}
            onEditorChange={onChange}
            init={{
                height: 150,
                menubar: false,
                branding: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'charmap',
                    'preview', 'anchor', 'searchreplace', 'visualblocks',
                    'code', 'fullscreen', 'insertdatetime', 'media',
                    'table', 'help', 'wordcount'
                ],
                toolbar:
                    'undo redo | fontselect fontsizeselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link table code | removeformat',
                font_formats:
                    'Roboto=Roboto,sans-serif;Raleway=Raleway,sans-serif;Arial=arial,helvetica,sans-serif;Times New Roman=times new roman,times;Courier New=courier new,courier;',
                content_style: `
                    @import url('https://fonts.googleapis.com/css2?family=Raleway&family=Roboto&display=swap');
                    body {
                        font-family: Roboto, sans-serif;
                        font-size: 14px;
                    }
                `,
                skin: 'oxide',
                content_css: 'default',
                toolbar_sticky: true,
            }}
        />
    );
}
