import { useRequest } from "ahooks"
import API from '@/services/api'
import { Space, Spin, Tag } from "@arco-design/web-react"
import styles from './styles.module.less'
import { IconBulb } from "@arco-design/web-react/icon"

export const AiInfo = () => {
  const aiInfoResponse = useRequest(() => API.ai.getInfo())

  if (aiInfoResponse.loading || !aiInfoResponse.data?.data) return <Spin loading={true} />
  const aiInfo = aiInfoResponse.data.data

  return (
    <div className={styles.aiInfo}>
      <Space direction="vertical">
        <span className={styles.label}><IconBulb /> AI</span>
        <Tag color={aiInfo.enabled ? 'green' : 'red'}>
          {aiInfo.enabled ? 'Ready' : 'Not Ready'}
        </Tag>
      </Space>
      <Space direction="vertical" className={styles.name}>
        <span>{aiInfo.provider}</span>
        <span>{aiInfo.modelName}</span>
      </Space>
    </div>
  )
}