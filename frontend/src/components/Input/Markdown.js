import React, { memo } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const Markdown = ({ label, value, changeValue, name, invalidField, setInvalidField }) => {
    return (
        <div className='flex flex-col gap-2'>
            <span className='block text-sm font-medium text-gray-700'>{label}</span>
            <Editor
                apiKey={process.env.REACT_APP_MCETINY}
                initialValue={value}
                init={{
                    height: 400,
                    menubar: true,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'print', 'preview', 'anchor',
                        'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'paste', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic backcolor forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                onChange={(e) => changeValue(prev => ({ ...prev, [name]: e.target.getContent() }))}
                onFocus={() => setInvalidField && setInvalidField(prev => ({ ...prev, [name]: false }))}
            />
            {invalidField[name] && <span className='text-red-500 text-xs'>{invalidField[name]?.message}</span>}
        </div>
    );
}

export default memo(Markdown)