import '@xyflow/react/dist/style.css';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { Layout, Typography } from '@arco-design/web-react';
import FlowDashboard from './components/dashboard';
import styles from './styles.module.less';
import { FlowSider } from '@/pages/flow/components/sider';
import { useState } from 'react';
import TipButton from '@/components/tip-button';
import { House, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export default function FlowPage() {
  const { flowId: flowIdParams } = useParams<{ flowId?: string }>();
  const [query, setQuery] = useSearchParams();
  const flowId = flowIdParams ? parseInt(flowIdParams, 10) : undefined;
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <Layout className={styles.flowPage}>
      <Layout.Sider
        className={styles.sider}
        width={300}
        collapsible={true}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        resizeDirections={!collapsed ? ['right'] : undefined}
        trigger={<div></div>}
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
        <div className={styles.footer}>
          {!collapsed ? (
            <>
              <TipButton
                tip="Go Back"
                shape="round"
                icon={<House style={{ width: 12, height: 12 }} />}
                onClick={() => {
                  navigate('/');
                }}
              >
                Home
              </TipButton>
              <TipButton
                tip="Hide Sider"
                shape="round"
                icon={<PanelLeftClose style={{ width: 12, height: 12 }} />}
                onClick={() => {
                  setCollapsed(true);
                }}
              />
            </>
          ) : (
            <TipButton
              tip="Show Sider"
              shape="round"
              icon={<PanelLeftOpen style={{ width: 12, height: 12 }} />}
              onClick={() => {
                setCollapsed(false);
              }}
            />
          )}
        </div>
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
