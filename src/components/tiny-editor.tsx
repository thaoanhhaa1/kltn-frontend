import { envConfig } from '@/config/envConfig';
import { Editor, IAllProps } from '@tinymce/tinymce-react';

const TinyEditor = ({
    editorRef,
    ...props
}: IAllProps & {
    editorRef: React.MutableRefObject<any>;
}) => {
    return (
        <Editor
            apiKey={envConfig.NEXT_PUBLIC_TINY_MCE_API_KEY}
            onInit={(_evt, editor) => (editorRef.current = editor)}
            init={{
                editable_root: false,
                resize: false,
                height: '80vh',
                menubar: false,
                plugins: [
                    'advlist',
                    'autolink',
                    'lists',
                    'link',
                    'image',
                    'charmap',
                    'preview',
                    'anchor',
                    'searchreplace',
                    'visualblocks',
                    'code',
                    'fullscreen',
                    'insertdatetime',
                    'media',
                    'table',
                    'code',
                    'help',
                    'wordcount',
                ],
                toolbar:
                    'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
            {...props}
        />
    );
};

export default TinyEditor;
