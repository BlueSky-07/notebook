import {
  Descriptions,
  Drawer,
  Dropdown,
  Menu,
  Spin,
} from '@arco-design/web-react';
import { UseGeneratingTask } from './use-generating-task';
import { Bot, Undo2, Redo2 } from 'lucide-react';
import { useState } from 'react';
import { formatRelativeDate } from '@/utils/dayjs';
import CodeEditor from '@/components/code-editor';
import ModelInfo from '@/components/model-info';
import TipButton from '@/components/tip-button';
import { GeneratingTaskStatusEnum } from '@api/models';
import styles from './styles.module.less';

type GeneratingTaskStatusProps = Pick<
  UseGeneratingTask,
  'id' | 'data' | 'status' | 'refresh'
> & {
  onUndo?: () => void;
  onRedo?: () => void;
};

export const GeneratingTaskStatus = (props: GeneratingTaskStatusProps) => {
  const { id, data, status, refresh, onUndo, onRedo } = props;
  const [visible, setVisible] = useState(false);

  return (
    <>
      {id && (
        <Dropdown
          onVisibleChange={(visible) => {
            if (visible && !data) {
              refresh();
            }
          }}
          droplist={
            <Menu>
              <Spin loading={!data}>
                {onUndo && (
                  <Menu.Item
                    key="undo"
                    onClick={() => {
                      onUndo?.();
                    }}
                  >
                    <div className={styles.statusMenuItem}>
                      <Undo2 className={styles.statusMenuItemIcon} />
                      Undo
                    </div>
                  </Menu.Item>
                )}
                {onRedo && (
                  <Menu.Item
                    key="redo"
                    onClick={() => {
                      onRedo?.();
                    }}
                  >
                    <div className={styles.statusMenuItem}>
                      <Redo2 className={styles.statusMenuItemIcon} />
                      Redo
                    </div>
                  </Menu.Item>
                )}
              </Spin>
            </Menu>
          }
          disabled={status !== GeneratingTaskStatusEnum.Done}
        >
          <div>
            <TipButton
              tip={data?.output?.errorMessage}
              icon={<Bot style={{ width: 16, height: 16 }} />}
              type="text"
              onClick={() => {
                setVisible(true);
                if (!data) refresh();
              }}
              status={
                (
                  {
                    [GeneratingTaskStatusEnum.Pending]: 'default',
                    [GeneratingTaskStatusEnum.Generating]: 'default',
                    [GeneratingTaskStatusEnum.Done]: 'success',
                    [GeneratingTaskStatusEnum.Stopped]: 'warning',
                    [GeneratingTaskStatusEnum.Failed]: 'danger',
                  } as Record<
                    string,
                    'default' | 'danger' | 'success' | 'warning'
                  >
                )[status || ''] || 'default'
              }
            >
              {status}
            </TipButton>
          </div>
        </Dropdown>
      )}
      <Drawer
        title="Generating Task Detail"
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        width={'min(100vw, 1000px)'}
        unmountOnExit={true}
        footer={null}
      >
        {data && (
          <>
            <Descriptions
              column={2}
              title="Basic Info"
              data={[
                {
                  label: 'Generating Task ID',
                  value: id,
                },
                {
                  label: 'Status',
                  value: status,
                },
                {
                  label: 'Target Node ID',
                  value: data.targetNodeId,
                },
                {
                  label: 'Updated At',
                  value: formatRelativeDate(data.updatedAt),
                },
              ]}
              style={{ marginBottom: 20 }}
              labelStyle={{ width: 200, paddingRight: 36 }}
              valueStyle={{ width: 400 }}
            />
            {data.input && (
              <Descriptions
                column={1}
                title="Input"
                data={[
                  {
                    label: 'Model',
                    value: <ModelInfo id={data.input.modelId} />,
                  },
                  {
                    label: 'Prompt',
                    value: (
                      <CodeEditor
                        language="json"
                        code={JSON.stringify(data.input.prompt, null, 2)}
                      />
                    ),
                  },
                ]}
                style={{ marginBottom: 20 }}
                labelStyle={{ width: 200, paddingRight: 36 }}
              />
            )}
            {data.output && (
              <Descriptions
                column={1}
                title="Output"
                data={[
                  {
                    label: 'Generated Text',
                    value: data.output.generatedText && (
                      <CodeEditor
                        language="markdown"
                        code={data.output.generatedText}
                      />
                    ),
                  },
                  {
                    label: 'Generated File ID',
                    value: data.output.generatedFile,
                  },
                  {
                    label: 'Generated Reasoning',
                    value: data.output.generatedReasoning && (
                      <CodeEditor
                        language="markdown"
                        code={data.output.generatedReasoning}
                      />
                    ),
                  },
                  {
                    label: 'Generated Tokens Usage',
                    value: data.output.generatedUsage && (
                      <CodeEditor
                        language="json"
                        code={JSON.stringify(
                          data.output.generatedUsage,
                          null,
                          2,
                        )}
                      />
                    ),
                  },
                  {
                    label: 'Error Message',
                    value: data.output.errorMessage,
                  },
                ].filter((item) => Boolean(item.value) || item.value === 0)}
                labelStyle={{ width: 200, paddingRight: 36 }}
              />
            )}
          </>
        )}
      </Drawer>
    </>
  );
};

export default GeneratingTaskStatus;
