import { useRequest } from 'ahooks';
import API from '@/services/api';
import { Input, List, Skeleton, Space } from '@arco-design/web-react';
import { FlowEntity } from '@api/models';
import { formatRelativeDate } from '@/utils/dayjs';
import styles from './styles.module.less';
import { useNavigate } from 'react-router';
import CreateFlow from './actions/create-flow';
import DeleteFlow from './actions/delete-flow';
import RenameFlow from './actions/rename-flow';
import { useState } from 'react';
import debounce from 'lodash-es/debounce';
import { MaybePromise } from '@/utils/type';

interface FlowBrowserProps {
  flowId?: FlowEntity['id'];
  // default: ['search', 'create', 'rename', 'delete', 'navigate'];
  features?: Array<
    'search' | 'create' | 'rename' | 'delete' | 'navigate' | 'select'
  >;
  onSelect?: (flowId: FlowEntity['id']) => MaybePromise<void>;
}

export const FlowBrowser = (props: FlowBrowserProps) => {
  const {
    flowId,
    features = ['search', 'create', 'rename', 'delete', 'navigate'],
  } = props;
  const [keyword, setKeyword] = useState<string>('');
  const navigate = useNavigate();
  const listResp = useRequest(
    (pageNumber?: number) => API.flow.getAllFlows(10, pageNumber, keyword),
    {
      pollingInterval: 5000,
    },
  );
  const debounceSearch = debounce(() => {
    listResp.run(0);
  }, 1000);

  return (
    <div className={styles.flowList}>
      <div className={styles.header}>
        {features.includes('search') && (
          <Input.Search
            placeholder="Search"
            style={{ marginRight: features.includes('create') ? 8 : 0 }}
            value={keyword}
            onChange={(nextKeyword) => {
              setKeyword(nextKeyword);
              debounceSearch();
            }}
            allowClear={true}
          />
        )}

        {features.includes('create') && (
          <CreateFlow
            onCreate={(newFlowId) => {
              navigate(`/flow/${newFlowId}`);
              listResp.run();
            }}
          />
        )}
      </div>

      <Skeleton
        loading={!listResp.data?.data}
        text={{ rows: 2, width: '90%' }}
        animation={true}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div className={styles.header}></div>
          {listResp.data?.data && (
            <List<FlowEntity>
              bordered={false}
              dataSource={listResp.data.data.items}
              render={(item) => (
                <List.Item
                  style={{
                    backgroundColor:
                      flowId === item.id ? 'aliceblue' : undefined,
                  }}
                  key={item.id}
                  actions={[
                    features.includes('rename') && (
                      <RenameFlow
                        flow={item}
                        onRename={() => {
                          listResp.run();
                        }}
                      />
                    ),
                    features.includes('delete') && (
                      <DeleteFlow
                        flow={item}
                        onDelete={() => {
                          listResp.run();
                          if (flowId === item.id) {
                            navigate('/flow');
                          }
                        }}
                      />
                    ),
                  ].filter(Boolean)}
                >
                  <div
                    className={styles.flowItem}
                    onClick={() => {
                      if (features.includes('navigate')) {
                        navigate(`/flow/${item.id}`);
                      }
                      if (features.includes('select')) {
                        props.onSelect?.(item.id);
                      }
                    }}
                  >
                    <div className={styles.name}>{item.name}</div>
                    <div className={styles.description}>
                      updated {formatRelativeDate(item.updatedAt)}
                    </div>
                  </div>
                </List.Item>
              )}
              pagination={{
                current: (listResp.params[0] ?? 0) + 1,
                // hideOnSinglePage: true,
                pageSize: 10,
                total: listResp.data.data.count,
                showTotal: true,
                onChange: (pageNumber, pageSize) => {
                  listResp.run(pageNumber - 1);
                },
              }}
            />
          )}
        </Space>
      </Skeleton>
    </div>
  );
};

export default FlowBrowser;
