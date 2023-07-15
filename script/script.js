let comments = [];


// 一番下にスクロールする関数
const scrollToLatestComment = () => {
  const commentList = document.getElementById('comment-list');
  commentList.scrollTop = commentList.scrollHeight;
};


// コメントを表示する関数
const displayComments = () => {
  const commentList = document.getElementById('comment-list');
  commentList.innerText = '';

  comments.forEach(comment => {
    const listItem = document.createElement('li');
    listItem.textContent = `${comment.content}\t${comment.timestamp}`;
    commentList.appendChild(listItem);
  });

  scrollToLatestComment();
};

const formatTimestamp = timestamp => {
  const hours = timestamp.getHours().toString().padStart(2, '0');
  const minutes = timestamp.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};


// コメントを追加する関数
const addComment = event => {
  event.preventDefault();

  //const nameInput = document.getElementById('comment-name');
  const contentInput = document.getElementById('comment-input');

  const newComment = {
    content: contentInput.value,
    timestamp: formatTimestamp(new Date())
  };

  comments.push(newComment);
  displayComments();
  contentInput.value = '';
};


// モーダル要素を取得
const modal = document.getElementById('modal');

// モーダルを表示する関数
const showModal = () => {
  modal.style.display = 'block';
};

// モーダルを非表示にする関数
const hideModal = () => {
  modal.style.display = 'none';
};

// モーダルの送信ボタンクリック時の処理
const modalSubmit = () => {
  const urlInput = document.getElementById('url-input');
  const statusInput = document.getElementById('status-input');
  let speakers = document.getElementById('speaker-list');



  const url = urlInput.value;
  const status = statusInput.value;

  console.log(url);

  if (url && status) {

    if (speakers.children.length > 0) {
      speakers.innerText = '';
    }

    // APIエンドポイントにURLとステータスを渡してデータを取得
    fetch(`/api/speaker?eventUrl=${url}&status=${status}`)
      .then(response => response.json())
      .then(datas => {
        // データを処理する必要がある場合はここに追加する
        datas.sort(() => Math.random() - 0.5);
        
        datas.forEach(data => {
          const listItem = document.createElement('li');
          listItem.textContent = `${data}`;
          speakers.appendChild(listItem);
        });
        // モーダルを非表示にする
        hideModal();
      })
      .catch(error => {
        console.error('Failed to fetch participants:', error);
        // エラーメッセージを表示するなどの適切なエラーハンドリングを行う
      });
  }
};

// 登壇者リスト作成ボタンクリック時の処理
const speakerGetButton = document.getElementById('speaker-get');
speakerGetButton.addEventListener('click', showModal);

// モーダルの送信ボタンクリック時の処理
const modalSubmitButton = document.getElementById('modal-submit');
modalSubmitButton.addEventListener('click', modalSubmit);

// モーダルのキャンセルボタンクリック時の処理
const modalCancelButton = document.getElementById('modal-cancel');
modalCancelButton.addEventListener('click', hideModal);

document.addEventListener('DOMContentLoaded', displayComments);
document.getElementById('comment-form').addEventListener('submit', addComment);
