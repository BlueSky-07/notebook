import { Select } from '@arco-design/web-react';
import styles from './styles.module.less';
import MonacoEditor, { loader } from '@monaco-editor/react';
import { FC, useEffect, useState } from 'react';
import TipButton from '@/components/tip-button';
import { IconDelete } from '@arco-design/web-react/icon';
import {
  activeEditor$,
  CodeBlockEditorProps,
  useCellValues,
  useCodeBlockEditorContext,
} from '@mdxeditor/editor';

export const CodeEditor: FC<CodeBlockEditorProps> = (props) => {
  const { language, code } = props;
  const ctx = useCodeBlockEditorContext();
  const [activeEditor] = useCellValues(activeEditor$);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    loader.config({
      paths: {
        vs: location.origin + '/public/monaco-editor/min/vs',
      },
    });
    setInitialized(true);
  }, []);

  if (!initialized) return null;

  return (
    <div
      className={styles.codeEditor}
      onKeyDown={(e) => e.nativeEvent.stopImmediatePropagation()}
    >
      <div className={styles.header}>
        <Select
          value={language}
          allowCreate={true}
          options={[
            { label: 'Text', value: 'text' },
            { label: 'JavaScript', value: 'javascript' },
            { label: 'TypeScript', value: 'typescript' },
            { label: 'Python', value: 'python' },
            { label: 'Java', value: 'java' },
            { label: 'C++', value: 'cpp' },
            { label: 'C', value: 'c' },
            { label: 'C#', value: 'csharp' },
            { label: 'Go', value: 'go' },
            { label: 'PHP', value: 'php' },
            { label: 'Ruby', value: 'ruby' },
            { label: 'Swift', value: 'swift' },
            { label: 'Kotlin', value: 'kotlin' },
            { label: 'Rust', value: 'rust' },
            { label: 'SQL', value: 'sql' },
            { label: 'HTML', value: 'html' },
            { label: 'JSON', value: 'json' },
            { label: 'YAML', value: 'yaml' },
            { label: 'Markdown', value: 'markdown' },
          ]}
          onChange={(value) => ctx.setLanguage(value)}
          size="mini"
          style={{
            width: 150,
          }}
        />
        <TipButton
          tip="Delete"
          icon={<IconDelete />}
          status="danger"
          type="text"
          size="mini"
          onClick={() => {
            activeEditor.update(() => {
              ctx.lexicalNode.remove();
            });
          }}
        />
      </div>
      <div className={styles.container}>
        <MonacoEditor
          options={{
            minimap: { enabled: false },
            // theme: 'vs-dark',
          }}
          height="100%"
          language={language}
          value={code}
          onChange={(value) => ctx.setCode(value)}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
