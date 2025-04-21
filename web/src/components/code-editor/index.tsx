import { useEffect, useRef, useState } from 'react';
import MonacoEditor, { loader } from '@monaco-editor/react';
import { ResizeBox } from '@arco-design/web-react';
import styles from './styles.module.less';

interface CodeEditorProps {
  language?: string;
  code?: string;
  onChange?: (code?: string) => void;
  disabled?: boolean;
}

export const CodeEditor = (props: CodeEditorProps) => {
  const { language, code, onChange, disabled } = props;
  const [initialized, setInitialized] = useState(false);
  const codeEditorContainerRef = useRef<HTMLDivElement>(null);

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
      <ResizeBox
        directions={['bottom']}
        onMovingStart={() => {
          if (codeEditorContainerRef.current)
            codeEditorContainerRef.current.style.removeProperty('height');
        }}
        className={styles.resizeBox}
      >
        <div
          ref={codeEditorContainerRef}
          style={{ height: 150 }}
          className={styles.codeContainer}
        >
          <MonacoEditor
            options={{
              readOnly: disabled,
              minimap: { enabled: false },
              // theme: 'vs-dark',
              automaticLayout: true,
              wordWrap: 'on',
            }}
            language={language}
            value={code}
            onChange={onChange}
          />
        </div>
      </ResizeBox>
    </div>
  );
};

export default CodeEditor;
