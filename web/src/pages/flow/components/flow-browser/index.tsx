import { useRequest } from 'ahooks';
import API from '@/services/api';
import { Input, List, Skeleton, Space } from '@arco-design/web-react';
import { FlowEntityPopulatedCount } from '@api/models';
import { formatRelativeDate } from '@/utils/dayjs';
import styles from './styles.module.less';
import { useNavigate } from 'react-router';
import CreateFlow from './actions/create-flow';
import DeleteFlow from './actions/delete-flow';
import RenameFlow from './actions/rename-flow';
import { useState } from 'react';
import { debounce } from 'lodash-es';
import cs from 'classnames';
import { MaybePromise } from '@/utils/type';
import { LayoutGrid, Spline } from 'lucide-react';

interface FlowBrowserProps {
  flowId?: FlowEntityPopulatedCount['id'];
  // default: ['search', 'create', 'rename', 'delete', 'navigate', 'polling' ]
  features?: Array<
    | 'search'
    | 'create'
    | 'rename'
    | 'delete'
    | 'navigate'
    | 'select'
    | 'polling'
    | 'show-count'
  >;
  onSelect?: (flowId: FlowEntityPopulatedCount['id']) => MaybePromise<void>;
}

export const FlowBrowser = (props: FlowBrowserProps) => {
  const {
    flowId,
    features = ['search', 'create', 'rename', 'delete', 'navigate', 'polling'],
  } = props;
  const [keyword, setKeyword] = useState<string>('');
  const navigate = useNavigate();
  const listResp = useRequest(
    (pageNumber?: number) =>
      API.flow.getAllFlows(
        10,
        pageNumber,
        keyword,
        features.includes('show-count'),
      ),
    {
      pollingInterval: features.includes('polling') ? 5000 : undefined,
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
            <List<FlowEntityPopulatedCount>
              bordered={false}
              dataSource={listResp.data.data.items}
              render={(item) => (
                <List.Item
                  className={cs(styles.flowItem, {
                    [styles.selected]: flowId === item.id,
                  })}
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
                    features.includes('show-count') &&
                      (item.nodeCount || item.edgeCount ? (
                        <Space className={styles.count} size={16}>
                          {!!item.nodeCount && (
                            <div className={styles.countBody}>
                              <LayoutGrid className={styles.icon} />
                              <span>{item.nodeCount} Nodes</span>
                            </div>
                          )}
                          {!!item.edgeCount && (
                            <div className={styles.countBody}>
                              <Spline className={styles.icon} />
                              <span>{item.edgeCount} Edges</span>
                            </div>
                          )}
                        </Space>
                      ) : (
                        <div className={styles.count}>-</div>
                      )),
                  ].filter(Boolean)}
                >
                  <div
                    className={styles.flowItemBody}
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
