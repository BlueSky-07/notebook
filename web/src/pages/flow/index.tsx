import '@xyflow/react/dist/style.css'
import FlowBrowser from './components/flow-browser'
import { useParams, useNavigate } from 'react-router'
import { Layout, Typography } from '@arco-design/web-react'
import FlowDashboard from '@/pages/flow/components/flow-dashboard'

export default function FlowPage() {
  const { flowId } = useParams<{ flowId?: string }>()
  const navigate = useNavigate()

  return (
    <Layout style={{ width: '100vw', height: '100vh' }}>
      <Layout.Sider
        style={{ width: 300, padding: 10 }}
      >
        <FlowBrowser
          flowId={flowId ? parseInt(flowId, 10) : undefined}
          onViewFlow={flow => navigate(`/flow/${flow.id}`)}
        />
      </Layout.Sider>
      <Layout.Content>
        {flowId && <FlowDashboard flowId={flowId}/>}
        {!flowId && (
          <div style={{ height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography.Title style={{ color: 'gray' }}>
              Welcome @User!<br/>
              Open a flow at left panel to start.
            </Typography.Title>
          </div>
        )}
      </Layout.Content>
    </Layout>
  )
}
