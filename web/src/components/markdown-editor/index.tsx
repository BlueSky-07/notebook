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
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import styles from './styles.module.less';
import cs from 'classnames';
import { useRef } from 'react';
import { IconImage } from '@arco-design/web-react/icon';
import viewModeRefPlugin, { ViewModeRef } from './plugins/view-mode-ref';
import MarkdownCodeEditor from './components/code-editor';
import { Upload } from '@arco-design/web-react';
import API from '@/services/api';
import { FileEntity } from '@api/models';
import { getFileEntityLink } from '@/utils/storage';

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
              const resp = await API.file.uploadFileObject(file);
              return getFileEntityLink(resp.data);
            },
          }),
          codeBlockPlugin({
            codeBlockEditorDescriptors: [
              {
                match: () => true,
                priority: 0,
                Editor: MarkdownCodeEditor,
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
                {/* todo fix not working */}
                {/*<CreateLink />*/}
                <ButtonWithTooltip title="Insert image">
                  <Upload
                    accept="image/*"
                    fileList={[]}
                    limit={1}
                    customRequest={async (customRequestProps) => {
                      const { file, onSuccess, onError, onProgress } =
                        customRequestProps;
                      try {
                        onProgress(10);
                        const resp = await API.file.uploadFileObject(file);
                        onSuccess(resp.data);
                        onProgress(100);
                      } catch (e) {
                        onError(e);
                      }
                    }}
                    onChange={(fileList) => {
                      const file = fileList.at(-1);
                      if (file && file.status === 'done') {
                        const typedFile = file.response as FileEntity;
                        editorRef.current?.insertMarkdown(
                          `![image](${getFileEntityLink(typedFile)})`,
                        );
                      }
                    }}
                    showUploadList={false}
                  >
                    <IconImage style={{ fontSize: 24 }} />
                  </Upload>
                </ButtonWithTooltip>
                <InsertTable />
                <InsertCodeBlock />
              </DiffSourceToggleWrapper>
            ),
          }),
        ]}
        placeholder={placeholder}
        markdown={value || ''}
        onChange={(markdown) => {
          onChange?.(markdown);
        }}
        ref={editorRef}
      />
    </div>
  );
};

export default MarkdownEditor;
