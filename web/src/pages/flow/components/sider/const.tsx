import { Bot, LayoutGrid, Workflow } from 'lucide-react';

export const FLOW_SIDER_ITEMS = {
  flows: {
    key: 'flows',
    title: 'Flows',
    icon: <Workflow />,
  },
  nodes: {
    key: 'nodes',
    title: 'Nodes',
    icon: <LayoutGrid />,
  },
  models: {
    key: 'models',
    title: 'Models',
    icon: <Bot />,
  },
};
