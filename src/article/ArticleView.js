import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import {
  Container,
  Typography,
  Box,
  List,
  TextField,
  Button,
  ListItem,
  Link,
  Paper,
  Divider,
  Stack,
  Avatar,
  Rating,
  IconButton,
  Tooltip
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { fetchArticleRequest, fetchFragmentsRequest, addMarkRequest, addCommentRequest, fetchRootCommentsRequest } from "../healthSlice";

const formatTextParts = (parts) => {
  return parts.map((part, index) => {
    switch (part.type) {
      case "bold":
        return <b key={index}>{part.value}</b>;
      case "cursive":
        return <i key={index}>{part.value}</i>;
      case "link":
        return (
          <Link key={index} href={part.link} target="_blank" rel="noopener">
            {part.value }
          </Link>
        );
      default:
        return <span key={index}>{part.value}</span>;
    }
  });
};

const ArticleView = () => {
  const { articleId } = useParams();

  const [textComment, setTextComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyToName, setReplyToName] = useState('Иван');
  const [orders, setOrders] = useState(new Map()); 
  const [replies, setReplies] = useState(new Map());

  const article = useSelector((state) => state.health.article);
  const fragments = useSelector((state) => state.health.fragments);
  const rootComments = useSelector((state) => state.health.rootComments);
  const addedComment = useSelector((state) => state.health.addedComment);

  const dispatch = useDispatch();

  console.log('article id is: ' + articleId);

  useEffect(() => {
    dispatch(fetchArticleRequest({articleId: articleId}));
    dispatch(fetchRootCommentsRequest({articleId: articleId, page: 0, limit: 25}));
  }, []);
  
  useEffect(() => {
    dispatch(fetchFragmentsRequest({articleId: articleId, page: 0, limit: 25}));
  }, [article]);

  useEffect(() => {
    setTextComment("");
    setReplyTo(null);
  }, [addedComment]);

  useEffect(() => {
    rootComments.forEach(rc => fetchReplies(rc.id));
  }, [rootComments]);

  useEffect(() => {
    fragments.forEach(f => {
      console.log('getting orders: ' + f.id);
      fetchOrders(f.id);
    });
  }, [fragments]);
  
  const fetchOrders = async (fragmentId)=>{
    let res = await fetch("http://localhost:3000/fragments/" + fragmentId + '/orders?' + new URLSearchParams({
      page: 0,
      limit: 25
    }));
    const data = await res.json();
    console.log(data);
    orders.set(fragmentId, data.content);
    console.log('change orders');
    setOrders(new Map(orders));
    orders.get(fragmentId).map((o, idx) => console.log(o));
    console.log(orders);
  }

  const fetchReplies = async (commentId)=>{
    let res = await fetch("http://localhost:3000/comments/" + commentId + '/replies?' + new URLSearchParams({
      page: 0,
      limit: 25
    }));
    const data = await res.json();
    replies.set(commentId, data.content);
    setReplies(new Map(replies));
  }

  const handleCommentSubmit = () => {
    dispatch(addCommentRequest({articleId: article.id, comment: {text: textComment, replyTo: replyTo}}));
  };

  const handleRate = (value) => {
    dispatch(addMarkRequest({articleId: article.id, mark: {value: value}}));
  };


  if (!article) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        {article.title}
      </Typography>

      {article.image && (
        <Box key={article.image.id} sx={{ mb: 2 }}>
        <Box
          component="img"
          src={'http://localhost:3001/files/' + article.image.imageId}
          alt="Main Article"
          sx={{ width: "100%", borderRadius: 2, mb: 2 }}
        />
        {article.image.source && (
                <Typography variant="caption">
                  Источник: <Link href={article.image.source.link}>{article.image.source.description}</Link>
                </Typography>
        )}
        </Box>
      )}

      <Stack spacing={6}>
        {fragments && fragments.map((fragment, index) => (
          <Box key={index} sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {fragment.title}
            </Typography>
            <Stack spacing={2}>
              {orders.has(fragment.id) && orders.get(fragment.id).map((order, idx) => {
                switch (order.type) {
                  case "text":
                    return (
                      <div>
                      <Typography key={idx} variant="body1">
                        {formatTextParts(order.textParts)}
                      </Typography>
                      </div>
                    );
                  case "quote":
                    return (
                      <Paper
                        key={idx}
                        elevation={1}
                        sx={{ p: 2, borderLeft: "4px solid #ccc" }}
                      >
                        <Typography variant="body1" fontStyle="italic">
                          "{order.text}"
                        </Typography>
                        <Typography variant="caption" display="block" align="right">
                          — {order.name}
                        </Typography>
                      </Paper>
                    );
                  case "roll":
                    return (
                        <Paper key={idx}>
                      <List key={idx} sx={{ listStyleType: "decimal", pl: 4, bgcolor: '#f9f9f9', borderRadius: 1, py: 1 }}>
                        {order.rollElements.map((elem, elemIdx) => (
                          <ListItem
                            key={elemIdx}
                            sx={{ display: "list-item", py: 0.5 }}
                          >
                            {elem.text}
                          </ListItem>
                        ))}
                      </List>
                      </Paper>
                    );
                  case "image":
                    return (
                      <Box key={idx} sx={{ mb: 2 }}>
                        {order.image && (
                          <Box
                            component="img"
                            src={"http://localhost:3001/files/" + order.image.imageId}
                            alt="Fragment visual"
                            sx={{ width: "100%", borderRadius: 2 }}
                          />
                        )}
                        {order.sources?.length > 0 && (
                          <List>
                            {order.sources.map((source, sourceIdx) => (
                              <ListItem key={sourceIdx} sx={{ pl: 0 }}>
                                <Typography variant="caption">
                                  Source: <Link href={source.link}>{source.description}</Link>
                                </Typography>
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </Box>
                    );
                  case "article":
                    const refArticle = article.articleOptions?.find(a => a.id === order.articleId);
                    return refArticle ? (
                      <Paper key={idx} sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', bgcolor: '#f3f6f9' }}>
                        <Box component="img" src={refArticle.image} alt="ref" sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }} />
                        <Box>
                          <Link href={`/articles/${refArticle.id}`} variant="h6">
                            {refArticle.title}
                          </Link>
                          <Typography variant="caption" display="block">
                            by {refArticle.author} on {refArticle.createdAt}
                          </Typography>
                        </Box>
                      </Paper>
                    ) : null;
                  default:
                    return null;
                }
              })}
            </Stack>
          </Box>
        ))}
      </Stack>

      {article.sources?.length > 0 && (
        <Box mt={6}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Источники:
          </Typography>
          <List>
            {article.sources.map((source, sourceIndex) => (
              <ListItem disableGutters={true} key={sourceIndex} sx={{ display: 'list-item' }}>
                <Link href={source.source.link} target="_blank" rel="noopener">
                  {source.source.description}
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Box mt={6}>
        <Divider sx={{ mb: 2 }} />
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body1">Средняя оценка:</Typography>
          <Rating value={article.averageMark || 0} precision={0.5} onChange={(e, value) => { handleRate(value) }} />
          <Typography variant="caption">({article.averageMark || 0})</Typography>
          <Stack direction="row" alignItems="center">
          <Tooltip title="Views">
            <IconButton disabled>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="caption">{article.countViews || 0}</Typography>
          </Stack>
        </Stack>
      </Box>

      <Box mt={6}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Комментарии
        </Typography>
        <Stack spacing={3}>
          {(rootComments || []).map((rootComment, idx) => (
            <Box key={idx}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar>{rootComment.userId.toString().charAt(0)}</Avatar>
                <Box>
                  <Typography variant="subtitle2">{rootComment.userId}</Typography>
                  <Typography variant="body2" gutterBottom>{rootComment.text}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(rootComment.createdOn).toLocaleString('ru-RU')}
                  </Typography>
                  {!rootComment.replyTo && (
                    <Button size="small" onClick={() => setReplyTo(rootComment.id)}>
                      Ответить
                    </Button>
                  )}

                  {(replies.has(rootComment.id) || []).length > 0 && (
                    <Box mt={2} ml={4}>
                      <Stack spacing={2}>
                        {replies.get(rootComment.id).map((reply, ridx) => (
                          <Box key={ridx}>
                            <Stack direction='row' spacing={2} alignItems='flex-start'>
                            <Avatar>{reply.commentId.charAt(0)}</Avatar>
                              <Stack spacing={0.2}  alignItems="flex-start">
                                <Stack direction='row' spacing={1} alignItems='flex-start'>
                              <Typography variant="subtitle2">Иван</Typography>
                              <Typography variant="caption" color="text.secondary">
                              —
                            </Typography>

                            <Link href={`#comment-${idx}`}>@{rootComment.userId}</Link>
                            </Stack>
                              <Typography variant="body2">{reply.text}</Typography>
                              <Typography variant="caption" color="text.secondary">
                              {reply.createdOn}
                            </Typography>
                            {!rootComment.replyTo && (
                    <Button size="small" onClick={() => setReplyTo(reply.id)}>
                      Ответить
                    </Button>
                  )}
                              </Stack>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
        <TextField
          fullWidth
          label={replyTo ? `Replying to ${replyToName}` : "Поделитесь впечатлениями"}
          value={textComment}
          onChange={(e) => setTextComment(e.target.value)}
          multiline
          rows={3}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleCommentSubmit}>Submit</Button>
      </Box>
    </Container>
  );
};

export default ArticleView;
