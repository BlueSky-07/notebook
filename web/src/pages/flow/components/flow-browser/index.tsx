import { useRequest } from 'ahooks'
import API from '@/services/api'
import { Button, Input, List, Space, Spin, Typography } from '@arco-design/web-react'
import { useState } from 'react'
import { FlowEntity } from '@api/models'
import { formatRelativeDate } from '@/utils/dayjs'

interface FlowBrowserProps {
  flowId?: FlowEntity['id']
  onViewFlow?: (flow: FlowEntity) => void
}

export const FlowBrowser = (props: FlowBrowserProps) => {
  const { flowId, onViewFlow } = props
  const [newName, setNewName] = useState<string>('')
  const listResp = useRequest((pageNumber?: number) => API.flow.getAllFlows(10, pageNumber), {
    pollingInterval: 5000
  })
  const createReq = useRequest((
    name: string
  ) => API.flow.addFlow({
    name,
    author: 'User'
  }), {
    manual: true
  })

  if (!listResp.data?.data) {
    return <Spin loading={listResp.loading}/>
  }
  const { items, count } = listResp.data.data
  return (
    <Space direction="vertical" style={{ width: '100%', height: '100%' }}>
      <Typography.Title heading={3}>
        Flows
      </Typography.Title>
      <Input.Group
        compact={true}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Input
          style={{ width: 220 }}
          placeholder="Pleace enter a name"
          prefix="New"
          value={newName}
          onChange={setNewName}
        />
        <Button
          type="primary"
          onClick={async () => {
            try {
              await createReq.runAsync(newName)
              setNewName('')
              listResp.run()
            } catch (error) {
            }
          }}
          loading={createReq.loading}
        >
          Create
        </Button>
      </Input.Group>
      <List<FlowEntity>
        dataSource={items}
        render={(item) => (
          <List.Item
            style={{ backgroundColor: flowId === item.id ? 'aliceblue' : undefined }}
            key={item.id}
            actions={[
              <Button
                key="view"
                onClick={() => {
                  onViewFlow?.(item)
                }}
                type='text'
                size='mini'
              >View</Button>
            ]}
          >
            <List.Item.Meta
              title={item.name}
              description={`updated ${formatRelativeDate(item.updatedAt)}`}
            />
          </List.Item>
        )}
        pagination={{
          current: (listResp.params[0] ?? 0) + 1,
          // hideOnSinglePage: true,
          pageSize: 10,
          total: count,
          showTotal: true,
          onChange: (pageNumber, pageSize) => {
            listResp.run(pageNumber - 1)
          }
        }}
      />
    </Space>
  )
}

export default FlowBrowser