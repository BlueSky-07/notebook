import '@xyflow/react/dist/style.css';
import { useParams, useSearchParams } from 'react-router';
import { Layout, Typography } from '@arco-design/web-react';
import FlowDashboard from './components/dashboard';
import styles from './styles.module.less';
import { FlowSider } from '@/pages/flow/components/sider';
import { useState } from 'react';

export default function FlowPage() {
  const { flowId: flowIdParams } = useParams<{ flowId?: string }>();
  const [query, setQuery] = useSearchParams();
  const flowId = flowIdParams ? parseInt(flowIdParams, 10) : undefined;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className={styles.flowPage}>
      <Layout.Sider
        className={styles.sider}
        width={300}
        collapsible={true}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        resizeDirections={!collapsed ? ['right'] : undefined}
      >
        <FlowSider
          activeTab={query.get('tab')}
          setActiveTab={(tab) => {
            setQuery({ tab });
            setCollapsed(false);
          }}
          flowId={flowId}
          collapsed={collapsed}
        />
      </Layout.Sider>
      <Layout.Content>
        {flowId && <FlowDashboard flowId={flowId} />}
        {!flowId && (
          <div className={styles.welcome}>
            <Typography.Title style={{ color: 'gray' }}>
              Welcome!
              <br />
              Open a flow at left panel to start.
            </Typography.Title>
          </div>
        )}
      </Layout.Content>
    </Layout>
  );
}
