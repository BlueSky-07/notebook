import { Menu, Tabs } from '@arco-design/web-react';
import { ReactNode } from 'react';
import FlowBrowser from '@/pages/flow/components/flow-browser';
import { FlowEntity } from '@api/models';
import styles from './styles.module.less';
import { FLOW_SIDER_ITEMS } from './const';
import ModelsPane from './panes/models-pane';
import NodesPane from './panes/nodes-pane';

interface FlowSiderProps {
  flowId?: FlowEntity['id'];
  activeTab?: string | null;
  setActiveTab?: (tab: string) => void;
  collapsed?: boolean;
}

export const FlowSider = (props: FlowSiderProps) => {
  const { flowId, collapsed, activeTab, setActiveTab } = props;

  if (collapsed) {
    return (
      <Menu
        selectedKeys={[activeTab || FLOW_SIDER_ITEMS.flows.key]}
        onClickMenuItem={(menuItem) => {
          setActiveTab?.(menuItem);
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
          setActiveTab?.(nextTab);
        }}
        animation={false}
      >
        {renderTabPane(FLOW_SIDER_ITEMS.flows, <FlowBrowser flowId={flowId} />)}
        {renderTabPane(FLOW_SIDER_ITEMS.nodes, <NodesPane />)}
        {renderTabPane(FLOW_SIDER_ITEMS.models, <ModelsPane />)}
      </Tabs>
    </div>
  );
};
