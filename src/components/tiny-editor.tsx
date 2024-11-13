import { envConfig } from '@/config/envConfig';
import { Editor, IAllProps } from '@tinymce/tinymce-react';

const pluginsInit = [
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
];

const TinyEditor = ({
    editableRoot = false,
    editorRef,
    ...props
}: IAllProps & {
    editableRoot?: boolean;
    editorRef: React.MutableRefObject<any>;
}) => {
    return (
        <Editor
            apiKey={envConfig.NEXT_PUBLIC_TINY_MCE_API_KEY}
            onInit={(_evt, editor) => (editorRef.current = editor)}
            init={{
                editable_root: editableRoot,
                resize: false,
                height: '80vh',
                menubar: false,
                plugins: pluginsInit,
                toolbar:
                    'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                content_style: `
                    body { font-family:Helvetica,Arial,sans-serif; font-size:14px } 
                    .mceNonEditable { 
                        cursor: not-allowed;
                    }
                    .mceEditable {
                    }`,
                noneditable_noneditable_class: 'mceNonEditable',
                noneditable_editable_class: 'mceEditable',
                ...props.init,
            }}
            {...props}
        />
    );
};

export default TinyEditor;
