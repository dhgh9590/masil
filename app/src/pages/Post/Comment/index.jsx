import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { BASE_URL } from '../../../constants/api';
import axios from '../../../utils/token';
import TwoComment from './TwoComment';
import { useEffect } from 'react';

const Index = ({ newComment, id, commentHandleData, commentPage }) => {
  const [tabTwoComment, setTabTwoComment] = useState(); //대댓글이 몇번째 댓글에 달려야 하는지 위치 지정
  const [commentValue, setCommentValue] = useState(); //input 입력값 저장
  const [commentPut, setCommentPut] = useState(0); //댓글 생성,댓글 수정 확인
  const [commentPutTarget, setCommentPutTarget] = useState(); //댓글 수정 ID 담기
  const [commentValue2, setCommentValue2] = useState(); //대댓글 input 입력값 저장
  const [commentPut2, setCommentPut2] = useState(0); //대댓글 생성,댓글 수정 확인

  const [currentPageGroup, setCurrentPageGroup] = useState(1); //현재 페이지 그룹
  const [page, setPage] = useState();

  //첫번째 페이지 그룹 보이게 하기
  useEffect(() => {
    let commentPageCopy = [...commentPage];
    commentPageCopy = commentPageCopy.slice(0, 5);
    setPage(commentPageCopy);
  }, [commentPage]);

  function pagePlus() {
    setCurrentPageGroup(prev => prev + 1);
    let commentPageCopy = [...commentPage];
    commentPageCopy = commentPageCopy.slice(currentPageGroup * 5, (currentPageGroup + 1) * 5);
    setPage(commentPageCopy);
  }

  function pageMinus() {
    setCurrentPageGroup(currentPageGroup - 1);
    let commentPageCopy = [...commentPage];
    commentPageCopy = commentPageCopy.slice(currentPageGroup * 5, (currentPageGroup + 1) * 5);
    setPage(commentPageCopy);
  }

  console.log(page);

  //댓글 입력
  const handleComment = async () => {
    try {
      if (commentPut == 0) {
        await axios.post(`${BASE_URL}/posts/${id}/comments`, { content: commentValue });
      } else {
        await axios.patch(`${BASE_URL}/posts/${id}/comments/${commentPutTarget}`, { content: commentValue });
        setCommentPut(0);
      }

      setCommentValue('');
      commentHandleData();
    } catch (error) {
      console.log(error);
    }
  };

  //댓글 삭제
  const handleCommentRemove = async commentId => {
    try {
      await axios.delete(`${BASE_URL}/posts/${id}/comments/${commentId}`);
      commentHandleData();
    } catch (error) {
      console.log(error);
    }
  };

  //댓글 좋아요
  const handleCommentLike = async commentId => {
    try {
      await axios.put(`${BASE_URL}/comments/${commentId}/addLike`);
      commentHandleData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.comment_wrap}>
      <form
        className={styles.my_form}
        onSubmit={e => {
          e.preventDefault();
          handleComment();
        }}
      >
        <div className={styles.comment_input}>
          <div className={styles.input_box}>
            <div className={styles.user_img}></div>
            <input
              type="text"
              placeholder="칭찬과 격려의 댓글은 작성자에게 큰 힘이 됩니다 :)"
              value={commentValue || ''}
              onChange={e => {
                setCommentValue(e.target.value);
              }}
            />
            <button className={styles.btn}>입력</button>
          </div>
          {commentPut == 1 && (
            <div className={styles.cancel}>
              <em
                onClick={() => {
                  setCommentPut(0);
                  setCommentValue('');
                }}
              >
                수정 취소
              </em>
            </div>
          )}
        </div>
      </form>
      <div className={styles.comment_list}>
        {newComment && (
          <ul>
            {newComment.map(item => {
              return (
                <li key={item.id}>
                  <div className={styles.one_depth_comment}>
                    <div className={styles.user_img}></div>
                    <div className={styles.comment}>
                      <h4>{item.member.nickname}</h4>
                      <p>{item.content} </p>
                      <div className={styles.comment_info}>
                        <ul>
                          <li>
                            <em>{item.newTime}</em>
                          </li>
                          <li
                            onClick={() => {
                              setTabTwoComment(item.id);
                              setCommentValue('');
                              setCommentValue2('');
                              setCommentPut2(0);
                            }}
                          >
                            <em>답글 달기</em>
                          </li>
                          {item.owner == false && (
                            <li
                              onClick={() => {
                                handleCommentLike(item.id);
                              }}
                              className={`${item.liked == true && styles.active}`}
                            >
                              <FontAwesomeIcon icon={faHeart} className={styles.icon} />
                              <em>좋아요</em>
                            </li>
                          )}
                          {item.owner == false && (
                            <li>
                              <em>신고</em>
                            </li>
                          )}
                          {item.owner == true && (
                            <li
                              onClick={() => {
                                setCommentPut(1);
                                setCommentValue(item.content);
                                setCommentPutTarget(item.id);
                                setTabTwoComment(-1);
                              }}
                            >
                              <em>수정</em>
                            </li>
                          )}
                          {item.owner == true && (
                            <li
                              onClick={() => {
                                handleCommentRemove(item.id);
                              }}
                            >
                              <em>삭제</em>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <TwoComment
                    item={item}
                    commentHandleData={commentHandleData}
                    id={id}
                    tabTwoComment={tabTwoComment}
                    setTabTwoComment={setTabTwoComment}
                    handleCommentRemove={handleCommentRemove}
                    handleCommentLike={handleCommentLike}
                    commentValue2={commentValue2}
                    setCommentValue2={setCommentValue2}
                    commentPut2={commentPut2}
                    setCommentPut2={setCommentPut2}
                  ></TwoComment>
                </li>
              );
            })}
          </ul>
        )}
        <div className={styles.page_number}>
          <ul>
            <li
              onClick={() => {
                pageMinus();
              }}
            >
              <em>이전</em>
            </li>
            <li>
              <em>1</em>
            </li>
            <li>
              <em>2</em>
            </li>
            <li>
              <em>3</em>
            </li>
            <li>
              <em>4</em>
            </li>
            <li>
              <em>5</em>
            </li>
            <li
              onClick={() => {
                pagePlus();
              }}
            >
              <em>다음</em>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

Index.propTypes = {
  newComment: PropTypes.array,
  id: PropTypes.string,
  commentHandleData: PropTypes.func,
  commentPage: PropTypes.array,
};

export default Index;
