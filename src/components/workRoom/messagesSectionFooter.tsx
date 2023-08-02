import { Box, styled, useMediaQuery, useTheme } from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { IChatUserThread } from 'global/interfaces/chatThread';
import React, { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Editor as TinyMCEEditor } from 'tinymce';
import { CheckDoneIcon } from 'components/icon/CheckDoneIcon';
import { PlusIcon } from 'components/icon/PlusIcon';
import { SmileIcon } from 'components/icon/SmileIcon';
import { LinkIcon } from 'components/icon/LinkIcon';
import { triggerTyping } from 'services/chatMessageService';

interface IMessagesSectionFooterProps {
  selectedThread: IChatUserThread | undefined;
  initialValue: string | undefined;
  scrollToBottom: () => void;
  setEditorRef: (editor: TinyMCEEditor) => void;
  onSendClick: () => void;
  onUploadClick: () => void;
  onOpenDeliverablesForApprovalClick: () => void;
  isFirstTyping: boolean;
  setIsFirstTyping: React.Dispatch<boolean>;
  hasActiveSellingContract: boolean;
}

interface IMessageFooterBoxProps {
  isMobile: boolean;
  hasActiveSellingContract: boolean;
}

const MessageFooterBox = styled(Box, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: prop => prop !== 'isMobile' && prop !== 'hasActiveSellingContract',
})<IMessageFooterBoxProps>(({ isMobile, hasActiveSellingContract, theme }) => ({
  backgroundColor: theme.palette.grey[50],
  border: isMobile ? 'none' : `1px solid ${theme.palette.grey[200]}`,
  borderTop: 'none',
  paddingTop: '1px',
  paddingLeft: isMobile ? '0px' : '16px',
  paddingRight: isMobile ? '0px' : '16px',
  paddingBottom: isMobile ? '0px' : '16px',
  position: 'relative',
  '.tox-tinymce': {
    border: isMobile ? 'none' : `1px solid ${theme.palette.grey[300]}`,
    borderTop: `1px solid ${theme.palette.grey[300]}`,
    marginBlockEnd: '0px',
  },
  '.tox .tox-toolbar': {
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignContent: 'flex-end',
  },
  '.tox .tox-toolbar__primary': {
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignContent: 'flex-end',
    backgroundImage: 'none',
  },
  '.tox:not(.tox-tinymce-inline).tox-tinymce--toolbar-bottom div.tox-editor-header': {
    borderTop: 'none',
  },
  '.tox .tox-toolbar__group button:last-child': {
    backgroundColor: theme.palette.primary[500],
    marginLeft: '8px',
    cursor: 'pointer',
    textTransform: 'none',
    fontWeight: 500,
    lineHeight: '16px',
    fontFamily: 'Inter',
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none',
    },
    fontSize: '14px',
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    height: '32px',
    color: theme.palette.common.white,
    borderRadius: '4px',
  },
  '.tox .tox-toolbar__group button': {
    cursor: 'pointer',
  },
  '.tox .tox-toolbar__group button:hover': {
    backgroundColor: theme.palette.grey[100],
    borderRadius: '45%',
  },
  '.tox .tox-toolbar__group button:last-child:hover': {
    backgroundColor: theme.palette.primary[600],
    borderRadius: '4px',
  },
  '.tox .tox-toolbar__group button:last-child span': {
    fontWeight: 500,
    cursor: 'pointer',
  },
  '.tox .tox-tbtn svg': {
    stroke: theme.palette.grey[500],
    fill: theme.palette.grey[500],
  },
  '.tox .tox-tbtn svg:hover': {
    fill: theme.palette.grey[500],
  },
  '.tox .tox-toolbar__group button:nth-of-type(2)': {
    display: hasActiveSellingContract ? 'inherit' : 'none',
  },
}));

export default function MessagesSectionFooter(props: IMessagesSectionFooterProps): JSX.Element {
  const pluginValues: string[] =
    props.selectedThread?.active !== true
      ? ['autolink', 'autoresize']
      : ['emoticons', 'autolink', 'link', 'autoresize'];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (props.isFirstTyping === true) return;
      if (count >= 30) {
        props.setIsFirstTyping(true);
        setCount(0);
        clearInterval(interval);
      } else {
        setCount(count => count + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [count, props.isFirstTyping]);

  useEffect(() => {
    if (!props.isFirstTyping) {
      triggerTyping(props.selectedThread?.chatThreadId as string);
    }
  }, [props.isFirstTyping, props.selectedThread?.chatThreadId]);

  const handleTyping = () => {
    if (props.isFirstTyping) {
      props.setIsFirstTyping(false);
    }
  };

  return (
    <MessageFooterBox isMobile={isMobile} hasActiveSellingContract={props.hasActiveSellingContract}>
      {props.selectedThread !== undefined && (
        <Editor
          key={props.selectedThread?.chatThreadId}
          apiKey="fv262fzee7obv9hkyci9uyq0g2hgm186kpi3dnlgvqd17c6h"
          initialValue={props.initialValue}
          disabled={!props.selectedThread.active}
          onEditorChange={handleTyping}
          onInit={(evt, editor): void => {
            props.scrollToBottom();
            props.setEditorRef(editor);
          }}
          init={{
            placeholder: 'Send a message',
            max_height: 300,
            min_height: 100,
            width: '100%',
            menubar: false,
            resize: false,
            branding: false,
            inline: false,
            setup: function (editor) {
              editor.ui.registry.addIcon('approval_icon', ReactDOMServer.renderToString(<CheckDoneIcon />));
              editor.ui.registry.addIcon('smile_icon', ReactDOMServer.renderToString(<SmileIcon />));
              editor.ui.registry.addIcon('add_icon', ReactDOMServer.renderToString(<PlusIcon />));
              editor.ui.registry.addIcon('link_icon', ReactDOMServer.renderToString(<LinkIcon />));
              editor.ui.registry.addButton('send_btn', {
                text: 'Send',
                tooltip: 'Send',
                enabled: props.selectedThread?.active,
                onAction: props.onSendClick,
              });
              editor.ui.registry.addButton('upload_btn', {
                tooltip: 'Upload Files',
                icon: 'add_icon',
                enabled: true,
                onAction: props.onUploadClick,
              });
              editor.ui.registry.addButton('emoticon_btn', {
                tooltip: 'Emojis',
                icon: 'smile_icon',
                enabled: true,
                onAction: function () {
                  editor.execCommand('mceEmoticons');
                },
              });
              editor.ui.registry.addButton('link_btn', {
                tooltip: 'Link',
                icon: 'link_icon',
                enabled: true,
                onAction: function () {
                  editor.execCommand('mceLink');
                },
              });
              editor.ui.registry.addButton('approval_btn', {
                tooltip: 'Send Deliverables For Approval',
                icon: 'approval_icon',
                enabled: true,
                onAction: props.onOpenDeliverablesForApprovalClick,
              });
            },
            toolbar_location: 'bottom',
            plugins: pluginValues,
            default_link_target: '_blank',
            autoresize_overflow_padding: 0,
            autoresize_bottom_margin: 0,
            valid_elements: 'strong,em,span[style],a[href|target=_blank],p',
            toolbar: 'upload_btn approval_btn emoticon_btn link_btn send_btn',
            link_title: false,
            link_target_list: false,
            statusbar: false,
            content_style: `@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
      body p, .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before { 
      font-size: 16px; 
      font-family: "Inter"; 
      letter-spacing: 0.01071em; 
      margin-block-start: 0px; 
      margin-block-end: 0px;
    } 
    body.mce-content-body { 
      margin-bottom: 0px;
      font-family: "Inter";
      min-height: 0px;
    }
    body.mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before { 
      font-size: 16px; 
    } 
    `,
          }}
        />
      )}
    </MessageFooterBox>
  );
}
