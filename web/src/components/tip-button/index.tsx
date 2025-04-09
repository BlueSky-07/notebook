import {
  Button,
  ButtonProps,
  Tooltip,
  TooltipProps,
  Popconfirm,
  PopconfirmProps,
} from '@arco-design/web-react';
import { useState } from 'react';

interface TipButtonProps extends ButtonProps {
  tip?: string;
  tooltipProps?: TooltipProps;
  popconfirmProps?: PopconfirmProps;
}

export const TipButton = (props: TipButtonProps) => {
  const { tip, tooltipProps, popconfirmProps, ...buttonProps } = props;
  const [popconfirmVisbile, setPopconfirmVisbile] = useState<boolean>(
    popconfirmProps?.popupVisible,
  );
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(
    tooltipProps?.popupVisible,
  );
  const button = (
    <Tooltip
      content={tip}
      disabled={!tip}
      {...tooltipProps}
      popupVisible={tooltipVisible}
      onVisibleChange={(visible) => {
        if (popconfirmVisbile) return;
        setTooltipVisible(visible);
        tooltipProps?.onVisibleChange?.(visible);
      }}
    >
      <Button {...buttonProps} />
    </Tooltip>
  );
  return popconfirmProps ? (
    <Popconfirm
      {...popconfirmProps}
      popupVisible={popconfirmVisbile}
      onVisibleChange={(visible) => {
        setPopconfirmVisbile(visible);
        popconfirmProps?.onVisibleChange?.(visible);
        if (visible) {
          setTimeout(() => setTooltipVisible(false), 100);
        }
      }}
    >
      {button}
    </Popconfirm>
  ) : (
    button
  );
};

export default TipButton;
