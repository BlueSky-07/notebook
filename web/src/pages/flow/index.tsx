import '@xyflow/react/dist/style.css';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { Layout, Typography } from '@arco-design/web-react';
import FlowDashboard from './components/dashboard';
import styles from './styles.module.less';
import { FlowSider } from '@/pages/flow/components/sider';
import { useState } from 'react';
import TipButton from '@/components/tip-button';
import { House, PanelLeftClose, PanelLeftOpen, Workflow } from 'lucide-react';
import Sketch from '@assets/svg/sketch.svg';

export const FlowPage = () => {
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
                type="outline"
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
            <div className={styles.title}>
              <Typography.Title heading={1} type="secondary">
                Welcome!
              </Typography.Title>
              <Typography.Title
                heading={6}
                type="secondary"
                className={styles.flex}
              >
                Open the <Workflow /> flow at left sider to start.
              </Typography.Title>
            </div>
            <div className={styles.background}>
              <Sketch />
            </div>
          </div>
        )}
      </Layout.Content>
    </Layout>
  );
};

export default FlowPage;
