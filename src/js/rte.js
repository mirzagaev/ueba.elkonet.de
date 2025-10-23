import {
    Editor
} from 'https://esm.sh/@tiptap/core@2.11.0';
import StarterKit from 'https://esm.sh/@tiptap/starter-kit@2.11.0';
import Placeholder from 'https://esm.sh/@tiptap/extension-placeholder@2.11.0';
import Paragraph from 'https://esm.sh/@tiptap/extension-paragraph@2.11.0';
import Bold from 'https://esm.sh/@tiptap/extension-bold@2.11.0';
import Underline from 'https://esm.sh/@tiptap/extension-underline@2.11.0';
import Link from 'https://esm.sh/@tiptap/extension-link@2.11.0';
import BulletList from 'https://esm.sh/@tiptap/extension-bullet-list@2.11.0';
import OrderedList from 'https://esm.sh/@tiptap/extension-ordered-list@2.11.0';
import ListItem from 'https://esm.sh/@tiptap/extension-list-item@2.11.0';
import Blockquote from 'https://esm.sh/@tiptap/extension-blockquote@2.11.0';

const editor = new Editor({
    element: document.querySelector('#hs-editor-tiptap [data-hs-editor-field]'),
    editorProps: {
        attributes: {
            class: 'relative min-h-40 p-3'
        }
    },
    extensions: [
        StarterKit.configure({
            history: false
        }),
        Placeholder.configure({
            placeholder: '...',
            emptyNodeClass: 'before:text-gray-500'
        }),
        Paragraph.configure({
            HTMLAttributes: {
                class: 'text-inherit text-gray-800 dark:text-neutral-200'
            }
        }),
        Bold.configure({
            HTMLAttributes: {
                class: 'font-bold'
            }
        }),
        Underline,
        Link.configure({
            HTMLAttributes: {
                class: 'inline-flex items-center gap-x-1 text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-white'
            }
        }),
        BulletList.configure({
            HTMLAttributes: {
                class: 'list-disc list-inside text-gray-800 dark:text-white'
            }
        }),
        OrderedList.configure({
            HTMLAttributes: {
                class: 'list-decimal list-inside text-gray-800 dark:text-white'
            }
        }),
        ListItem.configure({
            HTMLAttributes: {
                class: 'marker:text-sm'
            }
        }),
        Blockquote.configure({
            HTMLAttributes: {
                class: 'relative border-s-4 ps-4 sm:ps-6 dark:border-neutral-700 sm:[&>p]:text-lg'
            }
        })
    ]
});
const actions = [{
        id: '#hs-editor-tiptap [data-hs-editor-bold]',
        fn: () => editor.chain().focus().toggleBold().run()
    },
    {
        id: '#hs-editor-tiptap [data-hs-editor-italic]',
        fn: () => editor.chain().focus().toggleItalic().run()
    },
    {
        id: '#hs-editor-tiptap [data-hs-editor-underline]',
        fn: () => editor.chain().focus().toggleUnderline().run()
    },
    {
        id: '#hs-editor-tiptap [data-hs-editor-strike]',
        fn: () => editor.chain().focus().toggleStrike().run()
    },
    {
        id: '#hs-editor-tiptap [data-hs-editor-link]',
        fn: () => {
            const url = window.prompt('URL');
            editor.chain().focus().extendMarkRange('link').setLink({
                href: url
            }).run();
        }
    },
    {
        id: '#hs-editor-tiptap [data-hs-editor-ol]',
        fn: () => editor.chain().focus().toggleOrderedList().run()
    },
    {
        id: '#hs-editor-tiptap [data-hs-editor-ul]',
        fn: () => editor.chain().focus().toggleBulletList().run()
    },
    {
        id: '#hs-editor-tiptap [data-hs-editor-blockquote]',
        fn: () => editor.chain().focus().toggleBlockquote().run()
    },
    {
        id: '#hs-editor-tiptap [data-hs-editor-code]',
        fn: () => editor.chain().focus().toggleCode().run()
    }
];

actions.forEach(({
    id,
    fn
}) => {
    const action = document.querySelector(id);

    if (action === null) return;

    action.addEventListener('click', fn);
});