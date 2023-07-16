// SpeakerSection.js

import React, { useState } from 'react';
import Modal from './Modal';

const SpeakerSection = ({ addComment }) => {
  const [speakers, setSpeakers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const showModalHandler = () => {
    setShowModal(true);
  };

  const hideModalHandler = () => {
    setShowModal(false);
  };

  const modalSubmitHandler = (url, status) => {
    // APIエンドポイントにURLとステータスを渡してデータを取得
    fetch(`/api/speaker?eventUrl=${url}&status=${status}`)
      .then((response) => response.json())
      .then((datas) => {
        // speakersの状態を更新
        setSpeakers(datas);
        // モーダルを非表示にする
        hideModalHandler();
      })
      .catch((error) => {
        console.error('Failed to fetch participants:', error);
        // エラーメッセージを表示するなどの適切なエラーハンドリングを行う
      });
  };

  return (
    <div>
      <h2>登壇者</h2>
      <ol>
        {speakers.map((speaker, index) => (
          <li key={index}>{speaker}</li>
        ))}
      </ol>
      <button onClick={showModalHandler}>登壇者リストを作成</button>
      {showModal ? (
        <Modal modalSubmit={modalSubmitHandler} hideModal={hideModalHandler} />
      ) : null}
    </div>
  );
};

export default SpeakerSection;
