import GithubMark from '@assets/svg/github-mark.svg';
import { Typography, Space, Link } from '@arco-design/web-react';
import { useNavigate } from 'react-router';
import styles from './styles.module.less';

const Welcome = () => {
  const navigate = useNavigate();
  return (
    <Space className={styles.welcome} direction="vertical">
      <Typography.Title>Notebook</Typography.Title>
      <span>
        Go <Link onClick={() => navigate('flow')}>Flow</Link>
      </span>
      <Link href="#" icon={<GithubMark className={styles.icon} />}>
        BlueSky-07/notebook - web
      </Link>
    </Space>
  );
};

export default Welcome;
