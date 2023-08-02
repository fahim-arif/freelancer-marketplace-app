import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { IChatUserThread } from 'global/interfaces/chatThread';
import { getMessages, newTextMessage, markMessagesAsRead, getDisputesMessages } from 'services/chatMessageService';
import * as React from 'react';
import { ChatMessageType, IChatMessageDisplay, IChatTyping } from 'global/interfaces/chatMessage';
import IApiError from 'global/interfaces/api';
import { showUIError } from 'utils/errorHandler';
import List from '@mui/material/List';
import { AuthContext, AuthType } from 'contexts/AuthContext';
import { Editor as TinyMCEEditor } from 'tinymce';
import { InView } from 'react-intersection-observer';
import { useCustomEventListener } from 'react-custom-events';
import { MessagePublisherEventType } from 'global/enums/messagePublisherEventType';
import ChatMessageText from 'components/workRoom/chatMessageText';
import ChatMessageUpload from 'components/workRoom/chatMessageUpload';
import ChatMessagePayment from 'components/workRoom/chatMessagePayment';
import ChatMessagePaymentSuccessful from 'components/workRoom/chatMessagePaymentSuccessful';
import UploadFiles from 'components/workRoom/uploadFiles';
import ChatMessagReview from 'components/workRoom/chatMessageReview';
import ChatMessage, {
  FlexBox,
  MessageTiteTypography,
  StyledAvatar,
  StyledListItem,
  StyledListItemAvatar,
  TimeTypography,
} from 'components/workRoom/chatMessage';
import ChatMessageReviewComplete from 'components/workRoom/chatMessageReviewComplete';
import ChatMessageContractComplete from 'components/workRoom/chatMessageContractComplete';
import SendDeliverablesForApproval from 'components/workRoom/sendDeliverablesForApproval';
import ChatMessageContractCancelled from 'components/workRoom/chatMessageContractCancelled';
import { Divider, ListItemText, styled } from '@mui/material';
import MessagesSectionHeader from './messagesSectionHeader';
import MessagesSectionFooter from './messagesSectionFooter';
import { updateMessage } from './updateMessageDisplay';
import { BouncingLoaderIcon } from 'components/icon/BouncingLoaderIcon';
import ChatMessageConnectionAccepted from './chatMessageConnectionAccepted';
import ChatMessageConnectionRemoved from './chatMessageConnectionRemoved';
import { UserRole } from 'global/enums/userRole';
import { useLocation } from 'react-router-dom';

const MessageContentBox = styled(Box)(({ theme }) => ({
  height: '100%',
  overflowY: 'scroll',
  borderLeft: `1px solid ${theme.palette.grey[200]}`,
  borderRight: `1px solid ${theme.palette.grey[200]}`,
  overflowWrap: 'break-word',
  p: {
    marginBlockStart: '0px',
    marginBlockEnd: '0px',
  },
  backgroundColor: theme.palette.grey[50],
}));

const DateTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[600],
}));

const DateDivider = styled(Divider)(({ theme }) => ({
  borderColor: theme.palette.grey[200],
  marginLeft: '16px',
  marginRight: '16px',
}));

const StyledList = styled(List)(() => ({
  paddingBottom: '0px',
}));

// const StyledTypography = styled(Typography)(({ theme }) => ({
//   color: theme.palette.grey[700],
//   fontStyle: 'italic',
// }));

const DISPUTE_LOCATION = '/dispute';
const WORKROOM_LOCATION = '/workroom';

interface IMessagesSectionProps {
  selectedThread: IChatUserThread | undefined;
  isRightSectionCollapsed: boolean;
  handleLeftClick: () => void;
  handleRightClick: () => void;
  handleRightCollapseClick: () => void;
  teams: IChatUserThread[];
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
  hasActiveSellingContract: boolean;
}

export default function MessagesSection(props: IMessagesSectionProps): JSX.Element {
  const [initialValue, setInitialValue] = React.useState<string | undefined>('');
  const editorRef = React.useRef<TinyMCEEditor | null>(null);
  const messagesContainerRef = React.useRef<Element | null>();
  const messagesEndRef = React.useRef<Element | null>();
  const uploadRef = React.useRef<HTMLInputElement>(null);
  const authContext = React.useContext(AuthContext) as AuthType;
  const [messages, setMessages] = React.useState<IChatMessageDisplay[]>([]);
  const [loadingCompleted, setLoadingCompleted] = React.useState<boolean>(false);

  const [openSendDeliverablesForApproval, setOpenSendDeliverablesForApproval] = React.useState<boolean>(false);

  const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(null);

  const [typingRecipient, setTypingRecipient] = React.useState<IChatTyping>();
  const [isFirstTyping, setIsFirstTyping] = React.useState<boolean>(true);
  const [typingThreadId, setTypingThreadId] = React.useState<string | undefined>(undefined);

  // Start loading the previous page 10 items before we hit the top
  const infiniteItemsOffset = 10;
  // Page Size of 50 messages
  const numberOfItemsPerPage = 50;
  const [hasMorePages, setHasMorePages] = React.useState<boolean>(false);

  const [lastIndexOfNewPage, setLastIndexOfNewPage] = React.useState<number>(-1);
  const lastElementOfNewPageRef = React.useRef<Element | null>();

  const hasAdminRole = authContext.user && authContext.user.roles.indexOf(UserRole.Administrator) > -1;
  const location = useLocation();
  const pathname = location.pathname.toLowerCase();

  const addTemporaryTextMessage = (tempId: string, content: string, chatThreadId: string): void => {
    const tempMessage: IChatMessageDisplay = {
      id: tempId,
      userId: authContext.user?.id ?? '',
      chatThreadId,
      userDisplayName: `${authContext.user?.firstName ?? ''} ${authContext.user?.lastName ?? ''}`,
      createdDateTime: new Date().toUTCString(),
      content,
      messageType: ChatMessageType.Text,
      files: [],
      actioned: false,
    };

    setMessages(current => {
      const lastDate = current.length > 0 ? current[current.length - 1].date : '';
      updateMessage(tempMessage, lastDate ?? '', authContext, props.selectedThread);
      return [...current, tempMessage];
    });

    // Scroll to bottom to see new message and set focus again for the next message
    setInitialValue('');
    editorRef.current?.focus();
    scrollToBottom();
    uploadRef.current?.setAttribute('value', '');
    setSelectedFiles(null);
  };

  const onSendClick = (): void => {
    const content = editorRef.current?.getContent();

    if (props.selectedThread?.chatThreadId !== undefined && content !== undefined && content !== '') {
      setInitialValue(content);
      const tempId = new Date().getTime().toString(36);
      const newMessage = content ?? '';
      const chatThreadId = props.selectedThread?.chatThreadId ?? '';

      // Add temporary message immediately to the message window.
      // This is for a good UX, immediate feedback to the user!
      addTemporaryTextMessage(tempId, newMessage, chatThreadId);

      // Submit message to server and replace temporary message
      newTextMessage(chatThreadId, newMessage)
        .then(() => {
          // Remove temporary message. The real message will be added via Signal R
          setMessages(current => current.filter(p => p.id !== tempId));

          //Set typing back to being the first time typing
          setIsFirstTyping(true);
        })
        .catch((err: IApiError) => {
          showUIError('Could not send message. Please refresh the page: ' + err.message);
        });
    } else {
      if (props.selectedThread?.chatThreadId === undefined) {
        showUIError('No Chat Thread Id. Please contact support');
      }
      editorRef.current?.focus();
    }
  };

  const updateMessages = (result: IChatMessageDisplay[]): void => {
    let lastDate = '';
    for (const m of result) {
      lastDate = updateMessage(m, lastDate, authContext, props.selectedThread);
    }
    setMessages(result);
    setHasMorePages(result.length === numberOfItemsPerPage);
    scrollToBottom();
    setLoadingCompleted(true);
  };

  const loadMoreMessages = (inView: boolean): void => {
    if (inView && hasMorePages) {
      setLoadingCompleted(false);
      const skip = messages.length;
      const chatThreadId: string = props.selectedThread?.chatThreadId ?? '';
      getMessages(chatThreadId, skip, numberOfItemsPerPage)
        .then((res: IChatMessageDisplay[]) => {
          setMessages(current => {
            const newArray = [...res, ...current];
            let lastDate = '';
            for (const m of newArray) {
              lastDate = updateMessage(m, lastDate, authContext, props.selectedThread);
            }
            return newArray;
          });
          setHasMorePages(res.length === numberOfItemsPerPage);
          setLoadingCompleted(true);
          // Need to set the scroll position so the content doesn't jump
          setLastIndexOfNewPage(res.length - 1 + infiniteItemsOffset);
          lastElementOfNewPageRef?.current?.scrollIntoView(true);
        })
        .catch((err: IApiError) => {
          showUIError(err.message);
        });
    }
  };

  const scrollToBottom = (): void => {
    setTimeout(() => {
      messagesEndRef?.current?.scrollIntoView();
    }, 200);
  };

  const setEditorRef = (editor: TinyMCEEditor): void => {
    editorRef.current = editor;
  };

  const handleUploadFilesClose = (): void => {
    setTimeout(() => {
      editorRef.current?.focus();
    }, 200);
    uploadRef.current?.setAttribute('value', '');
    setSelectedFiles(null);
  };

  const onUploadClick = (): void => {
    uploadRef.current?.click();
  };

  const onOpenDeliverablesForApprovalClick = (): void => {
    setOpenSendDeliverablesForApproval(true);
  };

  const onCloseDeliverablesForApproval = (): void => {
    setOpenSendDeliverablesForApproval(false);
    setTimeout(() => {
      editorRef.current?.focus();
    }, 200);
  };

  const onSelectFiles = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files: FileList | null = e.target.files;
    setSelectedFiles(files);
  };

  React.useEffect(() => {
    const chatThreadId: string = props.selectedThread?.chatThreadId ?? '';
    uploadRef.current?.setAttribute('value', '');
    setSelectedFiles(null);
    setLastIndexOfNewPage(-1);
    setHasMorePages(false);
    setMessages([]);
    setLoadingCompleted(false);
    if (chatThreadId !== '' && pathname === WORKROOM_LOCATION) {
      getMessages(chatThreadId, 0, numberOfItemsPerPage)
        .then((res: IChatMessageDisplay[]) => {
          updateMessages(res);
          markMessagesAsRead(props.selectedThread?.chatThreadId ?? '');
        })
        .catch((err: IApiError) => {
          showUIError(err.message);
        });
    } else if (chatThreadId !== '' && hasAdminRole && pathname === DISPUTE_LOCATION) {
      if (props.selectedThread?.disputeRaisedById === undefined) {
        showUIError('Something went wrong');
        throw 'Dispute raised by user id cannot be empty';
      }

      getDisputesMessages(chatThreadId, 0, numberOfItemsPerPage, props.selectedThread!.disputeRaisedById)
        .then((res: IChatMessageDisplay[]) => {
          updateMessages(res);
        })
        .catch((err: IApiError) => {
          showUIError(err.message);
        });
    }
  }, [props.selectedThread, authContext.user]);

  React.useEffect(() => {
    if (messagesContainerRef === undefined || messagesContainerRef.current === undefined) return; // wait for the elementRef to be available
    const resizeObserver = new ResizeObserver(() => {
      scrollToBottom();
    });
    resizeObserver.observe(messagesContainerRef.current as Element);
    return () => resizeObserver.disconnect(); // clean up
  }, []);

  useCustomEventListener(
    MessagePublisherEventType[MessagePublisherEventType.NewMessage],
    (res: IChatMessageDisplay) => {
      if (res.chatThreadId === props.selectedThread?.chatThreadId) {
        setMessages(current => {
          const lastDate = current.length > 0 ? current[current.length - 1].date : '';
          updateMessage(res, lastDate ?? '', authContext, props.selectedThread);
          return [...current, res];
        });
        scrollToBottom();
        if (res.userId !== authContext.user?.id) {
          setTimeout(() => {
            markMessagesAsRead(res.chatThreadId);
          }, 500);
        }
      }
    },
    [props.selectedThread, authContext.user],
  );

  useCustomEventListener(
    MessagePublisherEventType[MessagePublisherEventType.UpdateMessage],
    (res: IChatMessageDisplay) => {
      if (res.chatThreadId === props.selectedThread?.chatThreadId) {
        setMessages(current => {
          const lastDateIndex = current.findIndex(p => p.id === res.id) - 1;
          const lastDate = lastDateIndex > 0 ? current[lastDateIndex].date : '';
          updateMessage(res, lastDate ?? '', authContext, props.selectedThread);
          return current.map(item => (item.id === res.id ? res : item));
        });
      }
    },
    [props.selectedThread, authContext.user],
  );

  useCustomEventListener(MessagePublisherEventType[MessagePublisherEventType.UserTyping], (res: IChatTyping) => {
    scrollToBottom();
    setTypingRecipient(res);
    props.setIsTyping(true);
    setTypingThreadId(res.id);

    setTimeout(() => {
      setTypingRecipient(res);
      props.setIsTyping(false);
      setTypingRecipient(undefined);
      setTypingThreadId(undefined);
    }, 30000);
  });

  const typingDisplayName = typingRecipient?.typingDisplayName ?? '';

  return (
    <Stack direction="column" spacing={0} sx={{ height: '100%' }}>
      <MessagesSectionHeader
        selectedThread={props.selectedThread}
        handleLeftClick={props.handleLeftClick}
        handleRightClick={props.handleRightClick}
        handleRightCollapseClick={props.handleRightCollapseClick}
        isRightSectionCollapsed={props.isRightSectionCollapsed}
        teams={props.teams}
      />
      <MessageContentBox ref={messagesContainerRef}>
        {props.selectedThread !== undefined && (
          <StyledList>
            {messages.map((item: IChatMessageDisplay, i: number) => (
              <React.Fragment key={i}>
                {(item.firstDate ?? false) && (
                  <DateDivider>
                    <DateTypography variant="subtitle2">{item.date}</DateTypography>
                  </DateDivider>
                )}
                {/* This next list item is to control the infinite scrolling
                     When this comes into view we will load another page
                */}
                {loadingCompleted && i === 10 && (
                  <InView as="div" onChange={inView => loadMoreMessages(inView)}></InView>
                )}
                {loadingCompleted && i === lastIndexOfNewPage && <Box ref={lastElementOfNewPageRef} />}
                <ChatMessage {...item}>
                  {item.messageType === ChatMessageType.Text && <ChatMessageText {...item} />}
                  {item.messageType === ChatMessageType.Payment && (
                    <ChatMessagePayment {...item} currentUserId={authContext.user?.id} />
                  )}
                  {item.messageType === ChatMessageType.PaymentSuccessful && (
                    <ChatMessagePaymentSuccessful {...item} currentUserId={authContext.user?.id} />
                  )}
                  {item.messageType === ChatMessageType.Upload && <ChatMessageUpload {...item} />}
                  {item.messageType === ChatMessageType.Review && (
                    <ChatMessagReview {...item} user={authContext.user} />
                  )}
                  {item.messageType === ChatMessageType.ReviewComplete && <ChatMessageReviewComplete {...item} />}
                  {item.messageType === ChatMessageType.ContractComplete && <ChatMessageContractComplete {...item} />}
                  {item.messageType === ChatMessageType.ContractCancelled && <ChatMessageContractCancelled {...item} />}
                  {item.messageType === ChatMessageType.ConnectionAccepted && (
                    <ChatMessageConnectionAccepted {...item} currentUserId={authContext.user?.id} />
                  )}
                  {item.messageType === ChatMessageType.ConnectionRemoved && (
                    <ChatMessageConnectionRemoved {...item} currentUserId={authContext.user?.id} />
                  )}
                </ChatMessage>
              </React.Fragment>
            ))}
            {props.isTyping && props.selectedThread.chatThreadId === typingThreadId && (
              <StyledListItem alignItems="flex-start" isSystemMessage={false}>
                <StyledListItemAvatar>
                  <StyledAvatar displayName={typingDisplayName} userId={typingRecipient?.typingUserId} />
                </StyledListItemAvatar>
                <ListItemText
                  primary={
                    <React.Fragment>
                      <FlexBox>
                        <MessageTiteTypography variant="subtitle1" isSystemMessage={false}>
                          {typingDisplayName}
                        </MessageTiteTypography>
                        <TimeTypography variant="caption">
                          {new Date().toLocaleTimeString('en-Us', {
                            hour12: true,
                            hour: 'numeric',
                            minute: 'numeric',
                          })}
                        </TimeTypography>
                      </FlexBox>
                    </React.Fragment>
                  }
                  secondary={<BouncingLoaderIcon width={80} height={80} />}
                  secondaryTypographyProps={{ component: 'div' }}
                />
              </StyledListItem>
            )}
          </StyledList>
        )}
        <Box ref={messagesEndRef} />
        <input ref={uploadRef} onChange={onSelectFiles} hidden accept="*" multiple type="file" />
      </MessageContentBox>
      <MessagesSectionFooter
        selectedThread={props.selectedThread}
        initialValue={initialValue}
        scrollToBottom={scrollToBottom}
        setEditorRef={setEditorRef}
        onSendClick={onSendClick}
        onUploadClick={onUploadClick}
        onOpenDeliverablesForApprovalClick={onOpenDeliverablesForApprovalClick}
        setIsFirstTyping={setIsFirstTyping}
        isFirstTyping={isFirstTyping}
        hasActiveSellingContract={props.hasActiveSellingContract}
      />
      <UploadFiles
        selectedThread={props.selectedThread}
        user={authContext.user}
        selectedFiles={selectedFiles}
        handleUploadFilesClose={handleUploadFilesClose}
        hasActiveSellingContract={props.hasActiveSellingContract}
      />
      <SendDeliverablesForApproval
        open={openSendDeliverablesForApproval}
        selectedThread={props.selectedThread}
        user={authContext.user}
        handleClose={onCloseDeliverablesForApproval}
      />
    </Stack>
  );
}
