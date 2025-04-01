import { Menu, Tabs, Tag } from '@arco-design/web-react';
import { ReactNode } from 'react';
import FlowBrowser from '@/pages/flow/components/flow-browser';
import { FlowEntity } from '@api/models';
import styles from './styles.module.less';
import ModelSelector from '@/components/model-selector';
import useFlowStore, { type FlowState } from '@/stores/flow';
import { useShallow } from 'zustand/shallow';
import { FLOW_SIDER_ITEMS } from './const';

interface FlowSiderProps {
  flowId?: FlowEntity['id'];
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  collapsed?: boolean;
}

export const FlowSider = (props: FlowSiderProps) => {
  const { flowId, collapsed, activeTab, setActiveTab } = props;

  const { modelId, updateModelId } = useFlowStore(
    useShallow<FlowState, Pick<FlowState, 'modelId' | 'updateModelId'>>(
      (state) => ({
        modelId: state.modelId,
        updateModelId: state.updateModelId,
      }),
    ),
  );

  if (collapsed) {
    return (
      <Menu
        selectedKeys={[activeTab || FLOW_SIDER_ITEMS.flows.key]}
        onClickMenuItem={(menuItem) => {
          setActiveTab(menuItem);
        }}
      >
        {Object.values(FLOW_SIDER_ITEMS).map((item) => {
          return (
            <Menu.Item key={item.key}>
              {item.icon} {item.title}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }

  const renderTabPane = (
    item: (typeof FLOW_SIDER_ITEMS)[keyof typeof FLOW_SIDER_ITEMS],
    children: ReactNode,
  ) => {
    return (
      <Tabs.TabPane
        key={item.key}
        title={
          <span>
            {item.icon} {item.title}
          </span>
        }
      >
        <div className={styles.tabPaneBody}>{children}</div>
      </Tabs.TabPane>
    );
  };

  return (
    <div className={styles.flowSider}>
      <Tabs
        tabPosition="top"
        size="small"
        activeTab={activeTab || FLOW_SIDER_ITEMS.flows.key}
        onChange={(nextTab) => {
          setActiveTab(nextTab);
        }}
        animation={false}
      >
        {renderTabPane(FLOW_SIDER_ITEMS.flows, <FlowBrowser flowId={flowId} />)}
        {renderTabPane(
          FLOW_SIDER_ITEMS.models,
          <ModelSelector
            type="radio"
            id={modelId}
            onChange={updateModelId}
            notAvailableContent={
              <Tag color="red" size="small">
                AI Models Not Available
              </Tag>
            }
            selectProps={{
              placeholder: 'Model',
            }}
          />,
        )}
      </Tabs>
    </div>
  );
};
