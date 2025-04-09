import { Select } from '@arco-design/web-react';
import styles from './styles.module.less';
import MonacoEditor, { loader } from '@monaco-editor/react';
import { useEffect, useState } from 'react';

interface CodeEditorProps {
  language?: string;
  code?: string;
  onChangeLanguage: (language?: CodeEditorProps['language']) => void;
  onChangeCode: (code?: CodeEditorProps['code']) => void;
}

export const CodeEditor = (props: CodeEditorProps) => {
  const { language, code, onChangeLanguage, onChangeCode } = props;
  const [inited, setInited] = useState(false);

  useEffect(() => {
    loader.config({
      paths: {
        vs: location.origin + '/public/monaco-editor/min/vs',
      },
    });
    setInited(true);
  }, []);

  if (!inited) return null;

  return (
    <div className={styles.codeEditor}>
      <div className={styles.header}>
        <span>Code Block</span>
        <Select
          value={language}
          allowCreate={true}
          options={[
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
            { label: 'Text', value: 'text' },
          ]}
          onChange={(value) => onChangeLanguage(value)}
          size="mini"
          style={{
            width: 150,
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
          onChange={onChangeCode}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
