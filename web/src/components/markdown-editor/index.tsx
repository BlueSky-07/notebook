import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ButtonWithTooltip,
  codeBlockPlugin,
  CodeToggle,
  CreateLink,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  headingsPlugin,
  imagePlugin,
  InsertCodeBlock,
  InsertTable,
  InsertThematicBreak,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  MDXEditorMethods,
  type MDXEditorProps,
  quotePlugin,
  Separator,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
  useCodeBlockEditorContext,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import styles from './styles.module.less';
import cs from 'classnames';
import { useRef } from 'react';
import { IconImage } from '@arco-design/web-react/icon';
import viewModeRefPlugin, { ViewModeRef } from './plugins/view-mode-ref';
import CodeEditor from './components/code-editor';

interface MarkdownEditorProps extends Pick<MDXEditorProps, 'readOnly'> {
  value?: string;
  placeholder?: string;
  onChange?: (content: string) => void;
  className?: string;
}

export const MarkdownEditor = (props: MarkdownEditorProps) => {
  const { value, onChange, placeholder } = props;
  const editorRef = useRef<MDXEditorMethods>(null);
  const viewModeRef = useRef<ViewModeRef>(null);

  if (editorRef.current && editorRef.current.getMarkdown() !== value) {
    editorRef.current.setMarkdown(value || '');
  }

  return (
    <div className={cs(styles.markdownEditor, props.className)}>
      <MDXEditor
        {...props}
        onError={(payload) => {
          console.error('MDXEditor error', payload);
          viewModeRef.current?.setViewMode('source');
        }}
        suppressHtmlProcessing={true}
        plugins={[
          headingsPlugin(),
          quotePlugin(),
          listsPlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          tablePlugin(),
          diffSourcePlugin({ viewMode: 'rich-text' }),
          linkPlugin(),
          imagePlugin({
            disableImageResize: true,
            disableImageSettingsButton: true,
            ImageDialog: () => null,
            imageUploadHandler: async (file) => {
              // drag or paste to upload image
              // todo upload image
              return 'http://image.com/image.png';
            },
          }),
          codeBlockPlugin({
            codeBlockEditorDescriptors: [
              {
                match: (languate, meta) => true,
                priority: 0,
                Editor: (codeBlockProps) => {
                  const ctx = useCodeBlockEditorContext();
                  return (
                    <div
                      onKeyDown={(e) =>
                        e.nativeEvent.stopImmediatePropagation()
                      }
                    >
                      <CodeEditor
                        language={codeBlockProps.language}
                        code={codeBlockProps.code}
                        onChangeLanguage={(language) =>
                          ctx.setLanguage(language)
                        }
                        onChangeCode={(code) => ctx.setCode(code)}
                      ></CodeEditor>
                    </div>
                  );
                },
              },
            ],
            defaultCodeBlockLanguage: 'text',
          }),
          viewModeRefPlugin({ ref: viewModeRef }),
          toolbarPlugin({
            toolbarContents: () => (
              <DiffSourceToggleWrapper options={['rich-text', 'source']}>
                <UndoRedo />
                <Separator />
                {/* Underline will use <u>, disable it */}
                <BoldItalicUnderlineToggles options={['Bold', 'Italic']} />
                <CodeToggle />
                <Separator />
                <ListsToggle />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <CreateLink />
                <InsertTable />
                <InsertThematicBreak />
                <InsertCodeBlock />
                <ButtonWithTooltip
                  title="Upload image"
                  onClick={() => {
                    // todo upload image
                    editorRef.current?.insertMarkdown(
                      `![image](http://image.com/image.png)`,
                    );
                  }}
                >
                  <IconImage style={{ fontSize: 24 }} />
                </ButtonWithTooltip>
              </DiffSourceToggleWrapper>
            ),
          }),
        ]}
        placeholder={placeholder}
        markdown={value}
        onChange={(markdown) => {
          onChange?.(markdown);
        }}
        ref={editorRef}
      />
    </div>
  );
};

export default MarkdownEditor;
