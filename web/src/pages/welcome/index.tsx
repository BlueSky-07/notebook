import GithubMark from '@assets/svg/github-mark.svg';
import {
  Typography,
  Space,
  Link,
  Layout,
  Tag,
  Divider,
  Dropdown,
  Menu,
} from '@arco-design/web-react';
import styles from './styles.module.less';
import { NotebookPen, Bot, Workflow, Settings } from 'lucide-react';
import FlowBrowser from '@/pages/flow/components/flow-browser';
import { ADMIN_LINKS } from './const';

const Welcome = () => {
  return (
    <Layout className={styles.welcome}>
      <Layout.Header>
        <div className={styles.header}>
          <Typography.Title className={styles.title}>
            <Space>
              <Space size={16}>
                <NotebookPen /> Notebook
              </Space>
              <Tag className={styles.tag}>
                <div className={styles.tagContent}>
                  <Bot className={styles.icon} />
                  <span>AI Powered</span>
                </div>
              </Tag>
            </Space>
          </Typography.Title>
          <Typography.Text type="secondary">
            A flow based note-taking tool.
          </Typography.Text>
        </div>
      </Layout.Header>
      <Layout.Content>
        <div className={styles.body}>
          <Typography.Title className={styles.subTitle} heading={5}>
            <Space size={12}>
              <Workflow className={styles.icon} /> Flows
            </Space>
          </Typography.Title>
          <FlowBrowser
            features={['search', 'create', 'navigate', 'show-count']}
          />
        </div>
      </Layout.Content>
      <Layout.Footer>
        <div className={styles.footer}>
          <Space>
            <Link
              href="https://github.com/BlueSky-07/notebook"
              target="_blank"
              rel="noopener noreferrer"
              icon={<GithubMark className={styles.icon} />}
              className={styles.link}
            >
              <Typography.Text type="secondary">
                BlueSky-07/notebook
              </Typography.Text>
            </Link>
            <Divider type="vertical" />
            <Typography.Text type="secondary">MIT License</Typography.Text>
          </Space>
          <Dropdown
            droplist={
              <Menu>
                {ADMIN_LINKS.map((link) => (
                  <Menu.Item key={link.label}>
                    <Link
                      href={link.getLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={
                        <span className={styles.popupLinkIcon}>
                          {link.icon}
                        </span>
                      }
                      className={styles.link}
                    >
                      <Typography.Text type="secondary">
                        {link.label}
                      </Typography.Text>
                    </Link>
                  </Menu.Item>
                ))}
              </Menu>
            }
          >
            <Link
              href="#"
              icon={<Settings className={styles.icon} />}
              className={styles.link}
            >
              <Typography.Text type="secondary">Admin</Typography.Text>
            </Link>
          </Dropdown>
        </div>
      </Layout.Footer>
    </Layout>
  );
};

export default Welcome;
